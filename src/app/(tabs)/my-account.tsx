import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AnimatedEntry from '@/components/AnimatedEntry';
import AnimatedPressable from '@/components/AnimatedPressable';
import ProfileField, { ProfileFieldSkeleton } from '@/components/ProfileField';
import { useAuth } from '@/utils/AuthContext';
import { useProfile } from '@/utils/ProfileContext';
import { getPartners } from '~/api/config';

export default function MyAccountPage() {
  const { driver, logout } = useAuth();
  const { profile } = useProfile();
  const [partners, setPartners] = useState<[number, string][]>([]);
  const [partnersLoading, setPartnersLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getPartners();
        if (cancelled) return;
        const safe: [number, string][] = Array.isArray(list)
          ? (list as unknown[]).filter(
              (x): x is [number, string] =>
                Array.isArray(x) &&
                typeof x[0] === 'number' &&
                typeof x[1] === 'string',
            )
          : [];
        setPartners(safe);
      } catch {
        // Silently fail - partner name will show as "—"
      } finally {
        if (!cancelled) setPartnersLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const partnerName =
    partners.find(([id]) => id === profile?.partner_id)?.[1] ?? '\u2014';

  const handleLogout = async () => {
    await logout();
    router.replace('/landing');
  };

  const getInitials = () => {
    if (driver?.first_name && driver?.last_name) {
      return `${driver.first_name[0]}${driver.last_name[0]}`.toUpperCase();
    }
    if (driver?.first_name) {
      return driver.first_name[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="p-5 pb-[100px]"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <AnimatedEntry from={{ opacity: 0, scale: 0.85 }} duration={450}>
          <View className="items-center mt-5 mb-4">
            <View
              className="w-[72px] h-[72px] rounded-full bg-primary-200 border-2 border-primary-500 justify-center items-center"
              accessibilityLabel={`Profile avatar for ${driver?.first_name || 'user'}`}
            >
              <Text className="text-2xl font-subheading text-primary-700">
                {getInitials()}
              </Text>
            </View>
          </View>
        </AnimatedEntry>

        {/* Name Display */}
        <AnimatedEntry delay={80}>
          <Text className="text-xl font-subheading text-center text-neutral-800 mb-8">
            {driver?.first_name} {driver?.last_name}
          </Text>
        </AnimatedEntry>

        {/* Name Field */}
        <AnimatedEntry delay={160}>
          <ProfileField
            label="Name"
            value={`${driver?.first_name || ''} ${driver?.last_name || ''}`.trim()}
          />
        </AnimatedEntry>

        <AnimatedEntry delay={240}>
          <ProfileField label="Email" value={driver?.email || ''} />
        </AnimatedEntry>

        <AnimatedEntry delay={320}>
          <ProfileField label="Phone" value={driver?.phone || ''} />
        </AnimatedEntry>

        <AnimatedEntry delay={400}>
          {partnersLoading ? (
            <ProfileFieldSkeleton />
          ) : (
            <ProfileField label="NPO" value={partnerName} />
          )}
        </AnimatedEntry>

        {/* Logout Button */}
        <AnimatedEntry delay={480}>
          <AnimatedPressable
            onPress={handleLogout}
            className="border border-neutral-300 py-3.5 rounded-xl items-center w-full min-h-[48px] justify-center mt-4"
            accessibilityRole="button"
            accessibilityLabel="Log out"
          >
            <Text className="text-neutral-600 text-base font-subheading">
              Log Out
            </Text>
          </AnimatedPressable>
        </AnimatedEntry>
      </ScrollView>
    </SafeAreaView>
  );
}
