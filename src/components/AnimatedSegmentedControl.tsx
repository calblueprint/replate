import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Colors from '@/styles/colors';

const { width } = Dimensions.get('window');

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
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.slider,
            {
              transform: [
                {
                  translateX: translateX.interpolate({
                    inputRange: [0, 1],
                    outputRange: [2, (width - 52) / 2 - 2],
                  }),
                },
              ],
            },
          ]}
        />

        <Pressable
          style={styles.button}
          onPress={() => onChange('left')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
          onPress={() => onChange('right')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
    marginHorizontal: 26,
    marginBottom: 23,
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
    width: (width - 52) / 2 - 4,
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
