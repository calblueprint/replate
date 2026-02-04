import React from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import clockIcon from 'assets/date.png';
import replateLogo from 'assets/replate-logo.png';
import { BASE_URL } from '~/api/config';
import { styles } from './_styles/styles';

type AppExtra = { EXPO_PUBLIC_BACKEND_URL?: string };

const rawExtra: unknown = Constants.expoConfig?.extra;
const extra: AppExtra =
  rawExtra && typeof rawExtra === 'object' ? (rawExtra as AppExtra) : {};

export const BACKEND_URL =
  typeof extra.EXPO_PUBLIC_BACKEND_URL === 'string'
    ? extra.EXPO_PUBLIC_BACKEND_URL
    : '192.168.102.21';

export const MOCK_PICKUPS = [
  {
    id: 1,
    encrypted_id: 'mock-encrypted-id-1',
    slot_start_time: '2025-10-14T09:00:00',
    slot_end_time: '2025-10-14T10:00:00',
    pickup_location: 'BP House',
  },
  {
    id: 2,
    encrypted_id: 'mock-encrypted-id-2',
    slot_start_time: '2025-10-13T13:00:00',
    slot_end_time: '2025-10-13T15:00:00',
    pickup_location: 'Rockridge Cafe',
  },
  {
    id: 3,
    encrypted_id: 'mock-encrypted-id-3',
    slot_start_time: '2025-10-13T15:00:00',
    slot_end_time: '2025-10-13T18:00:00',
    pickup_location: 'Bongo’s Burgers',
  },
  {
    id: 4,
    encrypted_id: 'mock-encrypted-id-4',
    slot_start_time: '2025-10-13T15:00:00',
    slot_end_time: '2025-10-13T18:00:00',
    pickup_location: 'Kingman Hall',
  },
];

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
function parseBackendUtc(ts?: string | null): Date | null {
  if (!ts) return null;
  const iso = ts.replace(' ', 'T').replace(' UTC', 'Z');
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

function fmtHour(d: Date): string {
  const h = d.getHours(); // local hours
  const hr12 = h % 12 || 12; // 0→12
  return String(hr12) + ':00';
}

function ampm(d: Date): 'AM' | 'PM' {
  return d.getHours() < 12 ? 'AM' : 'PM';
}

function fmtShortHourRange(
  startStr?: string | null,
  endStr?: string | null,
  opts?: { showAmPm?: boolean },
) {
  const s = parseBackendUtc(startStr);
  const e = parseBackendUtc(endStr);
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
  return `${weekday}, ${day} ${month}`;
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
  slot_start_time: string | null;
  slot_end_time: string | null;
  pickup_location: string;
};

//today tomorrow slider
function SegmentedTwo({
  leftLabel,
  rightLabel,
  value,
  onChange,
}: {
  leftLabel: string;
  rightLabel: string;
  value: 'left' | 'right';
  onChange: (v: 'left' | 'right') => void;
}) {
  return (
    <View style={styles.segmentWrap}>
      <Pressable
        onPress={() => onChange('left')}
        style={[
          styles.segmentBtn,
          value === 'left'
            ? styles.segmentBtnActive
            : styles.segmentBtnInactive,
        ]}
      >
        <Text
          style={[
            styles.segmentText,
            value === 'left'
              ? styles.segmentTextActive
              : styles.segmentTextInactive,
          ]}
        >
          {leftLabel}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onChange('right')}
        style={[
          styles.segmentBtn,
          value === 'right'
            ? styles.segmentBtnActive
            : styles.segmentBtnInactive,
        ]}
      >
        <Text
          style={[
            styles.segmentText,
            value === 'right'
              ? styles.segmentTextActive
              : styles.segmentTextInactive,
          ]}
        >
          {rightLabel}
        </Text>
      </Pressable>
    </View>
  );
}
//start of page layout
export default function AvailablePickupsPage() {
  const todayISO = new Date().toISOString().slice(0, 10);
  const tomorrowISO = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, []);

  const [tab, setTab] = React.useState<'left' | 'right'>('left');
  const [selectedISO, setSelectedISO] = React.useState(todayISO);

  const [remote, setRemote] = React.useState<UiPickup[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('tasks');
        if (savedTasks) {
          setRemote(JSON.parse(savedTasks));
        }
        const res = await fetch(`${BASE_URL}/api/tasks`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ApiTask[] = await res.json();
        const mapped = data.map(t => ({
          id: t.id,
          encrypted_id: t.encrypted_id,
          slot_start_time: t.start_time,
          slot_end_time: t.end_time,
          pickup_location: t.location_name ?? 'Unknown location',
        }));

        await AsyncStorage.setItem('tasks', JSON.stringify(mapped));
        setRemote(mapped);
      } catch (e: unknown) {
        setError(getErrorMessage(e));
        const savedTasks = await AsyncStorage.getItem('tasks');
        if (savedTasks) {
          setRemote(JSON.parse(savedTasks));
        }
      }
    })();
  }, []);

  const source = remote ?? MOCK_PICKUPS; // fallback to mocks if fetch not ready
  const filtered = React.useMemo(
    () => source.filter(p => p.slot_start_time?.slice(0, 10) === selectedISO),
    [source, selectedISO],
  );

  return (
    <FlatList
      data={filtered}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={styles.contentContainer}
      ListHeaderComponent={
        <View>
          {error ? (
            <View style={styles.error}>
              <Text style={{ color: '#991b1b' }}>
                Failed to load tasks: {error}
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
            <SegmentedTwo
              leftLabel="Today"
              rightLabel="Tomorrow"
              value={tab}
              onChange={v => {
                setTab(v);
                setSelectedISO(v === 'left' ? todayISO : tomorrowISO);
              }}
            />
          </View>
          <Text style={styles.dateHeaderText}>
            {fmtDateHeader(selectedISO)}
          </Text>
        </View>
      }
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      renderItem={({ item }) => (
        <View style={styles.pickupCard}>
          <View style={styles.pickupCardTop}>
            <Image source={clockIcon} style={styles.clockIcon} />
            <Text style={styles.timeText}>
              {fmtShortHourRange(item.slot_start_time, item.slot_end_time, {
                showAmPm: true,
              })}
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
              style={({ pressed }) => [
                styles.detailsButton,
                pressed && styles.detailsButtonPressed,
              ]}
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
  );
}
