import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { router, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
          } catch (err) {
            // If all else fails, just go to landing
            console.log('Navigation error, going to landing:', err);
            router.replace('/landing');
          }
        }
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, style]}
      activeOpacity={0.7}
    >
      <Ionicons
        name="chevron-back"
        size={24}
        color="#525454"
        style={styles.icon}
      />
      <Text style={styles.text}>Back</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
    // Shift slightly left to align the text with content if desired,
    // but typically top-left alignment is fine.
    marginLeft: -8, // Offset the padding built into the icon usually
  },
  icon: {
    marginRight: 5,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Lato',
    color: '#525454',
  },
});
