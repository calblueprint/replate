import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '@/styles/colors';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  subtitle: string;
  onBack: () => void;
  onConfirm: () => void;
}

export default function ConfirmationModal({
  visible,
  title,
  subtitle,
  onBack,
  onConfirm,
}: ConfirmationModalProps) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
          tension: 65,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0.75,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.85,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim, overlayOpacity]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Overlay */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onBack}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </Pressable>

      {/* Modal */}
      <View style={styles.centerContainer} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.modal,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.buttonGroup}>
            <Pressable
              style={({ pressed }) => [
                styles.btn,
                styles.confirmBtn,
                pressed && { opacity: 0.85 },
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>Confirm</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.btn,
                styles.backBtn,
                pressed && { opacity: 0.85 },
              ]}
              onPress={onBack}
            >
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlayGray,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: 253,
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 11,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Lato',
    fontWeight: '600',
    color: Colors.cardTitle,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Lato',
    fontWeight: '600',
    color: Colors.filterGray,
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonGroup: {
    width: '100%',
    gap: 8,
  },
  btn: {
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtn: {
    backgroundColor: Colors.primaryGreen,
  },
  confirmText: {
    fontSize: 14,
    fontFamily: 'LatoBold',
    color: Colors.white,
    letterSpacing: 0.28,
  },
  backBtn: {
    backgroundColor: Colors.lightBg,
    borderRadius: 5,
  },
  backText: {
    fontSize: 14,
    fontFamily: 'LatoBold',
    color: Colors.filterGray,
    letterSpacing: 0.28,
  },
});
