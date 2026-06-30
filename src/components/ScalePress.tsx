import React from 'react';
import { Pressable, PressableProps, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface ScalePressProps extends PressableProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  scaleValue?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_DOWN = { damping: 15, stiffness: 400, mass: 0.5 };
const SPRING_UP = { damping: 12, stiffness: 200, mass: 0.5 };

export default function ScalePress({
  children,
  style,
  scaleValue = 0.96,
  onLongPress,
  ...props
}: ScalePressProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(scaleValue, SPRING_DOWN);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, SPRING_UP);
      }}
      onLongPress={onLongPress}
      style={[style, animatedStyle]}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}
