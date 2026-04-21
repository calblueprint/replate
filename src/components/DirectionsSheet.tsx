import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '@/styles/colors';

const SHEET_HEIGHT = 234;

interface DirectionsSheetProps {
  visible: boolean;
  onClose: () => void;
  onAppleMaps: () => void;
  onGoogleMaps: () => void;
}

export default function DirectionsSheet({
  visible,
  onClose,
  onAppleMaps,
  onGoogleMaps,
}: DirectionsSheetProps) {
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
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </Pressable>

      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <Text style={styles.title}>GET DIRECTIONS</Text>

        <View style={styles.optionsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.optionBtn,
              pressed && { opacity: 0.8 },
            ]}
            onPress={onAppleMaps}
          >
            <Text style={styles.optionText}>Open in Apple Maps</Text>
            <Text style={styles.optionArrow}>{'\u203A'}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.optionBtn,
              pressed && { opacity: 0.8 },
            ]}
            onPress={onGoogleMaps}
          >
            <Text style={styles.optionText}>Open in Google Maps</Text>
            <Text style={styles.optionArrow}>{'\u203A'}</Text>
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
  optionsContainer: {
    paddingHorizontal: 23,
    gap: 8,
  },
  optionBtn: {
    height: 55,
    borderRadius: 10,
    backgroundColor: Colors.lightBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 15,
    fontFamily: 'LatoBold',
    color: Colors.black,
  },
  optionArrow: {
    fontSize: 24,
    fontWeight: '300',
    color: Colors.black,
  },
});
