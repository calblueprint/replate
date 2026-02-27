import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import clockIcon from 'assets/date.png';
import replateLogo from 'assets/replate-logo.png';
import AnimatedSegmentedControl from '@/components/AnimatedSegmentedControl';
import { useAuth } from '@/utils/AuthContext';
import { ApiError, apiRequest, validateArrayResponse } from '~/api/apiUtils';
import { API_ENDPOINTS, BASE_URL } from '~/api/config';
import { safeJsonParse } from '~/src/utils/sanitization';
import { styles } from '../../styles/tabs/available-pick-ups-styles';

function localISODate(d: Date) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

// datetime helpers

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  try {
    return JSON.stringify(e);
  } catch {
    return 'Unknown error';
  }
}

// This is a bunch of helpers to fix formatting from backend, will clean up
function parseBackendTime(
  dateISO: string | undefined,
  ts?: string | null,
): Date | null {
  if (!ts) return null;

  // Case A: backend gave full "YYYY-MM-DD HH:MM:SS UTC"
  if (ts.includes('UTC')) {
    const iso = ts.replace(' ', 'T').replace(' UTC', 'Z');
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }

  // Case B: backend gave ISO already
  if (ts.includes('T')) {
    const d = new Date(ts);
    return isNaN(d.getTime()) ? null : d;
  }

  // Case C: backend gave "HH:MM" → combine with pickup_date
  if (/^\d{2}:\d{2}$/.test(ts) && dateISO) {
    const d = new Date(`${dateISO}T${ts}:00`);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

function fmtHour(d: Date): string {
  const h = d.getHours(); // local hours
  const hr12 = h % 12 || 12; // 0→12
  const mins = d.getMinutes();
  const minsStr = mins < 10 ? `0${mins}` : String(mins);
  return `${hr12}:${minsStr}`;
}

function ampm(d: Date): 'AM' | 'PM' {
  return d.getHours() < 12 ? 'AM' : 'PM';
}

function fmtShortHourRange(
  dateISO: string,
  startStr?: string | null,
  endStr?: string | null,
  opts?: { showAmPm?: boolean },
) {
  const s = parseBackendTime(dateISO, startStr);
  const e = parseBackendTime(dateISO, endStr);
  if (!s || !e) return 'Time TBD';

  const base = `${fmtHour(s)} – ${fmtHour(e)}`;
  if (opts?.showAmPm) {
    return ampm(s) === ampm(e)
      ? `${base} ${ampm(s)}`
      : `${fmtHour(s)} ${ampm(s)} – ${fmtHour(e)} ${ampm(e)}`;
  }
  return base;
}

function fmtDateHeader(isoYYYYMMDD: string) {
  const d = new Date(isoYYYYMMDD + 'T00:00:00');
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  return `${weekday}, ${month} ${day}`;
}

type ApiTask = {
  id: number;
  encrypted_id: string;
  pickup_date: string;
  start_time: string | null;
  end_time: string | null;
  location_name: string | null;
};

type UiPickup = {
  id: number;
  encrypted_id: string;
  pickup_date: string;
  slot_start_time: string | null;
  slot_end_time: string | null;
  pickup_location: string;
};

export default function AvailablePickupsPage() {
  const todayISO = localISODate(new Date());

  const tomorrowISO = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return localISODate(d);
  }, []);

  const [tab, setTab] = React.useState<'left' | 'right'>('left');
  const [selectedISO, setSelectedISO] = React.useState(todayISO);

  const [remote, setRemote] = React.useState<UiPickup[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const { driver } = useAuth();
  const driverId = driver?.id;

  const fetchTasks = React.useCallback(
    async (isRefresh = false) => {
      try {
        if (!isRefresh) setIsLoading(true);
        setError(null);

        const data = await apiRequest<ApiTask[]>(
          `${BASE_URL}${API_ENDPOINTS.TASKS}?driver_id=${driverId}`,
          { method: 'GET', validateResponse: validateArrayResponse },
        );

        const mapped: UiPickup[] = data.map(t => ({
          id: t.id,
          encrypted_id: t.encrypted_id,
          pickup_date: t.pickup_date,
          slot_start_time: t.start_time,
          slot_end_time: t.end_time,
          pickup_location: t.location_name ?? 'Unknown location',
        }));

        await AsyncStorage.setItem('tasks', JSON.stringify(mapped));
        setRemote(mapped);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : getErrorMessage(e));

        // only show cache on error
        const saved = await AsyncStorage.getItem('tasks');
        if (saved) setRemote(safeJsonParse<UiPickup[]>(saved, []));
      } finally {
        setIsLoading(false);
        if (isRefresh) setIsRefreshing(false);
      }
    },
    [driverId],
  );

  React.useEffect(() => {
    if (!driverId) {
      setIsLoading(false);
      setError('Sign in required to view available tasks.');
      return;
    }

    fetchTasks();
  }, [driverId, fetchTasks]);

  const handleRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    fetchTasks(true);
  }, [fetchTasks]);

  // Use API data if available, otherwise use mock data
  const source = remote ?? [];
  const filtered = React.useMemo(() => {
    const base = source.filter(p => p.pickup_date === selectedISO);

    // Only show mock card on TODAY
    if (__DEV__ && selectedISO === todayISO) {
      return [...base];
    }
    return base;
  }, [source, selectedISO, todayISO]);

  // Show loading indicator on initial load
  if (isLoading && !remote) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#58ad85" />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  if (!driverId) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 16, textAlign: 'center' }}>
            Sign in required to view available tasks.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#58ad85',
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
            onPress={() => router.replace('/auth/login')}
          >
            <Text style={{ color: '#fff', fontFamily: 'LatoBold' }}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <FlatList
        data={filtered}
        keyExtractor={item => item.encrypted_id}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#58ad85']}
            tintColor="#58ad85"
          />
        }
        ListHeaderComponent={
          <View>
            {error ? (
              <View style={styles.error}>
                <Text style={{ color: '#991b1b' }}>
                  Failed to load tasks: {error}
                </Text>
                <Text style={{ color: '#6b7280', marginTop: 4, fontSize: 12 }}>
                  Pull down to retry
                </Text>
              </View>
            ) : null}
            <View style={styles.header}>
              <View style={styles.brandRow}>
                <Text style={styles.replateTitle}>Replate</Text>
                <Image style={styles.logo} source={replateLogo} />
              </View>
              <Text style={styles.availableTasksTitle}>
                Available Tasks ({filtered.length})
              </Text>
              <AnimatedSegmentedControl
                leftLabel="Today"
                rightLabel="Tomorrow"
                value={tab}
                onChange={value => {
                  setTab(value);
                  setSelectedISO(value === 'left' ? todayISO : tomorrowISO);
                }}
              />
            </View>
            <Text style={styles.dateHeaderText}>
              {fmtDateHeader(selectedISO)}
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        renderItem={({ item }) => (
          <View style={styles.pickupCard}>
            <View style={styles.pickupCardTop}>
              <Image source={clockIcon} style={styles.clockIcon} />
              <Text style={styles.timeText}>
                {fmtShortHourRange(
                  item.pickup_date,
                  item.slot_start_time,
                  item.slot_end_time,
                  {
                    showAmPm: true,
                  },
                )}
              </Text>
            </View>

            <View style={styles.pickupCardBottom}>
              <View style={styles.pickupLeft}>
                <Text style={styles.locationText}>{item.pickup_location}</Text>
                {/* temp address */}
                {/* <Text style={styles.addressText}>Temp Address</Text> */}
              </View>

              <Pressable
                onPress={() => {
                  router.push({
                    pathname: '/pickup-details/[id]',
                    params: { id: item.encrypted_id },
                  });
                }}
                style={styles.detailsButton}
              >
                <Text style={styles.detailsButtonText}>Pick-up details</Text>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.claimPickupText}>No pickups for this date.</Text>
        }
      />
    </SafeAreaView>
  );
}
