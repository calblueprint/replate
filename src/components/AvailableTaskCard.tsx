import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ScalePress from '@/components/ScalePress';
import Colors from '@/styles/colors';

interface AvailableTaskCardProps {
  locationName: string;
  address: string;
  timeRange: string;
  index: number;
  onPress: () => void;
}

export default function AvailableTaskCard({
  locationName,
  address,
  timeRange,
  index,
  onPress,
}: AvailableTaskCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .duration(350)
        .springify()
        .damping(18)}
    >
      <ScalePress onPress={onPress}>
        <View style={styles.card}>
          {/* Left accent line */}
          <View style={styles.accentLine} />

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.locationName} numberOfLines={1}>
              {locationName}
            </Text>
            <Text style={styles.address} numberOfLines={1}>
              {address}
            </Text>
            <Text style={styles.timeRange} numberOfLines={1}>
              {timeRange}
            </Text>
          </View>

          {/* Arrow */}
          <View style={styles.arrowContainer}>
            <View style={styles.arrowCircle}>
              <Text style={styles.arrow}>{'\u203A'}</Text>
            </View>
          </View>
        </View>
      </ScalePress>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 89,
    backgroundColor: Colors.white,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    paddingLeft: 0,
    overflow: 'hidden',
  },
  accentLine: {
    width: 4,
    height: 50,
    backgroundColor: Colors.primaryGreen,
    borderRadius: 2,
    marginLeft: 12,
    marginRight: 16,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  locationName: {
    fontSize: 16,
    fontFamily: 'Lato',
    fontWeight: '500',
    color: Colors.black,
    lineHeight: 24,
  },
  address: {
    fontSize: 12,
    fontFamily: 'Lato',
    color: Colors.dateGray,
    lineHeight: 16,
  },
  timeRange: {
    fontSize: 12,
    fontFamily: 'Lato',
    color: '#94A3B8',
    lineHeight: 16,
  },
  arrowContainer: {
    marginLeft: 12,
  },
  arrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 18,
    color: Colors.black,
    fontWeight: '600',
    lineHeight: 20,
  },
});
