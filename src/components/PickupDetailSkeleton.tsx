import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Skeleton from '@/components/Skeleton';

export default function PickupDetailSkeleton() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <View className="px-5 pt-6 pb-10">
        {/* Location Section */}
        <View className="flex-row items-start mb-6 pb-6 border-b border-neutral-200">
          <Skeleton height={24} width={24} circle className="mt-1 mr-4" />
          <View className="flex-1">
            <Skeleton height={24} width="80%" className="mb-3" />
            <Skeleton height={14} width="100%" className="mb-1.5" />
            <Skeleton height={14} width="60%" className="mb-4" />
            <Skeleton height={44} width={130} borderRadius={12} />
          </View>
        </View>

        {/* Pickup Window */}
        <View className="mb-6 pb-6 border-b border-neutral-200">
          <View className="flex-row items-center">
            <Skeleton height={20} width={20} circle className="mr-5" />
            <View className="flex-1">
              <Skeleton height={14} width="30%" className="mb-2" />
              <Skeleton height={14} width="55%" />
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View className="mb-6 pb-6 border-b border-neutral-200">
          <Skeleton height={18} width="40%" className="mb-5" />
          <View className="flex-row items-center">
            <Skeleton height={20} width={20} circle className="mr-4" />
            <Skeleton height={16} width="45%" className="flex-1" />
            <View className="flex-row gap-3">
              <Skeleton height={44} width={44} borderRadius={8} />
              <Skeleton height={44} width={44} borderRadius={8} />
            </View>
          </View>
        </View>

        {/* Notes Section */}
        <View className="mb-6 pb-6 border-b border-neutral-200">
          <Skeleton height={18} width="35%" className="mb-4" />
          <Skeleton height={14} width="90%" className="mb-1.5" />
          <Skeleton height={14} width="70%" />
        </View>

        {/* Bottom Button */}
        <Skeleton height={56} borderRadius={12} className="mt-4" />
      </View>
    </SafeAreaView>
  );
}
