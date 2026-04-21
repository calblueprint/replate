import React, { useMemo, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
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

export default function DayCarousel({
  selectedDate,
  onSelectDate,
  dayCount = 7,
}: DayCarouselProps) {
  const scrollRef = useRef<ScrollView>(null);

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
      contentContainerStyle={styles.container}
    >
      {days.map(item => {
        const isSelected = item.iso === selectedDate;
        return (
          <Pressable
            key={item.iso}
            style={[
              styles.dayItem,
              isSelected ? styles.dayItemSelected : styles.dayItemUnselected,
            ]}
            onPress={() => onSelectDate(item.iso)}
          >
            <Text
              style={[styles.monthText, isSelected && styles.monthTextSelected]}
            >
              {item.month}
            </Text>
            <Text
              style={[
                styles.weekdayText,
                isSelected && styles.weekdayTextSelected,
              ]}
            >
              {item.weekday}
            </Text>
            <Text
              style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}
            >
              {item.day}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 0,
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginRight: 4,
  },
  dayItemUnselected: {
    width: 61,
    height: 80,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 32,
    elevation: 2,
  },
  dayItemSelected: {
    width: 71,
    height: 92,
    backgroundColor: Colors.profileBg,
    borderWidth: 1,
    borderColor: Colors.primaryGreen,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 32,
    elevation: 2,
  },
  monthText: {
    fontSize: 10,
    fontFamily: 'LatoBold',
    color: Colors.black,
    marginBottom: 2,
  },
  monthTextSelected: {
    color: Colors.black,
  },
  weekdayText: {
    fontSize: 10,
    fontFamily: 'LatoBold',
    color: Colors.black,
    marginBottom: 4,
  },
  weekdayTextSelected: {
    color: Colors.black,
  },
  dayNumber: {
    fontSize: 18,
    fontFamily: 'LatoBold',
    color: Colors.secondaryGreen,
  },
  dayNumberSelected: {
    color: Colors.secondaryGreen,
  },
});
