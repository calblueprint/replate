import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from '@/components/AnimatedPressable';
import Skeleton from '@/components/Skeleton';
import colors from '@/styles/colors';
import { formatTimeRange } from '@/utils/dateHelpers';
import { formatAddress } from '@/utils/formatAddress';

type Task = {
  id: number;
  encrypted_id: string;
  pickup_date: string;
  start_time: string | null;
  end_time: string | null;
  location_name: string | null;
  address?: {
    number?: string | null;
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
  } | null;
};

interface TaskCardProps {
  task: Task;
  onViewDetails: () => void;
}

export function TaskCardSkeleton() {
  return (
    <View className="bg-white rounded-2xl flex-row mb-4 shadow-sm">
      <View className="w-1.5 bg-neutral-200 rounded-l-2xl" />
      <View className="flex-1 px-5 py-4">
        <Skeleton height={20} width="75%" className="mb-2" />
        <Skeleton height={16} width="100%" className="mb-1.5" />
        <Skeleton height={12} width="33%" />
      </View>
    </View>
  );
}

export default function TaskCard({ task, onViewDetails }: TaskCardProps) {
  return (
    <AnimatedPressable
      className="bg-white rounded-2xl flex-row mb-4 shadow-sm"
      onPress={onViewDetails}
      scaleValue={0.98}
      accessibilityRole="button"
      accessibilityLabel={`View pickup details for ${task.location_name || 'pickup'}`}
    >
      <View className="w-1.5 bg-primary-400 rounded-l-2xl" />
      <View className="flex-1 px-5 py-4">
        <Text
          className="text-lg text-neutral-900 mb-1.5 font-subheading"
          numberOfLines={2}
        >
          Pickup from {task.location_name || 'Unknown Location'}
        </Text>
        <Text
          className="text-neutral-500 text-sm mb-1 font-body"
          numberOfLines={2}
        >
          {formatAddress(task.address, task.location_name)}
        </Text>
        <Text className="text-neutral-600 text-xs font-body">
          {formatTimeRange(task.start_time, task.end_time)}
        </Text>
      </View>
      <View className="justify-center pr-4">
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.neutral[400]}
        />
      </View>
    </AnimatedPressable>
  );
}
