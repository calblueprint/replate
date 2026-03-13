import React, { useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  PressableProps,
  ViewStyle,
} from 'react-native';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps extends PressableProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  className?: string;
  scaleValue?: number;
  animationDuration?: number;
}

export default function AnimatedPressable({
  children,
  style,
  className,
  onPress,
  onPressIn,
  onPressOut,
  scaleValue = 0.95,
  animationDuration = 100,
  ...props
}: AnimatedPressableProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (event: GestureResponderEvent) => {
    Animated.timing(scaleAnim, {
      toValue: scaleValue,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
    onPressOut?.(event);
  };

  return (
    <AnimatedPressableBase
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      className={className}
      style={[style, { transform: [{ scale: scaleAnim }] }]}
      {...props}
    >
      {children}
    </AnimatedPressableBase>
  );
}
