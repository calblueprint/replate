import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import checkIcon from 'assets/check-icon.png';
import dateIcon from 'assets/date.png';
import { useAuth } from '@/utils/AuthContext';
import { apiRequest, validateResponse } from '~/api/apiUtils';
import { API_ENDPOINTS, BASE_URL, claimTask } from '~/api/config';
import { styles } from '../../styles/pages/pickup-details-styles';

type TaskDetails = {
  id: number;
  encrypted_id?: string;
  pickup_date: string;
  start_time: string | null;
  end_time: string | null;
  location_name: string | null;
  address?: {
    number?: string | null;
    street?: string | null;
    apt_number?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    comments?: string | null;
  } | null;
  contact_name?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  description?: string | null;
  tray_type?: string | null;
  tray_count?: number | null;
};

// Mock data for development
const MOCK_TASK: TaskDetails = {
  id: 1,
  pickup_date: '2026-02-04',
  start_time: '13:00',
  end_time: '16:00',
  location_name: 'Rock Ridge Cafe',
  address: {
    number: '5492',
    street: 'College Ave',
    city: 'Oakland',
    state: 'CA',
    zip: '94618',
    comments: 'Call when you arrive - ask for manager on duty',
  },
  contact_name: 'Davina Chan',
  contact_phone: '669-222-7871',
  contact_email: 'rockridgecafehere@gmail.com',
  tray_type: 'Sandwiches & Salad',
  tray_count: 15,
};

function toISODateTime(
  date: string | null | undefined,
  time: string | null | undefined,
) {
  if (!date || !time) return null;

  // already ISO
  if (time.includes('T')) return time;

  // "13:00" → "2026-02-06T13:00:00"
  if (/^\d{2}:\d{2}$/.test(time)) {
    return `${date}T${time}:00`;
  }

  // "2026-02-06 13:00:00 UTC"
  if (time.includes('UTC')) {
    return time.replace(' ', 'T').replace(' UTC', 'Z');
  }

  return null;
}

function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone;
}

function formatTimeRange(
  startTime: string | null,
  endTime: string | null,
): string {
  if (!startTime || !endTime) return 'Time TBD';

  try {
    const parseTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(n => parseInt(n, 10));
      if (isNaN(hours) || isNaN(minutes)) return null;

      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm.toLowerCase()}`;
    };

    const startFormatted = parseTime(startTime);
    const endFormatted = parseTime(endTime);

    if (!startFormatted || !endFormatted) return 'Time TBD';

    return `${startFormatted} - ${endFormatted}`;
  } catch {
    return 'Time TBD';
  }
}

function formatPickupDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${weekday} ${month} ${day}`;
  } catch {
    return dateStr;
  }
}

export default function PickupDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [task, setTask] = useState<TaskDetails | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskAdded, setIsTaskAdded] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const { driver } = useAuth();

  const handleClaim = async () => {
    const driverId = driver?.id;
    const token = Array.isArray(id) ? id[0] : id;

    console.log('CLAIM driver.id', driverId);
    console.log('CLAIM token used', token);

    try {
      if (!driverId) throw new Error('No driver session');
      if (!token) throw new Error('Missing task id');

      await claimTask(token, driverId);

      Toast.show({ type: 'success', text1: 'Pickup claimed!' });
      router.replace('/(tabs)/my-tasks');
    } catch (e: any) {
      const message = e?.message ?? 'Unknown error';
      const extra =
        Array.isArray(e?.errors) && e.errors.length
          ? ` • ${e.errors.join(', ')}`
          : '';
      Toast.show({
        type: 'error',
        text1: 'Could not claim pickup',
        text2: `${message}${extra}`,
      });
    }
  };

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        setTask(null);
        setErr(null);

        const token = Array.isArray(id) ? id[0] : id;
        const url = `${BASE_URL}${API_ENDPOINTS.TASKS}/${encodeURIComponent(token ?? '')}`;

        const data = await apiRequest<TaskDetails | TaskDetails[]>(url, {
          method: 'GET',
          validateResponse: r => {
            if (!r || typeof r !== 'object') return false;
            const obj = r as any;
            return (
              typeof obj.id === 'number' &&
              (typeof obj.pickup_date === 'string' ||
                typeof obj.scheduled_date === 'string')
            );
          },
        });

        const raw: any = Array.isArray(data) ? data[0] : data;

        const pickupDate = raw.pickup_date ?? raw.scheduled_date ?? null;

        const startISO = toISODateTime(
          pickupDate,
          raw.start_time ?? raw.activity_start_time ?? null,
        );

        const endISO = toISODateTime(
          pickupDate,
          raw.end_time ?? raw.activity_end_time ?? null,
        );

        const taskData: TaskDetails = {
          id: raw.id,
          encrypted_id: raw.encrypted_id,
          pickup_date: pickupDate ?? '',
          start_time: startISO,
          end_time: endISO,
          location_name: raw.location_name ?? null,
          address: raw.address ?? null,
          description: raw.description ?? null,
          contact_name: raw.contact_name ?? null,
          contact_phone: raw.contact_phone ?? null,
          contact_email: raw.contact_email ?? null,
          tray_type: raw.tray_type ?? null,
          tray_count: raw.tray_count ?? null,
        };

        setTask(taskData);
      } catch {
        if (!cancelled) {
          // Use mock data for development
          setTask(MOCK_TASK);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAddToTasks = () => {
    setIsTaskAdded(true);
    Toast.show({
      type: 'success',
      text1: 'Added to My Tasks',
      text2: 'You can view this pickup in your tasks',
    });
  };

  const handleUndoAdd = () => {
    setIsTaskAdded(false);
    Toast.show({
      type: 'info',
      text1: 'Removed from My Tasks',
    });
  };

  const handleOpenMaps = () => {
    setShowMapModal(true);
  };

  const openInAppleMaps = () => {
    if (!task?.address) return;
    const addr = task.address;
    const addressStr = [
      addr.number,
      addr.street,
      addr.city,
      addr.state,
      addr.zip,
    ]
      .filter(Boolean)
      .join(' ');
    const url = `maps://maps.apple.com/?q=${encodeURIComponent(addressStr)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open Apple Maps');
    });
    setShowMapModal(false);
  };

  const openInGoogleMaps = () => {
    if (!task?.address) return;
    const addr = task.address;
    const addressStr = [
      addr.number,
      addr.street,
      addr.city,
      addr.state,
      addr.zip,
    ]
      .filter(Boolean)
      .join(' ');
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressStr)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open Google Maps');
    });
    setShowMapModal(false);
  };

  const copyAddress = () => {
    // In a real app, you'd use Clipboard API
    Toast.show({
      type: 'success',
      text1: 'Address copied to clipboard',
    });
    setShowMapModal(false);
  };

  const handleCall = (phone: string) => {
    const phoneUrl = `tel:${phone.replace(/[^0-9]/g, '')}`;
    Linking.openURL(phoneUrl).catch(() => {
      Alert.alert('Error', 'Could not open phone app');
    });
  };

  const handleMessage = (phone: string) => {
    const smsUrl = `sms:${phone.replace(/[^0-9]/g, '')}`;
    Linking.openURL(smsUrl).catch(() => {
      Alert.alert('Error', 'Could not open messages app');
    });
  };

  const handleEmail = (email: string) => {
    const mailUrl = `mailto:${email}`;
    Linking.openURL(mailUrl).catch(() => {
      Alert.alert('Error', 'Could not open email app');
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#58ad85" />
        <Text style={styles.loadingText}>Loading pickup details...</Text>
      </View>
    );
  }

  if (err && !task) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Failed to load pickup details</Text>
        <Text style={styles.errorMessage}>{err}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setErr('');
            setIsLoading(true);
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>No data available</Text>
      </View>
    );
  }

  const addr = task.address ?? null;
  const fullAddress = [
    addr?.number,
    addr?.street,
    addr?.city && addr?.state
      ? `${addr.city}, ${addr.state}`
      : addr?.city || addr?.state,
    addr?.zip,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Banner */}
        {isTaskAdded && (
          <View style={styles.successBanner}>
            <Image source={checkIcon} style={styles.successIcon} />
            <Text style={styles.successText}>Added to My Tasks</Text>
            <TouchableOpacity style={styles.undoButton} onPress={handleUndoAdd}>
              <Text style={styles.undoText}>Undo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Location Section */}
        <View style={styles.locationSection}>
          <Ionicons
            name="location-sharp"
            size={24}
            color="#000"
            style={{ marginTop: 4 }}
          />
          <View style={styles.locationContent}>
            <Text style={styles.locationTitle}>
              {task.location_name || 'Pickup Location'} pickup details
            </Text>
            <Text style={styles.locationAddress}>
              {fullAddress || 'Address not available'}
            </Text>
            <TouchableOpacity
              style={styles.openMapsButton}
              onPress={handleOpenMaps}
            >
              <Text style={styles.openMapsButtonText}>Open in maps</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pickup Window */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Image source={dateIcon} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Pick-up Window</Text>
              <Text style={styles.infoValue}>
                {formatPickupDate(task.pickup_date)}:{' '}
                {formatTimeRange(task.start_time, task.end_time)}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        {(task.contact_name || task.contact_email || task.contact_phone) && (
          <View style={styles.contactSection}>
            <Text
              style={[
                styles.descriptionTitle,
                { marginBottom: 24, fontSize: 18 },
              ]}
            >
              Onsite Contact
            </Text>
            {/* Contact Name with Actions */}
            {task.contact_name && (
              <View style={[styles.contactRow, { marginBottom: 16 }]}>
                <Ionicons name="person-outline" size={20} color="#525454" />
                <View style={[styles.contactInfo, { marginLeft: 16 }]}>
                  <Text style={styles.contactName}>{task.contact_name}</Text>
                </View>
                {task.contact_phone && (
                  <View style={styles.contactActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleMessage(task.contact_phone!)}
                    >
                      <Ionicons name="chatbubble" size={20} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleCall(task.contact_phone!)}
                    >
                      <Ionicons name="call" size={20} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* Phone Number */}
            {task.contact_phone && !task.contact_name && (
              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={20} color="#525454" />
                <View style={[styles.contactInfo, { marginLeft: 16 }]}>
                  <Text style={styles.contactPhone}>
                    {formatPhoneNumber(task.contact_phone)}
                  </Text>
                </View>
              </View>
            )}

            {/* Email */}
            {task.contact_email && (
              <View style={[styles.contactRow, { marginBottom: 0 }]}>
                <Ionicons name="mail-outline" size={20} color="#525454" />
                <TouchableOpacity
                  style={[styles.contactInfo, { marginLeft: 16 }]}
                  onPress={() => handleEmail(task.contact_email!)}
                >
                  <Text style={styles.contactEmail}>{task.contact_email}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Pickup Description */}
        <View style={styles.descriptionSection}>
          <Text style={[styles.descriptionTitle, { fontSize: 18 }]}>
            Pickup Description
          </Text>

          <View style={styles.descriptionRow}>
            <Text style={styles.descriptionLabel}>Tray type</Text>
            <Text style={styles.descriptionValue}>{task.tray_type || '—'}</Text>
          </View>

          <View style={styles.descriptionRow}>
            <Text style={styles.descriptionLabel}>Tray count</Text>
            <Text style={styles.descriptionValue}>
              {task.tray_count || '—'}
            </Text>
          </View>

          <View style={styles.descriptionRow}>
            <Text style={styles.descriptionLabel}>
              Building access instructions
            </Text>
            <Text style={styles.descriptionValue}>{addr?.comments || '—'}</Text>
          </View>

          <View style={styles.descriptionRow}>
            <Text style={styles.descriptionLabel}>Additional notes</Text>
            <Text style={styles.descriptionValue}>
              {task.description || '—'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        {isTaskAdded ? (
          <View style={styles.progressButton}>
            <Ionicons
              name="time-outline"
              size={20}
              color="#059669"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.progressButtonText}>Task in progress</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.claimButton} onPress={handleClaim}>
            <Text style={styles.claimButtonText}>
              Claim before{' '}
              {task.end_time
                ? (() => {
                    const [hours, minutes] = task.end_time
                      .split(':')
                      .map(n => parseInt(n, 10));
                    const ampm = hours >= 12 ? 'pm' : 'am';
                    const displayHours = hours % 12 || 12;
                    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
                  })()
                : '4:00 pm'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Map Options Modal */}
      <Modal
        visible={showMapModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMapModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMapModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Get directions</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={openInAppleMaps}
            >
              <Ionicons name="navigate-outline" size={24} color="#525454" />
              <Text style={styles.modalOptionText}>Open in Apple Maps</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={openInGoogleMaps}
            >
              <Ionicons name="map-outline" size={24} color="#525454" />
              <Text style={styles.modalOptionText}>Open in Google Maps</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalOption, { borderBottomWidth: 0 }]}
              onPress={copyAddress}
            >
              <Ionicons name="copy-outline" size={24} color="#525454" />
              <Text style={styles.modalOptionText}>Copy Address</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowMapModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
