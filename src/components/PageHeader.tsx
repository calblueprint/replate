import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AnimatedEntry from '@/components/AnimatedEntry';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  driverName?: string;
}

export default function PageHeader({
  title,
  subtitle,
  driverName,
}: PageHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const initial = (driverName || '?')[0].toUpperCase();

  return (
    <View
      className="bg-white px-5 pb-5 border-b border-neutral-200 shadow-header"
      style={{ paddingTop: insets.top + 12 }}
    >
      <AnimatedEntry delay={0} duration={350}>
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-neutral-600 font-body">{today}</Text>
          <Pressable
            onPress={() => router.push('/(tabs)/my-account')}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            accessibilityLabel={`Go to profile for ${driverName || 'user'}`}
            accessibilityRole="button"
          >
            <View className="w-11 h-11 rounded-full bg-primary-200 border-2 border-primary-500 items-center justify-center">
              <Text className="text-lg text-primary-700 font-subheading">
                {initial}
              </Text>
            </View>
          </Pressable>
        </View>
      </AnimatedEntry>
      <AnimatedEntry delay={100} duration={400}>
        <Text className="text-primary-700 text-left font-heading text-2xl">
          {title}
        </Text>
      </AnimatedEntry>
      <AnimatedEntry delay={200} duration={400}>
        <Text className="text-left text-primary-600 text-sm mt-1 font-body">
          {subtitle}
        </Text>
      </AnimatedEntry>
    </View>
  );
}
