import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dateIcon from 'assets/date.png';
import DirectionsSheet from '@/components/DirectionsSheet';
import TaskNotification from '@/components/TaskNotification';
import Colors from '@/styles/colors';
import { useAuth } from '@/utils/AuthContext';
import { apiRequest } from '~/api/apiUtils';
import { API_ENDPOINTS, BASE_URL, claimTask } from '~/api/config';
import { styles } from '../../styles/pages/pickup-details-styles';

interface TaskDetails {
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
}

function parseHM(ts: string): { h: number; m: number } | null {
  const s = ts.trim();
  if (s.includes('UTC')) {
    const d = new Date(s.replace(' ', 'T').replace(' UTC', 'Z'));
    if (isNaN(d.getTime())) return null;
    return { h: d.getHours(), m: d.getMinutes() };
  }
  if (s.includes('T')) {
    const d = new Date(s);
    if (isNaN(d.getTime())) return null;
    return { h: d.getHours(), m: d.getMinutes() };
  }
  const match = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return null;
  return { h: Number(match[1]), m: Number(match[2]) };
}

function fmt12(h: number, m: number): string {
  const ap = h >= 12 ? 'pm' : 'am';
  const hr12 = h % 12 || 12;
  return `${hr12}:${String(m).padStart(2, '0')}${ap}`;
}

function formatPickupWindow(task: TaskDetails): string {
  const d = new Date(task.pickup_date + 'T00:00:00');
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const day = d.getDate();

  const start = task.start_time ? parseHM(task.start_time) : null;
  const end = task.end_time ? parseHM(task.end_time) : null;

  const timeStr =
    start && end
      ? `${fmt12(start.h, start.m)} - ${fmt12(end.h, end.m)}`
      : 'Time TBD';

  return `${weekday}, ${month} ${day}: ${timeStr}`;
}

function formatClaimTime(endTime: string | null): string {
  if (!endTime) return '';
  const hm = parseHM(endTime);
  if (!hm) return '';
  return fmt12(hm.h, hm.m);
}

export default function PickupDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [task, setTask] = useState<TaskDetails | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskAdded, setIsTaskAdded] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const { driver } = useAuth();

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        setTask(null);
        setErr(null);

        const token = Array.isArray(id) ? id[0] : id;
        const url = `${BASE_URL}${API_ENDPOINTS.TASKS}/${encodeURIComponent(token ?? '')}`;

        const data = await apiRequest<TaskDetails>(url, {
          method: 'GET',
          validateResponse: r => {
            if (!r || typeof r !== 'object' || Array.isArray(r)) return false;
            return typeof (r as Record<string, unknown>).id === 'number';
          },
        });

        const raw = data as unknown as Record<string, unknown>;

        const taskData: TaskDetails = {
          id: raw.id as number,
          encrypted_id: raw.encrypted_id as string | undefined,
          driver_id: (raw.driver_id as number | null) ?? null,
          pickup_date:
            (raw.pickup_date as string) ?? (raw.scheduled_date as string) ?? '',
          start_time:
            (raw.start_time as string | null) ??
            (raw.activity_start_time as string | null) ??
            null,
          end_time:
            (raw.end_time as string | null) ??
            (raw.activity_end_time as string | null) ??
            null,
          location_name: (raw.location_name as string | null) ?? null,
          address: (raw.address as TaskDetails['address']) ?? null,
          building_access_instructions:
            (raw.building_access_instructions as string | null) ?? null,
          description: (raw.description as string | null) ?? null,
          contact_name: (raw.contact_name as string | null) ?? null,
          contact_phone: (raw.contact_phone as string | null) ?? null,
          contact_email: (raw.contact_email as string | null) ?? null,
          tray_type: (raw.tray_type as string | null) ?? null,
          tray_count: (raw.tray_count as number | null) ?? null,
          location: (raw.location as TaskDetails['location']) ?? undefined,
        };

        if (!cancelled) setTask(taskData);
      } catch {
        if (!cancelled) setErr('Failed to load pickup details');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleClaim = useCallback(async () => {
    const driverId = driver?.id;
    const token = Array.isArray(id) ? id[0] : id;

    try {
      if (!driverId) throw new Error('No driver session');
      if (!token) throw new Error('Missing task id');

      await claimTask(token, driverId);
      await AsyncStorage.removeItem('tasks');

      setIsTaskAdded(true);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      Toast.show({
        type: 'error',
        text1: 'Could not claim pickup',
        text2: message,
      });
    }
  }, [driver?.id, id]);

  const handleUndoAdd = useCallback(() => {
    setIsTaskAdded(false);
    Toast.show({ type: 'info', text1: 'Removed from My Tasks' });
  }, []);

  const getAddressString = useCallback(() => {
    if (!task?.address) return '';
    const addr = task.address;
    return [addr.number, addr.street, addr.city, addr.state, addr.zip]
      .filter(Boolean)
      .join(' ');
  }, [task]);

  const openInAppleMaps = useCallback(() => {
    const addressStr = getAddressString();
    if (!addressStr) return;
    Linking.openURL(
      `maps://maps.apple.com/?q=${encodeURIComponent(addressStr)}`,
    ).catch(() => Alert.alert('Error', 'Could not open Apple Maps'));
    setShowDirections(false);
  }, [getAddressString]);

  const openInGoogleMaps = useCallback(() => {
    const addressStr = getAddressString();
    if (!addressStr) return;
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressStr)}`,
    ).catch(() => Alert.alert('Error', 'Could not open Google Maps'));
    setShowDirections(false);
  }, [getAddressString]);

  const handleCall = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone.replace(/[^0-9]/g, '')}`).catch(() =>
      Alert.alert('Error', 'Could not open phone app'),
    );
  }, []);

  const handleMessage = useCallback((phone: string) => {
    Linking.openURL(`sms:${phone.replace(/[^0-9]/g, '')}`).catch(() =>
      Alert.alert('Error', 'Could not open messages app'),
    );
  }, []);

  const handleEmail = useCallback((email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() =>
      Alert.alert('Error', 'Could not open email app'),
    );
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primaryGreen} />
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

  const addr = task.address;
  const displayAddress = addr
    ? [
        addr.number,
        addr.street,
        addr.city && `${addr.city}, ${addr.state ?? ''}`,
      ]
        .filter(Boolean)
        .join(' ')
    : 'Address not available';

  const isInProgress = isTaskAdded || !!task.driver_id;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(300)} style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.black} />
        </Pressable>
        <Text style={styles.headerTitle}>Pick-Up</Text>
      </Animated.View>

      {/* Notification */}
      <TaskNotification
        visible={isTaskAdded}
        message="Added to Active Tasks"
        onUndo={handleUndoAdd}
      />

      {/* Content */}
      <ScrollView
        style={styles.contentCard}
        showsVerticalScrollIndicator={false}
      >
        {/* Location */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(350).springify()}
          style={styles.locationSection}
        >
          <Ionicons name="location-sharp" size={24} color={Colors.black} />
          <View style={styles.locationContent}>
            <Text style={styles.locationTitle}>
              {task.location_name ?? 'Pickup Location'} Details
            </Text>
            <Text style={styles.locationAddress}>{displayAddress}</Text>
            <Pressable
              style={styles.openMapsRow}
              onPress={() => setShowDirections(true)}
            >
              <Ionicons name="map-outline" size={20} color={Colors.black} />
              <Text style={styles.openMapsText}>Open in Maps</Text>
            </Pressable>
          </View>
        </Animated.View>

        <View style={styles.separator} />

        {/* Schedule */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(350).springify()}
          style={styles.scheduleSection}
        >
          <Image
            source={dateIcon}
            style={styles.scheduleIcon}
            resizeMode="contain"
          />
          <View style={styles.scheduleContent}>
            <Text style={styles.scheduleLabel}>Pick-Up Window</Text>
            <Text style={styles.scheduleValue}>{formatPickupWindow(task)}</Text>
          </View>
        </Animated.View>

        {/* Contact */}
        {(task.contact_name || task.contact_phone) && (
          <Animated.View
            entering={FadeInDown.delay(300).duration(350).springify()}
            style={styles.contactSection}
          >
            <Ionicons name="person-outline" size={22} color={Colors.black} />
            <View style={styles.contactContent}>
              {task.contact_name && (
                <Text style={styles.contactName}>{task.contact_name}</Text>
              )}
              {task.contact_phone && (
                <>
                  <Text style={styles.contactPhone}>{task.contact_phone}</Text>
                  <View style={styles.contactActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleMessage(task.contact_phone!)}
                    >
                      <Ionicons
                        name="chatbubble"
                        size={18}
                        color={Colors.white}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleCall(task.contact_phone!)}
                    >
                      <Ionicons name="call" size={18} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </Animated.View>
        )}

        {/* Email */}
        {task.contact_email && (
          <Animated.View
            entering={FadeInDown.delay(400).duration(350).springify()}
          >
            <Pressable
              style={styles.emailSection}
              onPress={() => handleEmail(task.contact_email!)}
            >
              <Ionicons name="mail-outline" size={20} color="#4D1B1B" />
              <Text style={styles.emailText}>{task.contact_email}</Text>
            </Pressable>
          </Animated.View>
        )}

        <View style={styles.separator} />

        {/* Description */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(350).springify()}
          style={styles.descriptionSection}
        >
          <Text style={styles.descriptionTitle}>Description</Text>

          <View style={styles.descriptionRow}>
            <Text style={styles.descriptionLabel}>Tray type</Text>
            <Text style={styles.descriptionValue}>{task.tray_type || '—'}</Text>
          </View>

          <View style={styles.descriptionRow}>
            <Text style={styles.descriptionLabel}>Tray count</Text>
            <Text style={styles.descriptionValue}>
              {task.tray_count ?? '—'}
            </Text>
          </View>

          <View style={styles.descriptionRow}>
            <Text style={styles.descriptionLabel}>
              Building access instructions
            </Text>
            <Text style={styles.descriptionValue}>
              {task.building_access_instructions ??
                task.location?.comments ??
                '—'}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom button */}
      <Animated.View
        entering={FadeInDown.delay(600).duration(400)}
        style={styles.bottomContainer}
      >
        {isInProgress ? (
          <View style={styles.progressButton}>
            <Ionicons name="time-outline" size={24} color={Colors.white} />
            <Text style={styles.progressButtonText}>Task in progress</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.claimButton} onPress={handleClaim}>
            <Text style={styles.claimButtonText}>
              Claim before {formatClaimTime(task.end_time)}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Directions sheet */}
      <DirectionsSheet
        visible={showDirections}
        onClose={() => setShowDirections(false)}
        onAppleMaps={openInAppleMaps}
        onGoogleMaps={openInGoogleMaps}
      />
    </View>
  );
}
