import React, { useEffect, useRef } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Colors from '@/styles/colors';

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
  const [trackWidth, setTrackWidth] = React.useState(0);
  const { width: windowWidth } = useWindowDimensions();
  const translateX = useRef(
    new Animated.Value(value === 'left' ? 0 : 1),
  ).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fallbackWidth = Math.max(0, windowWidth - 52);
  const sliderRange = Math.max(
    0,
    trackWidth > 0 ? trackWidth / 2 - 2 : fallbackWidth / 2 - 2,
  );
  const sliderWidth = Math.max(
    0,
    trackWidth > 0 ? trackWidth / 2 - 4 : fallbackWidth / 2 - 4,
  );

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (width > 0) {
      setTrackWidth(width);
    }
  };

  const onSelectSegment = (segment: 'left' | 'right') => {
    if (segment === 'left') {
      onChange('left');
      return;
    }
    onChange('right');
  };

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

  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim }]}
      onLayout={handleTrackLayout}
    >
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.slider,
            {
              width: sliderWidth,
              transform: [
                {
                  translateX: translateX.interpolate({
                    inputRange: [0, 1],
                    outputRange: [2, sliderRange],
                  }),
                },
              ],
            },
          ]}
        />

        <Pressable
          style={styles.button}
          onPress={() => onSelectSegment('left')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityState={{ selected: value === 'left' }}
        >
          <Animated.Text
            style={[
              styles.label,
              {
                color: translateX.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#fff', '#000'],
                }),
              },
            ]}
          >
            {leftLabel}
          </Animated.Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => onSelectSegment('right')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityState={{ selected: value === 'right' }}
        >
          <Animated.Text
            style={[
              styles.label,
              {
                color: translateX.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#000', '#fff'],
                }),
              },
            ]}
          >
            {rightLabel}
          </Animated.Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    marginTop: 12,
    marginBottom: 0,
  },
  track: {
    flexDirection: 'row',
    backgroundColor: '#f3f3f3',
    borderRadius: 25,
    height: 50,
    borderWidth: 1,
    borderColor: '#E4EDFF',
    position: 'relative',
  },
  slider: {
    position: 'absolute',
    height: 46,
    backgroundColor: Colors.jasmine,
    borderRadius: 23,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Lato',
  },
});
