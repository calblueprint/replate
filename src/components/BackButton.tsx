import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface BackButtonProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export default function BackButton({ style, onPress }: BackButtonProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        // Fallback if can't go back, try to replace with index
        router.replace('/landing');
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
    fontFamily: 'Lato_400Regular',
    color: '#525454',
  },
});
