import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AnimatedEntry from '@/components/AnimatedEntry';
import AnimatedPressable from '@/components/AnimatedPressable';
import ReplateLogo from '@/components/ReplateLogo';
import colors from '@/styles/colors';

export default function LandingPage() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <View
        className="absolute top-0 left-0 right-0 bg-primary-50 opacity-60"
        style={{ height: '45%' }}
      />

      <View
        className="flex-1 px-6 justify-between w-full"
        style={{
          paddingTop: Math.max(insets.top + 40, 60),
          paddingBottom: Math.max(insets.bottom + 20, 40),
        }}
      >
        {/* Logo + Brand */}
        <View className="items-center pt-10">
          <AnimatedEntry from={{ opacity: 0, scale: 0.8 }} duration={500}>
            <ReplateLogo size={140} />
          </AnimatedEntry>

          <AnimatedEntry delay={150}>
            <Text className="text-4xl font-heading text-neutral-800 text-center mt-5">
              replate
            </Text>
          </AnimatedEntry>
        </View>

        {/* Value Prop */}
        <AnimatedEntry delay={300} duration={450}>
          <View className="items-center px-3">
            <Text className="text-2xl font-heading text-center text-neutral-800 leading-8 mb-4">
              Rescue food.{'\n'}Feed communities.
            </Text>
            <View className="w-10 h-[3px] bg-primary-400 rounded-sm mb-4" />
            <Text className="text-base font-body text-center text-neutral-500 leading-6">
              Join the movement to reduce food waste and help those in need
              across the Bay Area.
            </Text>
          </View>
        </AnimatedEntry>

        {/* Buttons */}
        <AnimatedEntry delay={500} duration={450} className="w-full">
          <View className="w-full items-center gap-3 pb-5">
            <AnimatedPressable
              className="w-full bg-primary-400 rounded-xl py-4 items-center justify-center min-h-[56px]"
              style={{
                shadowColor: colors.primary[400],
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 12,
                elevation: 5,
              }}
              onPress={() => router.replace('/auth/signup')}
              scaleValue={0.97}
              accessibilityRole="button"
              accessibilityLabel="Get started with Replate"
            >
              <Text className="text-base font-subheading text-white">
                Get Started
              </Text>
            </AnimatedPressable>

            <AnimatedPressable
              className="w-full border-[1.5px] border-primary-400 rounded-xl py-4 items-center justify-center min-h-[56px]"
              onPress={() => router.replace('/auth/login')}
              scaleValue={0.97}
              accessibilityRole="button"
              accessibilityLabel="Log in to Replate"
            >
              <Text className="text-base font-subheading text-primary-600">
                Log In
              </Text>
            </AnimatedPressable>
          </View>
        </AnimatedEntry>
      </View>
    </View>
  );
}
