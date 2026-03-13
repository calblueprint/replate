import React from 'react';
import { Text, View } from 'react-native';
import Skeleton from '@/components/Skeleton';

interface ProfileFieldProps {
  label: string;
  value: string;
  borderColor?: string;
}

export function ProfileFieldSkeleton() {
  return (
    <View className="mb-6">
      <Skeleton height={12} width={64} className="mb-2" />
      <Skeleton height={48} borderRadius={8} />
    </View>
  );
}

export default function ProfileField({
  label,
  value,
  borderColor = 'border-neutral-200',
}: ProfileFieldProps) {
  return (
    <View className="mb-6">
      <Text className="text-xs font-label text-neutral-600 uppercase tracking-wider mb-2">
        {label}
      </Text>
      <View className={`border ${borderColor} rounded-lg p-3`}>
        <Text className="text-sm font-body text-neutral-700">
          {value || '\u2014'}
        </Text>
      </View>
    </View>
  );
}
