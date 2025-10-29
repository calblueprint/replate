import React from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { router } from 'expo-router';

type AppExtra = { EXPO_PUBLIC_BACKEND_URL?: string };

const rawExtra: unknown = Constants.expoConfig?.extra;
const extra: AppExtra =
  rawExtra && typeof rawExtra === 'object' ? (rawExtra as AppExtra) : {};

export const BACKEND_URL =
  typeof extra.EXPO_PUBLIC_BACKEND_URL === 'string'
    ? extra.EXPO_PUBLIC_BACKEND_URL
    : '10.40.164.190:3000';

export const MOCK_PICKUPS = [
  {
    id: 1,
    slot_start_time: '2025-10-14T09:00:00',
    slot_end_time: '2025-10-14T10:00:00',
    pickup_location: 'BP House',
  },
  {
    id: 2,
    slot_start_time: '2025-10-13T13:00:00',
    slot_end_time: '2025-10-13T15:00:00',
    pickup_location: 'Rockridge Cafe',
  },
  {
    id: 3,
    slot_start_time: '2025-10-13T15:00:00',
    slot_end_time: '2025-10-13T18:00:00',
    pickup_location: 'Bongo’s Burgers',
  },
  {
    id: 4,
    slot_start_time: '2025-10-13T15:00:00',
    slot_end_time: '2025-10-13T18:00:00',
    pickup_location: 'Kingman Hall',
  },
];

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

function ampm(d: Date): 'am' | 'pm' {
  return d.getHours() < 12 ? 'am' : 'pm';
}

function fmtShortHourRange(
  startStr?: string | null,
  endStr?: string | null,
  opts?: { showAmPm?: boolean },
) {
  const s = parseBackendUtc(startStr);
  const e = parseBackendUtc(endStr);
  if (!s || !e) return 'Time TBD';

  const base = `${fmtHour(s)}–${fmtHour(e)}`;
  if (opts?.showAmPm) {
    return ampm(s) === ampm(e)
      ? `${base} ${ampm(s)}`
      : `${fmtHour(s)} ${ampm(s)}–${fmtHour(e)} ${ampm(e)}`;
  }
  return base;
}

type ApiTask = {
  id: number;
  pickup_date: string;
  start_time: string | null;
  end_time: string | null;
  location_name: string | null;
};

type UiPickup = {
  id: number;
  slot_start_time: string | null;
  slot_end_time: string | null;
  pickup_location: string;
};

//makes calendar
function CalendarStrip({
  days,
  todayISO,
  selectedISO,
  onSelect,
}: {
  days: string[];
  todayISO: string;
  selectedISO: string;
  onSelect: (iso: string) => void;
}) {
  const dateFromISO = (iso: string) => new Date(`${iso}T00:00:00`);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 6 }}
    >
      {days.map(iso => {
        const d = dateFromISO(iso);
        const isToday = iso === todayISO;
        const isSelected = iso === selectedISO;

        const month = d.toLocaleDateString(undefined, { month: 'short' }); // Oct
        const day = d.toLocaleDateString(undefined, { day: '2-digit' });
        const dow = d.toLocaleDateString(undefined, { weekday: 'short' }); // Mon

        return (
          <Pressable
            key={iso}
            onPress={() => onSelect(iso)}
            style={({ pressed }) => ({
              width: 56,
              height: 72,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: isSelected ? '#000' : '#d1d5db',
              backgroundColor: isSelected ? '#000' : '#f3f4f6',
              marginRight: 8, // spacing between chips
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text
              style={{ fontSize: 10, color: isSelected ? 'white' : 'black' }}
            >
              {month}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: isSelected ? 'white' : 'black',
              }}
            >
              {day}
            </Text>
            <Text
              style={{ fontSize: 10, color: isSelected ? 'white' : 'black' }}
            >
              {dow}
            </Text>
            {isToday && (
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 9,
                  fontWeight: '700',
                  color: isSelected ? 'white' : 'black',
                }}
              >
                Today
              </Text>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export default function AvailablePickupsPage() {
  const todayISO = new Date().toISOString().slice(0, 10);
  const [selectedISO, setSelectedISO] = React.useState(todayISO);
  const [remote, setRemote] = React.useState<UiPickup[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/tasks`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ApiTask[] = await res.json();
        const mapped = data.map(t => ({
          id: t.id,
          slot_start_time: t.start_time,
          slot_end_time: t.end_time,
          pickup_location: t.location_name ?? 'Unknown location',
        }));
        setRemote(mapped);
      } catch (e: unknown) {
        setError(getErrorMessage(e));
      }
    })();
  }, []);
  const days = React.useMemo(() => {
    const out: string[] = [];
    const start = new Date();
    start.setDate(start.getDate() - 1);
    for (let i = 0; i < 5; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      out.push(d.toISOString().slice(0, 10));
    }
    return out;
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
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 8,
      }}
      ListHeaderComponent={
        <View>
          {error ? (
            <View
              style={{
                padding: 16,
                backgroundColor: '#fee2e2',
                borderRadius: 8,
                marginTop: 16,
              }}
            >
              <Text style={{ color: '#991b1b' }}>
                Failed to load tasks: {error}
              </Text>
            </View>
          ) : null}
          <CalendarStrip
            days={days}
            todayISO={todayISO}
            selectedISO={selectedISO}
            onSelect={setSelectedISO}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              marginTop: 40,
              marginBottom: 12,
              paddingHorizontal: 4,
            }}
          >
            Available Pickups
          </Text>
        </View>
      }
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => router.push(`/pickup-details/${item.id}`)}
          style={({ pressed }) => ({
            padding: 16,
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 16,
            backgroundColor: '#eee',
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Text style={{ fontWeight: '700', marginBottom: 6 }}>
            {fmtShortHourRange(item.slot_start_time, item.slot_end_time, {
              showAmPm: true,
            })}
          </Text>
          <Text>{item.pickup_location}</Text>
        </Pressable>
      )}
      ListEmptyComponent={
        <Text style={{ padding: 16 }}>No pickups for this date.</Text>
      }
    />
  );
}
