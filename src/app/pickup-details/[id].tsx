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
import AsyncStorage from '@react-native-async-storage/async-storage';
import dateIcon from 'assets/date.png';
import { useAuth } from '@/utils/AuthContext';
import { ApiError, apiRequest } from '~/api/apiUtils';
import { API_ENDPOINTS, BASE_URL, claimTask } from '~/api/config';
import { styles } from '../../styles/pages/pickup-details-styles';

type TaskDetails = {
  id: number;
  encrypted_id?: string;
  driver_id?: number | null;
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
  } | null;
  building_access_instructions?: string | null;
  location?: { comments: string | null };
  contact_name?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  description?: string | null;
  tray_type?: string | null;
  tray_count?: number | null;
};

function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone;
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

function parseHMAny(ts: string): { h: number; m: number } | null {
  const s = ts.trim();

  // "YYYY-MM-DD HH:MM:SS UTC"
  if (s.includes('UTC')) {
    const d = new Date(s.replace(' ', 'T').replace(' UTC', 'Z'));
    if (isNaN(d.getTime())) return null;
    return { h: d.getHours(), m: d.getMinutes() };
  }

  // ISO "YYYY-MM-DDTHH:MM:SSZ"
  if (s.includes('T')) {
    const d = new Date(s);
    if (isNaN(d.getTime())) return null;
    return { h: d.getHours(), m: d.getMinutes() };
  }

  // "HH:MM" or "HH:MM:SS"
  const m = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!m) return null;
  return { h: Number(m[1]), m: Number(m[2]) };
}

function fmt12(h: number, m: number) {
  const ap = h >= 12 ? 'PM' : 'AM';
  const hr12 = h % 12 || 12;
  return `${hr12}:${String(m).padStart(2, '0')} ${ap}`;
}

function formatTimeRangeAny(startTime: string | null, endTime: string | null) {
  if (!startTime || !endTime) return 'Time TBD';
  const s = parseHMAny(startTime);
  const e = parseHMAny(endTime);
  if (!s || !e) return 'Time TBD';
  return `${fmt12(s.h, s.m)} - ${fmt12(e.h, e.m)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseOptionalString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function parseOptionalNumber(value: unknown): number | null {
  return typeof value === 'number' ? value : null;
}

function normalizeAddress(value: unknown): TaskDetails['address'] {
  if (!isRecord(value)) return null;

  const number = parseOptionalString(value.number);
  const street = parseOptionalString(value.street);
  const aptNumber = parseOptionalString(value.apt_number);
  const city = parseOptionalString(value.city);
  const state = parseOptionalString(value.state);
  const zip = parseOptionalString(value.zip);

  return {
    number,
    street,
    apt_number: aptNumber,
    city,
    state,
    zip,
  };
}

export default function PickupDetails() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const taskId = Array.isArray(id) ? id[0] : id;
  const [task, setTask] = useState<TaskDetails | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const { driver } = useAuth();

  const handleClaim = async () => {
    if (isClaiming) return;

    const driverId = driver?.id;

    try {
      setIsClaiming(true);
      if (!driverId) throw new Error('No driver session');
      if (!taskId) throw new Error('Missing task id');

      await claimTask(taskId, driverId);
      await AsyncStorage.removeItem('tasks');

      Toast.show({ type: 'success', text1: 'Pickup claimed!' });
      router.replace('/(tabs)/my-tasks');
    } catch (requestError: unknown) {
      const message =
        requestError instanceof Error ? requestError.message : 'Unknown error';
      const extra =
        requestError instanceof ApiError &&
        Array.isArray(requestError.errors) &&
        requestError.errors.length
          ? ` • ${requestError.errors.join(', ')}`
          : '';
      Toast.show({
        type: 'error',
        text1: 'Could not claim pickup',
        text2: `${message}${extra}`,
      });
    } finally {
      setIsClaiming(false);
    }
  };

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (cancelled) return;
        setIsLoading(true);
        setTask(null);
        setErr(null);

        if (!taskId) {
          setErr('Missing task id.');
          setTask(null);
          setIsLoading(false);
          return;
        }

        const url = `${BASE_URL}${API_ENDPOINTS.TASKS}/${encodeURIComponent(taskId)}`;

        const data = await apiRequest<Record<string, unknown>>(url, {
          method: 'GET',
          validateResponse: r => {
            if (!r || typeof r !== 'object' || Array.isArray(r)) return false;
            return typeof (r as Record<string, unknown>).id === 'number';
          },
        });
        const pickupDate =
          parseOptionalString(data.pickup_date) ??
          parseOptionalString(data.scheduled_date) ??
          null;

        const startHM =
          parseOptionalString(data.start_time) ??
          parseOptionalString(data.activity_start_time) ??
          null;
        const endHM =
          parseOptionalString(data.end_time) ??
          parseOptionalString(data.activity_end_time) ??
          null;

        const taskData: TaskDetails = {
          id: data.id as number,
          encrypted_id: parseOptionalString(data.encrypted_id) ?? undefined,
          driver_id:
            parseOptionalNumber(data.driver_id) ??
            (typeof data.driver_id === 'string'
              ? Number(data.driver_id) || null
              : null),
          pickup_date: pickupDate ?? '',
          start_time: startHM,
          end_time: endHM,
          location_name: parseOptionalString(data.location_name) ?? null,
          address: normalizeAddress(data.address),
          building_access_instructions:
            parseOptionalString(data.building_access_instructions) ?? null,
          description: parseOptionalString(data.description) ?? null,
          contact_name: parseOptionalString(data.contact_name) ?? null,
          contact_phone: parseOptionalString(data.contact_phone) ?? null,
          contact_email: parseOptionalString(data.contact_email) ?? null,
          tray_type: parseOptionalString(data.tray_type) ?? null,
          tray_count:
            parseOptionalNumber(data.tray_count) ||
            (typeof data.tray_count === 'string' &&
            !Number.isNaN(Number(data.tray_count))
              ? Number(data.tray_count)
              : null),
          location: isRecord(data.location)
            ? {
                comments: parseOptionalString(data.location.comments),
              }
            : undefined,
        };

        setTask(taskData);
      } catch (requestError: unknown) {
        if (!cancelled) {
          const message =
            requestError instanceof Error
              ? requestError.message
              : 'Failed to load pickup details';
          setErr(message);
          setTask(null);
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
  }, [taskId, reloadToken]);

  const handleSignIn = () => {
    router.replace('/auth/login');
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
            setReloadToken(prev => prev + 1);
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
        {/* Location Section */}
        <View style={styles.locationSection}>
          <Ionicons
            name="location-sharp"
            size={24}
            color="#000"
            style={styles.sectionIcon}
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
                {formatTimeRangeAny(task.start_time, task.end_time)}
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
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#525454"
                  style={styles.rowIcon}
                />
                <View style={styles.contactInfo}>
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
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#525454"
                  style={styles.rowIcon}
                />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactPhone}>
                    {formatPhoneNumber(task.contact_phone)}
                  </Text>
                </View>
              </View>
            )}

            {/* Email */}
            {task.contact_email && (
              <View style={[styles.contactRow, { marginBottom: 0 }]}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#525454"
                  style={styles.rowIcon}
                />
                <TouchableOpacity
                  style={styles.contactInfo}
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
            <Text style={styles.descriptionValue}>
              {task.building_access_instructions ?? '—'}
            </Text>
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
        {task.driver_id ? (
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
          <TouchableOpacity
            style={[
              styles.claimButton,
              (!driver?.id || isClaiming) && styles.claimButtonDisabled,
            ]}
            onPress={driver?.id ? handleClaim : handleSignIn}
            disabled={isClaiming}
          >
            <Text
              style={[
                styles.claimButtonText,
                (!driver?.id || isClaiming) && styles.claimButtonTextDisabled,
              ]}
            >
              {driver?.id
                ? isClaiming
                  ? 'Claiming...'
                  : `Claim by ${
                      task.end_time
                        ? (() => {
                            const hm = parseHMAny(task.end_time);
                            return hm ? fmt12(hm.h, hm.m) : '';
                          })()
                        : ''
                    }`
                : 'Sign in to claim this pickup'}
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
              <Ionicons
                name="navigate-outline"
                size={24}
                color="#525454"
                style={styles.modalOptionIcon}
              />
              <Text style={styles.modalOptionText}>Open in Apple Maps</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={openInGoogleMaps}
            >
              <Ionicons
                name="map-outline"
                size={24}
                color="#525454"
                style={styles.modalOptionIcon}
              />
              <Text style={styles.modalOptionText}>Open in Google Maps</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalOption, { borderBottomWidth: 0 }]}
              onPress={copyAddress}
            >
              <Ionicons
                name="copy-outline"
                size={24}
                color="#525454"
                style={styles.modalOptionIcon}
              />
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
