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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@react-native-vector-icons/ionicons';
import dateIcon from 'assets/date.png';
import { z } from 'zod';
import DirectionsSheet from '@/components/DirectionsSheet';
import TaskNotification from '@/components/TaskNotification';
import Colors from '@/styles/colors';
import { styles } from '@/styles/pages/pickup-details-styles';
import { useAuth } from '@/utils/AuthContext';
import {
  formatPickupDate,
  formatTimeLabel,
  formatTimeRangeAny,
} from '@/utils/dateHelpers';
import { formatFullTaskAddress } from '@/utils/taskHelpers';
import { apiRequest } from '~/api/apiUtils';
import { API_ENDPOINTS, BASE_URL, claimTask } from '~/api/config';

const TaskDetailsSchema = z.object({ id: z.number() }).passthrough();

interface TaskDetails {
  id: number;
  encrypted_id?: string;
  driver_id?: number | null;
  status?: string | null;
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

function formatPickupWindow(task: TaskDetails): string {
  const dateStr = formatPickupDate(task.pickup_date, 'EEEE, MMM d');
  const timeStr = formatTimeRangeAny(task.start_time, task.end_time, {
    compactLower: true,
  });
  return `${dateStr}: ${timeStr}`;
}

function formatClaimTime(endTime: string | null): string {
  return formatTimeLabel(endTime, { compactLower: true }) ?? '';
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
          schema: TaskDetailsSchema,
        });

        const raw = data as unknown as Record<string, unknown>;

        const taskData: TaskDetails = {
          id: raw.id as number,
          encrypted_id: raw.encrypted_id as string | undefined,
          driver_id: (raw.driver_id as number | null) ?? null,
          status: (raw.status as string | null) ?? null,
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
    return (
      formatFullTaskAddress(task?.address, {
        includeZip: true,
        separator: ' ',
      }) ?? ''
    );
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

  const displayAddress =
    formatFullTaskAddress(task.address, { separator: ' ' }) ??
    'Address not available';

  const isCompleted = task.status === 'complete';
  const isMissed = task.status === 'failed';
  const isInProgress =
    !isCompleted && !isMissed && (isTaskAdded || !!task.driver_id);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(300)} style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.black} />
        </Pressable>
        <Text style={styles.headerTitle}>Pick-Up</Text>
      </Animated.View>

      {/* Notification */}
      <TaskNotification
        visible={isTaskAdded}
        message="Added to Active Tasks"
        onUndo={handleUndoAdd}
      />

      {/* Location Header on gray background */}
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
        </View>
      </Animated.View>

      {/* Content */}
      <ScrollView
        style={styles.contentCard}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.openMapsRow}
          onPress={() => setShowDirections(true)}
        >
          <Ionicons name="map-outline" size={18} color={Colors.primaryGreen} />
          <Text style={styles.openMapsText}>Open in Maps</Text>
        </Pressable>

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
                        name="chatbubble-outline"
                        size={20}
                        color={Colors.primaryGreen}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleCall(task.contact_phone!)}
                    >
                      <Ionicons
                        name="call-outline"
                        size={20}
                        color={Colors.primaryGreen}
                      />
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
              <Ionicons name="mail-outline" size={20} color={Colors.black} />
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
      <View style={styles.bottomContainer}>
        {isCompleted ? (
          <View style={[styles.progressButton, styles.completedStatusButton]}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color={Colors.white}
            />
            <Text style={styles.progressButtonText}>Task completed</Text>
          </View>
        ) : isMissed ? (
          <View style={[styles.progressButton, styles.missedStatusButton]}>
            <Ionicons
              name="close-circle-outline"
              size={24}
              color={Colors.white}
            />
            <Text style={styles.progressButtonText}>Task missed</Text>
          </View>
        ) : isInProgress ? (
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
      </View>

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
