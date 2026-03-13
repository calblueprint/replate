import React, { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface FadeTransitionProps {
  isLoaded: boolean;
  children: React.ReactNode;
  duration?: number;
}

export default function FadeTransition({
  isLoaded,
  children,
  duration = 300,
}: FadeTransitionProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.97);

  useEffect(() => {
    if (isLoaded) {
      const easing = Easing.out(Easing.cubic);
      opacity.value = withTiming(1, { duration, easing });
      scale.value = withTiming(1, { duration, easing });
    }
  }, [isLoaded, duration, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!isLoaded) return null;

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
