import React, { useEffect } from 'react';
import { DimensionValue, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import colors from '@/styles/colors';

interface SkeletonProps {
  width?: number | DimensionValue;
  height?: number;
  borderRadius?: number;
  className?: string;
  circle?: boolean;
}

export default function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
  className = '',
  circle = false,
}: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const size = circle ? (height ?? 40) : undefined;

  return (
    <View className={className}>
      <Animated.View
        style={[
          {
            width: circle ? size : width,
            height: circle ? size : height,
            borderRadius: circle ? size! / 2 : borderRadius,
            backgroundColor: colors.neutral[200],
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
