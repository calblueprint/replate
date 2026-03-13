import React from 'react';
import { Image, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import clockIcon from 'assets/date.png';
import AnimatedPressable from '@/components/AnimatedPressable';
import Skeleton from '@/components/Skeleton';
import colors from '@/styles/colors';
import { fmtShortHourRange } from '@/utils/dateHelpers';

type UiPickup = {
  id: number;
  encrypted_id: string;
  pickup_date: string;
  slot_start_time: string | null;
  slot_end_time: string | null;
  pickup_location: string;
};

interface PickupCardProps {
  task: UiPickup;
  onViewDetails: () => void;
}

export function PickupCardSkeleton() {
  return (
    <View className="mx-4 min-h-[120px] rounded-2xl bg-white overflow-hidden shadow-sm">
      <View className="bg-neutral-100 px-5 py-2.5 flex-row items-center gap-2.5">
        <Skeleton height={16} width={16} circle />
        <Skeleton height={14} width="40%" />
      </View>
      <View className="px-4 py-3.5 flex-row items-center justify-between gap-3">
        <Skeleton height={20} width="60%" />
        <Skeleton height={44} width={144} borderRadius={12} />
      </View>
    </View>
  );
}

export default function PickupCard({ task, onViewDetails }: PickupCardProps) {
  return (
    <View className="mx-4 min-h-[120px] rounded-2xl bg-white overflow-hidden shadow-sm">
      <View className="bg-primary-100/60 px-5 py-2.5 flex-row items-center gap-2.5">
        <Image source={clockIcon} className="w-4 h-4" resizeMode="contain" />
        <Text className="text-sm font-subheading text-neutral-800">
          {fmtShortHourRange(
            task.pickup_date,
            task.slot_start_time,
            task.slot_end_time,
            { showAmPm: true },
          )}
        </Text>
      </View>

      <View className="px-4 py-3.5 flex-row items-center justify-between gap-3">
        <View className="flex-1 min-w-0">
          <Text
            className="text-base font-subheading text-neutral-900"
            numberOfLines={2}
          >
            {task.pickup_location}
          </Text>
        </View>

        <AnimatedPressable
          onPress={onViewDetails}
          className="flex-row items-center bg-primary-400 px-5 py-2.5 rounded-xl min-h-[44px]"
          accessibilityRole="button"
          accessibilityLabel={`View pickup details for ${task.pickup_location}`}
        >
          <Text className="text-white font-subheading text-sm">
            Pick-up details
          </Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.white}
            className="ml-2"
          />
        </AnimatedPressable>
      </View>
    </View>
  );
}
