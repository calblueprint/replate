import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import elementIcon from 'assets/elements.png';
import AnimatedEntry from '@/components/AnimatedEntry';
import PageHeader from '@/components/PageHeader';
import { useAuth } from '@/utils/AuthContext';

export default function ActivityPage() {
  const { driver } = useAuth();

  return (
    <ScrollView
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
    >
      <PageHeader
        title="Activity"
        subtitle="Your completed pickups"
        driverName={driver?.first_name}
      />

      <View className="flex-1 items-center justify-center px-8 py-16">
        <AnimatedEntry from={{ opacity: 0, scale: 0.8 }} duration={500}>
          <Image
            source={elementIcon}
            className="w-36 h-36 mb-6 self-center"
            resizeMode="contain"
            accessibilityLabel="No activity illustration"
          />
        </AnimatedEntry>
        <AnimatedEntry delay={100}>
          <Text className="text-base font-subheading text-neutral-500 text-center mb-2">
            No completed pickups yet
          </Text>
        </AnimatedEntry>
        <AnimatedEntry delay={200}>
          <Text className="text-sm font-body text-neutral-500 text-center">
            Your pickup history and impact stats will show up here once you
            complete your first delivery.
          </Text>
        </AnimatedEntry>
      </View>
    </ScrollView>
  );
}
