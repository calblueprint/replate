import React from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '~/api/config';
import { styles } from './_styles/styles';

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
      contentContainerStyle={styles.calendarStripContent}
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
            style={({ pressed }) => [
              styles.dateCard,
              isSelected ? styles.selectedCard : styles.unselectedCard,
              pressed && styles.pressedCard,
            ]}
          >
            <Text
              style={[
                styles.dateText,
                isSelected ? styles.selectedText : styles.unselectedText,
              ]}
            >
              {month}
            </Text>
            <Text
              style={[
                styles.headerText,
                isSelected ? styles.selectedText : styles.unselectedText,
              ]}
            >
              {day}
            </Text>
            <Text
              style={[
                styles.dateText,
                isSelected ? styles.selectedText : styles.unselectedText,
              ]}
            >
              {dow}
            </Text>
            {isToday && (
              <Text
                style={[
                  styles.todayText,
                  isSelected ? styles.unselectedText : styles.selectedText,
                ]}
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
  const days = React.useMemo(() => {
    const out: string[] = [];
    const start = new Date();
    start.setDate(start.getDate());
    for (let i = 0; i < 2; i++) {
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
      contentContainerStyle={styles.contentContainer}
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
          <Text style={styles.AvailablePickupstext}>Available Pickups</Text>
        </View>
      }
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => {
            console.log('task id', item.id);
            console.log('Navigating with encrypted_id:', item.encrypted_id);
            router.push({
              pathname: '/pickup-details/[id]',
              params: { id: item.encrypted_id },
            });
          }}
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
