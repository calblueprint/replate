import React, { useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import ScalePress from '@/components/ScalePress';
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
  index,
}: {
  month: string;
  weekday: string;
  day: number;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}) {
  const scale = useSharedValue(isSelected ? 1 : 0.92);
  const borderWidth = useSharedValue(isSelected ? 1 : 0);

  React.useEffect(() => {
    scale.value = withSpring(isSelected ? 1 : 0.92, {
      damping: 14,
      stiffness: 200,
    });
    borderWidth.value = withSpring(isSelected ? 1 : 0, {
      damping: 14,
      stiffness: 200,
    });
  }, [isSelected, scale, borderWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderWidth: borderWidth.value,
    backgroundColor: isSelected ? Colors.profileBg : Colors.white,
    borderColor: Colors.primaryGreen,
  }));

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 40)
        .duration(300)
        .springify()}
    >
      <ScalePress onPress={onPress} scaleValue={0.9}>
        <Animated.View style={[styles.dayItem, animatedStyle]}>
          <Text style={[styles.monthText, isSelected && styles.selectedText]}>
            {month}
          </Text>
          <Text style={[styles.dayNumber, isSelected && styles.selectedText]}>
            {day}
          </Text>
          <Text style={[styles.weekdayText, isSelected && styles.selectedText]}>
            {weekday}
          </Text>
        </Animated.View>
      </ScalePress>
    </Animated.View>
  );
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
      {days.map((item, index) => (
        <DayItem
          key={item.iso}
          {...item}
          isSelected={item.iso === selectedDate}
          onPress={() => onSelectDate(item.iso)}
          index={index}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 32,
    elevation: 2,
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
