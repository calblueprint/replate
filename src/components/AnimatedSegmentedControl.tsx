import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, View } from 'react-native';
import colors from '@/styles/colors';

interface AnimatedSegmentedControlProps {
  leftLabel: string;
  rightLabel: string;
  value: 'left' | 'right';
  onChange: (value: 'left' | 'right') => void;
}

export default function AnimatedSegmentedControl({
  leftLabel,
  rightLabel,
  value,
  onChange,
}: AnimatedSegmentedControlProps) {
  const translateX = useRef(
    new Animated.Value(value === 'left' ? 0 : 1),
  ).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value === 'left' ? 0 : 1,
      useNativeDriver: false,
      friction: 8,
      tension: 65,
    }).start();
  }, [value]);

  const segmentWidth = containerWidth / 2;

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <Animated.View className="mx-5 mb-5" style={{ opacity: fadeAnim }}>
      <View
        className="flex-row bg-neutral-100 rounded-full h-[42px] border border-neutral-200 relative"
        onLayout={handleLayout}
      >
        {containerWidth > 0 && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: segmentWidth - 4,
                height: 38,
                backgroundColor: colors.primary[400],
                borderRadius: 19,
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 3,
                elevation: 3,
                transform: [
                  {
                    translateX: translateX.interpolate({
                      inputRange: [0, 1],
                      outputRange: [2, segmentWidth - 2],
                    }),
                  },
                ],
              },
            ]}
          />
        )}

        <Pressable
          className="flex-1 justify-center items-center z-[2]"
          onPress={() => onChange('left')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="tab"
          accessibilityLabel={leftLabel}
          accessibilityState={{ selected: value === 'left' }}
        >
          <Animated.Text
            className="text-base font-subheading"
            style={{
              color: translateX.interpolate({
                inputRange: [0, 1],
                outputRange: [colors.white, colors.neutral[700]],
              }),
            }}
          >
            {leftLabel}
          </Animated.Text>
        </Pressable>

        <Pressable
          className="flex-1 justify-center items-center z-[2]"
          onPress={() => onChange('right')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="tab"
          accessibilityLabel={rightLabel}
          accessibilityState={{ selected: value === 'right' }}
        >
          <Animated.Text
            className="text-base font-subheading"
            style={{
              color: translateX.interpolate({
                inputRange: [0, 1],
                outputRange: [colors.neutral[700], colors.white],
              }),
            }}
          >
            {rightLabel}
          </Animated.Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
