import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { router, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/styles/colors';

interface BackButtonProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export default function BackButton({ style, onPress }: BackButtonProps) {
  const segments = useSegments();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // For auth screens, always go to landing without checking canGoBack
      const isAuthScreen = segments[0] === 'auth';

      if (isAuthScreen) {
        // Always use replace for auth screens to avoid navigation stack issues
        router.replace('/landing');
      } else {
        // For other screens, wrap everything in try-catch
        try {
          // Try to go back if possible
          router.back();
        } catch {
          // If back fails, try canGoBack check
          try {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/landing');
            }
          } catch {
            // If all else fails, just go to landing
            router.replace('/landing');
          }
        }
      }
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[{ padding: 4, alignSelf: 'flex-start', marginBottom: 12 }, style]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityLabel="Go back"
      accessibilityRole="button"
    >
      <Ionicons name="chevron-back" size={24} color={colors.neutral[700]} />
    </Pressable>
  );
}
