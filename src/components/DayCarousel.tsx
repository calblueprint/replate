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
  const dynamicStyle = {
    borderWidth: isSelected ? 1 : 0,
    backgroundColor: isSelected ? Colors.profileBg : Colors.white,
    borderColor: Colors.primaryGreen,
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.dayItem, dynamicStyle]}>
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    alignItems: 'center',
  },
  dayItem: {
    width: 65,
    height: 85,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  monthText: {
    fontSize: 10,
    fontFamily: 'LatoBold',
    color: Colors.dateGray,
    marginBottom: 2,
  },
  dayNumber: {
    fontSize: 18,
    fontFamily: 'LatoBold',
    color: Colors.secondaryGreen,
    marginBottom: 2,
  },
  weekdayText: {
    fontSize: 10,
    fontFamily: 'LatoBold',
    color: Colors.dateGray,
  },
  selectedText: {
    color: Colors.secondaryGreen,
  },
});
