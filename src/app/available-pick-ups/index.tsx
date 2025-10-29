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
    : 'http://192.168.102.21:3000';

export const MOCK_PICKUPS = [
  {
    id: 1,
    slot_start_time: '2025-10-14T09:00:00',
    slot_end_time: '2025-10-14T10:00:00',
    pickup_location: 'BP House',
  },
  {
    id: 2,
    slot_start_time: '2025-11-02T13:00:00',
    slot_end_time: '2025-11-02T15:00:00',
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

// datetime helpers
const fmtTimeRange = (startISO?: string | null, endISO?: string | null) => {
  if (!startISO || !endISO) return 'Time TBD';
  const s = new Date(startISO);
  const e = new Date(endISO);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 'Time TBD';
  const to12h = (d: Date) =>
    d
      .toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
      .toLowerCase();
  return `${to12h(s)} - ${to12h(e)}`;
};

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  try {
    return JSON.stringify(e);
  } catch {
    return 'Unknown error';
  }
}
const toISO = (dateStr?: string | null, timeStr?: string | null) => {
  if (!dateStr || !timeStr) return null;
  const hhmm = timeStr.length === 5 ? `${timeStr}:00` : timeStr; // "09:00" -> "09:00:00"
  return `${dateStr}T${hhmm}`;
};

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
        const res = await fetch(`${BACKEND_URL}/api/tasks`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ApiTask[] = await res.json();
        // map backend -> UI shape
        const mapped = data.map(t => ({
          id: t.id,
          slot_start_time: toISO(t.pickup_date, t.start_time),
          slot_end_time: toISO(t.pickup_date, t.end_time),
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
            {fmtTimeRange(item.slot_start_time, item.slot_end_time)}
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
