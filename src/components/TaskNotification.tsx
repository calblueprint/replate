import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '@/styles/colors';

interface TaskNotificationProps {
  visible: boolean;
  message: string;
  onUndo?: () => void;
}

export default function TaskNotification({
  visible,
  message,
  onUndo,
}: TaskNotificationProps) {
  const translateY = useRef(new Animated.Value(-60)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 65,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -60,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, opacity]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY }], opacity }]}
    >
      <View style={styles.accentBar} />
      <Text style={styles.message}>{message}</Text>
      {onUndo && (
        <Pressable onPress={onUndo} hitSlop={8}>
          <Text style={styles.undoText}>Undo</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 51,
    left: 24,
    right: 24,
    height: 42,
    backgroundColor: '#EEF6F3',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: Colors.primaryGreen,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 10,
  },
  accentBar: {
    width: 10,
    height: 42,
    backgroundColor: Colors.primaryGreen,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Lato',
    fontWeight: '600',
    color: Colors.black,
    marginLeft: 12,
    lineHeight: 20,
  },
  undoText: {
    fontSize: 14,
    fontFamily: 'LatoLight',
    color: Colors.black,
    marginRight: 16,
    lineHeight: 20,
  },
});
