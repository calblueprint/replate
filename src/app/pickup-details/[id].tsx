import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dateIcon from 'assets/date.png';
import AnimatedEntry from '@/components/AnimatedEntry';
import AnimatedPressable from '@/components/AnimatedPressable';
import PickupDetailSkeleton from '@/components/PickupDetailSkeleton';
import colors from '@/styles/colors';
import { useAuth } from '@/utils/AuthContext';
import {
  fmt12,
  formatPickupDate,
  formatTimeRangeAny,
} from '@/utils/dateHelpers';
import { formatFullAddress } from '@/utils/formatAddress';
import { ApiError, apiRequest } from '~/api/apiUtils';
import { API_ENDPOINTS, BASE_URL, claimTask } from '~/api/config';

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
  if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  return phone;
}

function parseHMAny(ts: string): { h: number; m: number } | null {
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

  const m = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!m) return null;
  return { h: Number(m[1]), m: Number(m[2]) };
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
  return {
    number: parseOptionalString(value.number),
    street: parseOptionalString(value.street),
    apt_number: parseOptionalString(value.apt_number),
    city: parseOptionalString(value.city),
    state: parseOptionalString(value.state),
    zip: parseOptionalString(value.zip),
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
  const insets = useSafeAreaInsets();

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
          ? ` \u2022 ${requestError.errors.join(', ')}`
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
            parseOptionalNumber(data.tray_count) ??
            (typeof data.tray_count === 'string' &&
            !Number.isNaN(Number(data.tray_count))
              ? Number(data.tray_count)
              : null),
          location: isRecord(data.location)
            ? { comments: parseOptionalString(data.location.comments) }
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
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [taskId, reloadToken]);

  const handleSignIn = () => router.replace('/auth/login');

  const handleOpenMaps = () => setShowMapModal(true);

  const openInAppleMaps = () => {
    if (!task?.address) return;
    const addressStr = formatFullAddress(task.address);
    Linking.openURL(
      `maps://maps.apple.com/?q=${encodeURIComponent(addressStr)}`,
    ).catch(() => Alert.alert('Error', 'Could not open Apple Maps'));
    setShowMapModal(false);
  };

  const openInGoogleMaps = () => {
    if (!task?.address) return;
    const addressStr = formatFullAddress(task.address);
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressStr)}`,
    ).catch(() => Alert.alert('Error', 'Could not open Google Maps'));
    setShowMapModal(false);
  };

  const copyAddress = async () => {
    const addr = formatFullAddress(task?.address);
    if (addr) {
      await Clipboard.setStringAsync(addr);
      Toast.show({ type: 'success', text1: 'Address copied to clipboard' });
    } else {
      Toast.show({ type: 'error', text1: 'No address available to copy' });
    }
    setShowMapModal(false);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/[^0-9]/g, '')}`).catch(() =>
      Alert.alert('Error', 'Could not open phone app'),
    );
  };

  const handleMessage = (phone: string) => {
    Linking.openURL(`sms:${phone.replace(/[^0-9]/g, '')}`).catch(() =>
      Alert.alert('Error', 'Could not open messages app'),
    );
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() =>
      Alert.alert('Error', 'Could not open email app'),
    );
  };

  if (isLoading) {
    return <PickupDetailSkeleton />;
  }

  if (err && !task) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-error-dark text-base mb-2 font-subheading">
          Failed to load pickup details
        </Text>
        <Text className="text-neutral-500 mb-5 text-center font-body">
          {err}
        </Text>
        <AnimatedPressable
          className="bg-primary-400 px-6 py-3 rounded-xl min-h-[48px] items-center justify-center"
          onPress={() => setReloadToken(prev => prev + 1)}
          accessibilityRole="button"
          accessibilityLabel="Retry loading"
        >
          <Text className="text-white font-subheading">Retry</Text>
        </AnimatedPressable>
      </View>
    );
  }

  if (!task) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-neutral-500 mb-5 text-center font-body">
          No data available
        </Text>
      </View>
    );
  }

  const fullAddress = formatFullAddress(task.address);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <ScrollView
        contentContainerClassName="px-5 pt-6 pb-[140px]"
        showsVerticalScrollIndicator={false}
      >
        {/* Location Section */}
        <AnimatedEntry delay={0}>
          <View className="flex-row items-center mb-6 pb-6 border-b border-neutral-200">
            <Ionicons
              name="location-sharp"
              size={24}
              color={colors.neutral[600]}
              className="mt-1 mr-4"
            />
            <View className="flex-1">
              <Text className="text-xl font-heading text-neutral-800 mb-2">
                {task.location_name || 'Pickup Location'} pickup details
              </Text>
              <Text className="text-sm font-body text-neutral-600 mb-4">
                {fullAddress || 'Address not available'}
              </Text>
              <AnimatedPressable
                className="bg-primary-400 px-4 py-2.5 rounded-xl self-start min-h-[44px] items-center justify-center"
                onPress={handleOpenMaps}
                accessibilityRole="button"
                accessibilityLabel="Open address in maps"
              >
                <Text className="text-white font-subheading text-sm">
                  Open in maps
                </Text>
              </AnimatedPressable>
            </View>
          </View>
        </AnimatedEntry>

        {/* Pickup Window */}
        <AnimatedEntry delay={80}>
          <View className="mb-6 pb-6 border-b border-neutral-200">
            <View className="flex-row items-center">
              <Image
                source={dateIcon}
                className="w-5 h-5 mr-4"
                style={{ tintColor: colors.neutral[600] }}
              />
              <View className="flex-1">
                <Text className="text-sm font-label text-neutral-600 mb-1">
                  Pick-up Window
                </Text>
                <Text className="text-sm font-body text-neutral-800 flex-wrap">
                  {formatPickupDate(task.pickup_date)}:{' '}
                  {formatTimeRangeAny(task.start_time, task.end_time)}
                </Text>
              </View>
            </View>
          </View>
        </AnimatedEntry>

        {/* Contact Section */}
        {(task.contact_name || task.contact_email || task.contact_phone) && (
          <AnimatedEntry delay={160}>
            <View className="mb-0 pb-7 border-b border-neutral-200">
              <Text className="text-lg font-subheading text-neutral-800 mb-6">
                Onsite Contact
              </Text>
              {task.contact_name && (
                <View className="flex-row items-center mb-4">
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={colors.neutral[600]}
                    className="mr-4 mt-px"
                  />
                  <View className="flex-1 mr-3">
                    <Text className="text-base font-subheading text-neutral-800">
                      {task.contact_name}
                    </Text>
                  </View>
                  {task.contact_phone && (
                    <View className="flex-row gap-3">
                      <AnimatedPressable
                        className="w-11 h-11 bg-primary-400 rounded-full items-center justify-center"
                        onPress={() => handleMessage(task.contact_phone!)}
                        accessibilityRole="button"
                        accessibilityLabel="Send message to contact"
                      >
                        <Ionicons
                          name="chatbubble"
                          size={20}
                          color={colors.white}
                        />
                      </AnimatedPressable>
                      <AnimatedPressable
                        className="w-11 h-11 bg-primary-400 rounded-full items-center justify-center"
                        onPress={() => handleCall(task.contact_phone!)}
                        accessibilityRole="button"
                        accessibilityLabel="Call contact"
                      >
                        <Ionicons name="call" size={20} color={colors.white} />
                      </AnimatedPressable>
                    </View>
                  )}
                </View>
              )}

              {task.contact_phone && !task.contact_name && (
                <View className="flex-row items-center mb-4">
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color={colors.neutral[600]}
                    className="mr-4 mt-px"
                  />
                  <View className="flex-1 mr-3">
                    <Text className="text-sm font-body text-neutral-600">
                      {formatPhoneNumber(task.contact_phone)}
                    </Text>
                  </View>
                </View>
              )}

              {task.contact_email && (
                <View className="flex-row items-center">
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={colors.neutral[600]}
                    className="mr-4 mt-px"
                  />
                  <AnimatedPressable
                    className="flex-1 mr-3"
                    onPress={() => handleEmail(task.contact_email!)}
                    accessibilityRole="link"
                    accessibilityLabel={`Email ${task.contact_email}`}
                  >
                    <Text className="text-sm font-body text-primary-600 underline">
                      {task.contact_email}
                    </Text>
                  </AnimatedPressable>
                </View>
              )}
            </View>
          </AnimatedEntry>
        )}

        {/* Pickup Description */}
        <AnimatedEntry delay={240}>
          <View className="mt-6">
            <Text className="text-lg font-subheading text-neutral-800 mb-6">
              Pickup Description
            </Text>

            <View className="mb-3">
              <Text className="text-xs font-body text-neutral-500 mb-1">
                Tray type
              </Text>
              <Text className="text-sm font-body text-neutral-800">
                {task.tray_type || '\u2014'}
              </Text>
            </View>

            <View className="mb-3">
              <Text className="text-xs font-body text-neutral-500 mb-1">
                Tray count
              </Text>
              <Text className="text-sm font-body text-neutral-800">
                {task.tray_count ?? '\u2014'}
              </Text>
            </View>

            <View className="mb-3">
              <Text className="text-xs font-body text-neutral-500 mb-1">
                Building access instructions
              </Text>
              <Text className="text-sm font-body text-neutral-800">
                {task.building_access_instructions ?? '\u2014'}
              </Text>
            </View>

            <View className="mb-3">
              <Text className="text-xs font-body text-neutral-500 mb-1">
                Additional notes
              </Text>
              <Text className="text-sm font-body text-neutral-800">
                {task.description || '\u2014'}
              </Text>
            </View>
          </View>
        </AnimatedEntry>
      </ScrollView>

      {/* Bottom Button */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white px-5 pt-4 shadow-header"
        style={{ paddingBottom: Math.max(insets.bottom, 20) + 10 }}
      >
        {task.driver_id ? (
          <AnimatedPressable
            className="bg-primary-400 py-4 rounded-xl items-center min-h-[48px] justify-center"
            onPress={() =>
              router.push({
                pathname: '/donation-details/[id]',
                params: {
                  id: task.encrypted_id ?? taskId ?? '',
                  location: task.location_name ?? '',
                },
              })
            }
            accessibilityRole="button"
            accessibilityLabel="Enter donation details"
          >
            <Text className="text-base font-subheading text-white">
              Enter Donation
            </Text>
          </AnimatedPressable>
        ) : (
          <AnimatedPressable
            className={`py-4 rounded-xl items-center min-h-[48px] justify-center ${
              !driver?.id || isClaiming ? 'bg-neutral-300' : 'bg-primary-400'
            }`}
            onPress={driver?.id ? handleClaim : handleSignIn}
            disabled={isClaiming}
            accessibilityRole="button"
            accessibilityLabel={
              driver?.id
                ? isClaiming
                  ? 'Claiming pickup'
                  : 'Claim this pickup'
                : 'Sign in to claim this pickup'
            }
          >
            <View className="flex-row items-center gap-2">
              {isClaiming && (
                <ActivityIndicator size="small" color={colors.neutral[500]} />
              )}
              <Text
                className={`text-base font-subheading ${
                  !driver?.id || isClaiming ? 'text-neutral-500' : 'text-white'
                }`}
              >
                {(() => {
                  if (!driver?.id) return 'Sign in to claim this pickup';
                  if (isClaiming) return 'Claiming...';
                  const end = task.end_time ? parseHMAny(task.end_time) : null;
                  return end
                    ? `Claim by ${fmt12(end.h, end.m)}`
                    : 'Claim Pickup';
                })()}
              </Text>
            </View>
          </AnimatedPressable>
        )}
      </View>

      {/* Map Options Modal */}
      <Modal
        visible={showMapModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMapModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setShowMapModal(false)}
        >
          <View className="bg-white rounded-t-3xl pt-4 px-5 pb-[34px]">
            <View className="w-9 h-[5px] bg-neutral-300 rounded-full self-center mb-5" />
            <Text className="text-lg font-subheading text-neutral-800 mb-5">
              Get directions
            </Text>

            <AnimatedPressable
              className="flex-row items-center py-4 border-b border-neutral-200"
              onPress={openInAppleMaps}
              accessibilityRole="button"
              accessibilityLabel="Open in Apple Maps"
            >
              <Ionicons
                name="navigate-outline"
                size={24}
                color={colors.neutral[600]}
                style={{ marginRight: 16, marginTop: 1 }}
              />
              <Text className="text-base font-body text-neutral-800 flex-1">
                Open in Apple Maps
              </Text>
            </AnimatedPressable>

            <AnimatedPressable
              className="flex-row items-center py-4 border-b border-neutral-200"
              onPress={openInGoogleMaps}
              accessibilityRole="button"
              accessibilityLabel="Open in Google Maps"
            >
              <Ionicons
                name="map-outline"
                size={24}
                color={colors.neutral[600]}
                style={{ marginRight: 16, marginTop: 1 }}
              />
              <Text className="text-base font-body text-neutral-800 flex-1">
                Open in Google Maps
              </Text>
            </AnimatedPressable>

            <AnimatedPressable
              className="flex-row items-center py-4"
              onPress={copyAddress}
              accessibilityRole="button"
              accessibilityLabel="Copy address to clipboard"
            >
              <Ionicons
                name="copy-outline"
                size={24}
                color={colors.neutral[600]}
                style={{ marginRight: 16, marginTop: 1 }}
              />
              <Text className="text-base font-body text-neutral-800 flex-1">
                Copy Address
              </Text>
            </AnimatedPressable>

            <AnimatedPressable
              className="mt-5 py-4 rounded-xl border border-neutral-200 items-center min-h-[44px] justify-center"
              onPress={() => setShowMapModal(false)}
              accessibilityRole="button"
            >
              <Text className="text-base font-subheading text-neutral-600">
                Cancel
              </Text>
            </AnimatedPressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
