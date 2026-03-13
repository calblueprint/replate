import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AnimatedEntry from '@/components/AnimatedEntry';
import AnimatedPressable from '@/components/AnimatedPressable';
import ReplateLogo from '@/components/ReplateLogo';
import colors from '@/styles/colors';
import { useAuth } from '@/utils/AuthContext';
import { useProfile } from '@/utils/ProfileContext';
import { ApiError } from '~/api/apiUtils';
import { getPartners, updateDriverPartner } from '~/api/config';

export default function OnboardingFlow() {
  type PartnerTuple = [number, string];
  type PickerItem = { label: string; value: number };

  const { driver } = useAuth();
  const { refreshProfile } = useProfile();
  const [partners, setPartners] = useState<PartnerTuple[]>([]);
  const [selectedNPOId, setSelectedNPOId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PickerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const disabled = selectedNPOId == null || isUpdating;

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const partnersList = await getPartners();

        const safePartners: PartnerTuple[] = Array.isArray(partnersList)
          ? (partnersList as unknown[]).filter((x): x is PartnerTuple => {
              return (
                Array.isArray(x) &&
                typeof x[0] === 'number' &&
                typeof x[1] === 'string'
              );
            })
          : [];

        setPartners(safePartners);
      } catch (err) {
        const errorMessage =
          err instanceof ApiError ? err.message : 'Failed to load partners';
        setError(errorMessage);
        setPartners([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setItems(partners.map(([id, name]) => ({ label: name, value: id })));
  }, [partners]);

  const handleUpdatePress = async () => {
    if (!driver || selectedNPOId == null) return;

    try {
      setIsUpdating(true);
      const updated = await updateDriverPartner(driver.id, selectedNPOId);
      if (!updated) return;
      await refreshProfile(driver.id);
      router.replace('/(tabs)/my-tasks');
    } catch {
      setError('Failed to update partner. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 p-5 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary[400]} />
          <Text className="mt-3 text-neutral-500 font-body">
            Loading partners...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-5 justify-between">
        <View>
          <AnimatedEntry from={{ opacity: 0, scale: 0.9 }} duration={450}>
            <View className="w-full items-center justify-center mt-2 mb-2.5">
              <ReplateLogo size={96} />
            </View>
          </AnimatedEntry>

          <AnimatedEntry delay={100}>
            <Text className="text-2xl text-neutral-800 mt-6 mb-8 font-heading">
              Which NPO are you partnered with?
            </Text>
          </AnimatedEntry>

          {error && (
            <View
              className="bg-error-light p-3 mb-4 rounded-lg"
              accessibilityLiveRegion="polite"
            >
              <Text className="text-error-dark text-center font-body">
                {error}
              </Text>
            </View>
          )}

          <AnimatedEntry delay={200}>
            <DropDownPicker
              open={open}
              value={selectedNPOId}
              items={items}
              setOpen={setOpen}
              setValue={cb => setSelectedNPOId(cb(selectedNPOId))}
              setItems={setItems}
              placeholder="Select an NPO"
              style={{
                width: '100%',
                height: 60,
                borderColor: open ? colors.primary[600] : colors.neutral[300],
                borderWidth: 1,
                borderRadius: 8,
              }}
              placeholderStyle={{ color: colors.neutral[400] }}
              dropDownContainerStyle={{
                borderColor: colors.neutral[300],
                borderWidth: 1,
                marginTop: 28,
                paddingVertical: 5,
                paddingHorizontal: 5,
                borderRadius: 8,
              }}
              listItemContainerStyle={{
                height: 50,
                justifyContent: 'center',
              }}
              selectedItemContainerStyle={{
                backgroundColor: colors.primary[200],
                borderRadius: 8,
              }}
              showTickIcon={false}
              textStyle={{ fontSize: 15, fontFamily: 'Lato-Regular' }}
              zIndex={1000}
            />
          </AnimatedEntry>
        </View>

        <AnimatedEntry delay={300}>
          <AnimatedPressable
            className={`mb-8 py-4 rounded-xl items-center justify-center min-h-[48px] ${
              disabled ? 'bg-neutral-300' : 'bg-primary-400'
            }`}
            disabled={disabled}
            onPress={() => void handleUpdatePress()}
            accessibilityRole="button"
            accessibilityLabel={isUpdating ? 'Saving' : 'Finish onboarding'}
          >
            {isUpdating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-base font-subheading">
                Finish
              </Text>
            )}
          </AnimatedPressable>
        </AnimatedEntry>
      </View>
    </SafeAreaView>
  );
}
