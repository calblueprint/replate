import React from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { fmtTimeRange } from '@/utils/dateHelpers';
import { styles } from './styles';

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

  const filtered = React.useMemo(
    () =>
      MOCK_PICKUPS.filter(p => p.slot_start_time.slice(0, 10) === selectedISO),
    [selectedISO],
  );

  return (
    <FlatList
      data={filtered}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={styles.contentContainer}
      ListHeaderComponent={
        <View>
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
