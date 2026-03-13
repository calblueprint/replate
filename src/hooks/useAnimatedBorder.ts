import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import colors from '@/styles/colors';

/**
 * Animated border hook for form inputs.
 * Returns interpolated borderColor and borderWidth values
 * that transition between unfocused, focused, and error states.
 */
export function useAnimatedBorder(isFocused: boolean, hasError: boolean) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, anim]);

  const borderWidth = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.5],
  });

  const borderColor = hasError
    ? colors.error.main
    : anim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.neutral[300], colors.primary[400]],
      });

  return { borderColor, borderWidth };
}
