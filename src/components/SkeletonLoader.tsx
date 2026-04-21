import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

function Skeleton({ width, height, borderRadius = 6, style }: SkeletonProps) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.3, 0.7]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: '#D4DBE4',
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function TaskCardSkeleton() {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
  }, [opacity]);

  return (
    <Animated.View style={[skeletonStyles.taskCard, { opacity }]}>
      {/* Accent bar */}
      <Skeleton
        width={4}
        height={50}
        borderRadius={20}
        style={{ marginLeft: 14 }}
      />
      <View style={skeletonStyles.taskCardBody}>
        {/* Time row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Skeleton width={6} height={6} borderRadius={3} />
          <Skeleton width={120} height={12} />
        </View>
        {/* Title */}
        <Skeleton width={200} height={14} style={{ marginTop: 8 }} />
        {/* Address */}
        <Skeleton width={160} height={12} style={{ marginTop: 6 }} />
      </View>
    </Animated.View>
  );
}

export function AvailableCardSkeleton() {
  return (
    <Animated.View style={skeletonStyles.availableCard}>
      <Skeleton
        width={4}
        height={50}
        borderRadius={2}
        style={{ marginLeft: 12 }}
      />
      <View style={{ flex: 1, marginLeft: 16, gap: 6 }}>
        <Skeleton width={180} height={16} />
        <Skeleton width={140} height={12} />
        <Skeleton width={100} height={12} />
      </View>
    </Animated.View>
  );
}

export function TaskListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={{ paddingHorizontal: 20, gap: 24 }}>
      {Array.from({ length: count }).map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </View>
  );
}

export function AvailableListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <View style={{ paddingHorizontal: 10, gap: 14 }}>
      {Array.from({ length: count }).map((_, i) => (
        <AvailableCardSkeleton key={i} />
      ))}
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 110,
    overflow: 'hidden',
  },
  taskCardBody: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 16,
    paddingVertical: 16,
  },
  availableCard: {
    height: 89,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    overflow: 'hidden',
  },
});
