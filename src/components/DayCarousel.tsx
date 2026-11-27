import React, { useMemo, useRef } from 'react';
import {
  ScrollView,
  ScrollViewInstance,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '@/styles/colors';

interface DayCarouselProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  dayCount?: number;
}

function localISODate(d: Date): string {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

function DayItem({
  month,
  weekday,
  day,
  isSelected,
  onPress,
}: {
  month: string;
  weekday: string;
  day: number;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.dayItem, isSelected && styles.selectedDayItem]}>
        <Text style={[styles.monthText, isSelected && styles.selectedText]}>
          {month}
        </Text>
        <Text style={[styles.dayNumber, isSelected && styles.selectedText]}>
          {day}
        </Text>
        <Text style={[styles.weekdayText, isSelected && styles.selectedText]}>
          {weekday}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function DayCarousel({
  selectedDate,
  onSelectDate,
  dayCount = 7,
}: DayCarouselProps) {
  const scrollRef = useRef<ScrollViewInstance>(null);

  const days = useMemo(() => {
    const result: {
      iso: string;
      month: string;
      weekday: string;
      day: number;
    }[] = [];
    const today = new Date();

    for (let i = 0; i < dayCount; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      result.push({
        iso: localISODate(d),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
        day: d.getDate(),
      });
    }
    return result;
  }, [dayCount]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0 }}
      contentContainerStyle={styles.container}
    >
      {days.map(item => (
        <DayItem
          key={item.iso}
          {...item}
          isSelected={item.iso === selectedDate}
          onPress={() => onSelectDate(item.iso)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 8,
    alignItems: 'center',
  },
  dayItem: {
    width: 61,
    height: 80,
    paddingVertical: 8,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  selectedDayItem: {
    width: 71,
    height: 92,
    paddingVertical: 11,
    backgroundColor: Colors.profileBg,
    borderWidth: 1,
    borderColor: Colors.primaryGreen,
  },
  monthText: {
    fontSize: 10,
    fontFamily: 'LatoBold',
    color: Colors.black,
  },
  dayNumber: {
    fontSize: 18,
    fontFamily: 'LatoBold',
    color: Colors.secondaryGreen,
  },
  weekdayText: {
    fontSize: 10,
    fontFamily: 'LatoBold',
    color: Colors.black,
  },
  selectedText: {
    color: Colors.secondaryGreen,
  },
});
