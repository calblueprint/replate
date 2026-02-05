import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Text,
  View,
  ViewStyle,
} from 'react-native';

interface AnimatedLoaderProps {
  message?: string;
  color?: string;
  size?: 'small' | 'large';
  style?: ViewStyle;
}

export default function AnimatedLoader({
  message = 'Loading...',
  color = '#58ad85',
  size = 'large',
  style,
}: AnimatedLoaderProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Pulse animation for the text
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    return () => pulse.stop();
  }, [fadeAnim, pulseAnim]);

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: fadeAnim,
        },
        style,
      ]}
    >
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Animated.Text
          style={{
            marginTop: 12,
            color: '#6b7280',
            fontSize: 14,
            opacity: pulseAnim,
          }}
        >
          {message}
        </Animated.Text>
      )}
    </Animated.View>
  );
}
