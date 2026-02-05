import React, { useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  PressableProps,
  ViewStyle,
} from 'react-native';

interface AnimatedPressableProps extends PressableProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  scaleValue?: number;
  animationDuration?: number;
}

export default function AnimatedPressable({
  children,
  style,
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
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
