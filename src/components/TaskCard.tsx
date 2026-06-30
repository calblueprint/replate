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
  onAddDetails?: () => void;
}

const STATUS_CONFIG: Record<
  TaskStatus,
  {
    accentColor: string;
    badgeText: string | null;
    badgeBg: string;
    badgeColor: string;
    timeColor: string;
    dotColor: string;
    actionBg: string;
    actionText: string;
  }
> = {
  active: {
    accentColor: Colors.primaryGreen,
    badgeText: null,
    badgeBg: 'transparent',
    badgeColor: 'transparent',
    timeColor: Colors.secondaryGreen,
    dotColor: Colors.primaryGreen,
    actionBg: Colors.primaryGreen,
    actionText: 'Add Details',
  },
  overdue: {
    accentColor: Colors.overdueYellow,
    badgeText: 'Overdue',
    badgeBg: '#FEFCE8',
    badgeColor: Colors.overdueYellow,
    timeColor: Colors.overdueYellow,
    dotColor: Colors.overdueYellow,
    actionBg: Colors.overdueYellow,
    actionText: 'Add Details',
  },
  missing: {
    accentColor: Colors.missingRed,
    badgeText: 'Missing',
    badgeBg: '#FEF2F2',
    badgeColor: Colors.missingRed,
    timeColor: Colors.missingRed,
    dotColor: Colors.missingRed,
    actionBg: Colors.missingRed,
    actionText: 'Add Details',
  },
  completed: {
    accentColor: Colors.primaryGreen,
    badgeText: 'Complete',
    badgeBg: Colors.profileBg,
    badgeColor: Colors.secondaryGreen,
    timeColor: Colors.secondaryGreen,
    dotColor: Colors.primaryGreen,
    actionBg: Colors.primaryGreen,
    actionText: 'View Details',
  },
  missed: {
    accentColor: Colors.missedGray,
    badgeText: 'Missed',
    badgeBg: Colors.background,
    badgeColor: Colors.slateGray,
    timeColor: Colors.filterGray,
    dotColor: Colors.missedGray,
    actionBg: Colors.missedGray,
    actionText: 'View Details',
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
  onAddDetails,
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

  const handleActionPress = isFinished ? onPress : (onAddDetails ?? onPress);

  const cardInner = (
    <View style={styles.card}>
      {/* Left accent bar */}
      <View
        style={[styles.accentBar, { backgroundColor: config.accentColor }]}
      />

      <View style={styles.cardBody}>
        {/* Top row: time info + badge pill */}
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
            <View style={[styles.badge, { backgroundColor: config.badgeBg }]}>
              <Text style={[styles.badgeText, { color: config.badgeColor }]}>
                {config.badgeText}
              </Text>
            </View>
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

        {/* Action button */}
        <Pressable
          style={[styles.actionBtn, { backgroundColor: config.actionBg }]}
          onPress={handleActionPress}
        >
          <Text style={styles.actionBtnText}>{config.actionText}</Text>
        </Pressable>
      </View>
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
    minHeight: 131,
    overflow: 'hidden',
  },
  accentBar: {
    width: 4,
    borderRadius: 20,
    marginLeft: 18,
    marginVertical: 20,
  },
  cardBody: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 16,
    paddingTop: 16,
    paddingBottom: 16,
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
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Lato',
    fontWeight: '600',
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
  actionBtn: {
    borderRadius: 8,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  actionBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'LatoBold',
    lineHeight: 24,
  },
});
