import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedEntryProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  from?: {
    opacity?: number;
    translateY?: number;
    scale?: number;
  };
  style?: ViewStyle;
  className?: string;
}

const DEFAULT_FROM = { opacity: 0, translateY: 16 };

export default function AnimatedEntry({
  children,
  delay = 0,
  duration = 400,
  from = DEFAULT_FROM,
  style,
  className,
}: AnimatedEntryProps) {
  const opacity = useSharedValue(from.opacity ?? 1);
  const translateY = useSharedValue(from.translateY ?? 0);
  const scale = useSharedValue(from.scale ?? 1);

  useEffect(() => {
    const easing = Easing.out(Easing.cubic);

    if (from.opacity !== undefined) {
      opacity.value = withDelay(delay, withTiming(1, { duration, easing }));
    }
    if (from.translateY !== undefined) {
      translateY.value = withDelay(delay, withTiming(0, { duration, easing }));
    }
    if (from.scale !== undefined) {
      scale.value = withDelay(delay, withTiming(1, { duration, easing }));
    }
  }, [delay, duration, from, opacity, translateY, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View className={className} style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
