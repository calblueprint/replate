import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '@/styles/colors';

const SHEET_HEIGHT = 234;

interface QuickActionsSheetProps {
  visible: boolean;
  onClose: () => void;
  onMarkDelivered: () => void;
  onMarkMissing: () => void;
}

export default function QuickActionsSheet({
  visible,
  onClose,
  onMarkDelivered,
  onMarkMissing,
}: QuickActionsSheetProps) {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 9,
          tension: 65,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0.75,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SHEET_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, overlayOpacity]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Overlay */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </Pressable>

      {/* Sheet */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        {/* Drag handle */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {/* Title */}
        <Text style={styles.title}>QUICK ACTIONS</Text>

        {/* Action buttons */}
        <View style={styles.actionsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              styles.deliveredBtn,
              pressed && { opacity: 0.8 },
            ]}
            onPress={onMarkDelivered}
          >
            <Text style={styles.deliveredText}>Mark as delivered</Text>
            <Text style={[styles.actionArrow, { color: Colors.primaryGreen }]}>
              {'\u203A'}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              styles.missingBtn,
              pressed && { opacity: 0.8 },
            ]}
            onPress={onMarkMissing}
          >
            <Text style={styles.missingText}>Mark as missing</Text>
            <Text style={[styles.actionArrow, { color: Colors.missingRed }]}>
              {'\u203A'}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlayGray,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
  },
  handle: {
    width: 66,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.missedGray,
  },
  title: {
    fontSize: 13,
    fontFamily: 'LatoBold',
    color: Colors.filterGray,
    marginTop: 19,
    marginLeft: 29,
    marginBottom: 16,
  },
  actionsContainer: {
    paddingHorizontal: 23,
    gap: 8,
  },
  actionBtn: {
    height: 55,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  deliveredBtn: {
    backgroundColor: Colors.lightBg,
  },
  missingBtn: {
    backgroundColor: Colors.lightRed,
    borderWidth: 1,
    borderColor: Colors.missingRed,
  },
  deliveredText: {
    fontSize: 15,
    fontFamily: 'LatoBold',
    color: Colors.cardTitle,
  },
  missingText: {
    fontSize: 15,
    fontFamily: 'LatoBold',
    color: Colors.cardTitle,
  },
  actionArrow: {
    fontSize: 24,
    fontWeight: '300',
  },
});
