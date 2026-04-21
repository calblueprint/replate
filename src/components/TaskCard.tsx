import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ScalePress from '@/components/ScalePress';
import Colors from '@/styles/colors';

export type TaskStatus =
  | 'active'
  | 'overdue'
  | 'missing'
  | 'completed'
  | 'missed';

interface TaskCardProps {
  locationName: string;
  address: string;
  timeRange: string;
  status: TaskStatus;
  completedDate?: string;
  index: number;
  onPress: () => void;
  onLongPress?: () => void;
}

const STATUS_CONFIG: Record<
  TaskStatus,
  {
    accentColor: string;
    badgeText: string | null;
    badgeColor: string;
    timeColor: string;
    dotColor: string;
    viewDetailsBg: string;
  }
> = {
  active: {
    accentColor: Colors.primaryGreen,
    badgeText: null,
    badgeColor: 'transparent',
    timeColor: Colors.secondaryGreen,
    dotColor: Colors.primaryGreen,
    viewDetailsBg: Colors.primaryGreen,
  },
  overdue: {
    accentColor: Colors.overdueYellow,
    badgeText: 'Overdue',
    badgeColor: Colors.overdueYellow,
    timeColor: Colors.overdueYellow,
    dotColor: Colors.overdueYellow,
    viewDetailsBg: Colors.overdueYellow,
  },
  missing: {
    accentColor: Colors.missingRed,
    badgeText: 'Missing',
    badgeColor: Colors.missingRed,
    timeColor: Colors.missingRed,
    dotColor: Colors.missingRed,
    viewDetailsBg: Colors.missingRed,
  },
  completed: {
    accentColor: Colors.primaryGreen,
    badgeText: 'Completed',
    badgeColor: Colors.dateGray,
    timeColor: Colors.secondaryGreen,
    dotColor: Colors.primaryGreen,
    viewDetailsBg: Colors.primaryGreen,
  },
  missed: {
    accentColor: Colors.missedGray,
    badgeText: 'Missed',
    badgeColor: Colors.dateGray,
    timeColor: Colors.dateGray,
    dotColor: Colors.missedGray,
    viewDetailsBg: Colors.missedGray,
  },
};

export default function TaskCard({
  locationName,
  address,
  timeRange,
  status,
  completedDate,
  index,
  onPress,
  onLongPress,
}: TaskCardProps) {
  const config = STATUS_CONFIG[status];
  const isFinished = status === 'completed' || status === 'missed';

  const timeLabel = (() => {
    if (status === 'completed' && completedDate) {
      return `Completed on ${completedDate}`;
    }
    if (status === 'missed' && completedDate) {
      return `Missed on ${completedDate}`;
    }
    return timeRange;
  })();

  const cardInner = (
    <View style={[styles.card, isFinished && styles.cardFinished]}>
      {/* Left accent bar */}
      <View
        style={[styles.accentBar, { backgroundColor: config.accentColor }]}
      />

      <View style={styles.cardBody}>
        {/* Top row: time info + badge */}
        <View style={styles.topRow}>
          <View style={styles.timeRow}>
            <View style={[styles.dot, { backgroundColor: config.dotColor }]} />
            <Text
              style={[
                styles.timeText,
                { color: config.timeColor },
                (status === 'overdue' || status === 'missing') &&
                  styles.timeBold,
              ]}
            >
              {timeLabel}
            </Text>
          </View>
          {config.badgeText && (
            <Text style={[styles.badge, { color: config.badgeColor }]}>
              {config.badgeText}
            </Text>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>
          Pickup from {locationName}
        </Text>

        {/* Address */}
        <Text style={styles.address} numberOfLines={1}>
          {address}
        </Text>

        {/* Finished cards: View Details button */}
        {isFinished && (
          <Pressable
            style={[
              styles.viewDetailsBtn,
              { backgroundColor: config.viewDetailsBg },
            ]}
            onPress={onPress}
          >
            <Text style={styles.viewDetailsBtnText}>View Details</Text>
          </Pressable>
        )}
      </View>

      {/* Active cards: arrow on right */}
      {!isFinished && (
        <View style={styles.arrowContainer}>
          <Text style={[styles.arrow, { color: config.accentColor }]}>
            {'\u203A'}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60)
        .duration(400)
        .springify()
        .damping(18)}
    >
      {isFinished ? (
        cardInner
      ) : (
        <ScalePress
          onPress={onPress}
          onLongPress={onLongPress}
          delayLongPress={400}
        >
          {cardInner}
        </ScalePress>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 24,
    minHeight: 110,
    overflow: 'hidden',
  },
  cardFinished: {
    minHeight: 131,
  },
  accentBar: {
    width: 4,
    borderRadius: 20,
    marginLeft: 14,
    marginVertical: 20,
  },
  cardBody: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 16,
    paddingVertical: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Lato',
    lineHeight: 16,
  },
  timeBold: {
    fontFamily: 'LatoBold',
  },
  badge: {
    fontSize: 12,
    fontFamily: 'LatoBold',
    lineHeight: 24,
  },
  title: {
    fontSize: 14,
    fontFamily: 'LatoBold',
    color: Colors.cardTitle,
    lineHeight: 20,
    marginBottom: 2,
  },
  address: {
    fontSize: 12,
    fontFamily: 'Lato',
    fontWeight: '600',
    color: Colors.dateGray,
    lineHeight: 16,
  },
  viewDetailsBtn: {
    borderRadius: 8,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  viewDetailsBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'LatoBold',
    lineHeight: 24,
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingRight: 16,
  },
  arrow: {
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 28,
  },
});
