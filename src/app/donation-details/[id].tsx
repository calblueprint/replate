import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getPartners, submitCompletionDetails } from 'api/config';
import dateIcon from 'assets/date.png';
import AnimatedPressable from '@/components/AnimatedPressable';
import PhotoUpload from '@/components/PhotoUpload/PhotoUpload';
import RequiredInput from '@/components/RequiredInput/RequiredInput';
import colors from '@/styles/colors';

export default function DonationDetailsPage() {
  const params = useLocalSearchParams<{ id?: string; location?: string }>();
  const router = useRouter();
  const location = params.location || 'Unknown';
  const [weight, setWeight] = useState('');
  const [selectedNPO, setSelectedNPO] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [npoOptions, setNpoOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const isFormValid = weight.trim().length > 0 && selectedNPO.trim().length > 0;

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const partnersList = await getPartners();
        const safe: [number, string][] = Array.isArray(partnersList)
          ? (partnersList as unknown[]).filter(
              (x): x is [number, string] =>
                Array.isArray(x) &&
                typeof x[0] === 'number' &&
                typeof x[1] === 'string',
            )
          : [];
        setNpoOptions(
          safe.map(([id, name]) => ({ label: name, value: String(id) })),
        );
      } catch {
        Toast.show({
          type: 'error',
          text1: 'Could not load recipients.',
        });
      }
    };
    fetchPartners();
  }, []);

  const handleComplete = async () => {
    if (!params.id) return;
    setLoading(true);
    try {
      await submitCompletionDetails(params.id, {
        total_pounds_entered: weight,
        description: notes || undefined,
      });
      Toast.show({ type: 'success', text1: 'Donation recorded!' });
      router.replace('/(tabs)/my-tasks');
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Could not save. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMissed = () => {
    Toast.show({
      type: 'info',
      text1: 'Missed',
      text2: `Marked ${location} as missed.`,
    });
  };

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerClassName="px-5 pb-[120px]"
          showsVerticalScrollIndicator={false}
        >
          <View>
            <Text className="text-2xl text-neutral-800 mb-6 font-heading mt-6">
              Enter Details
            </Text>

            {/* Due Date */}
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <Image
                  source={dateIcon}
                  className="h-5 w-5 mr-1"
                  resizeMode="contain"
                />
                <Text className="text-sm text-neutral-500 font-body text-center">
                  Today, 10:00 AM
                </Text>
              </View>
              <AnimatedPressable
                className="bg-primary-400 rounded-xl py-3 px-5 items-center justify-center self-start mb-6 min-h-[44px]"
                accessibilityRole="button"
                accessibilityLabel="View pick-up details"
              >
                <Text className="text-white font-subheading text-sm text-center">
                  View pick-up details
                </Text>
              </AnimatedPressable>
            </View>

            {/* Weight */}
            <RequiredInput
              label="Weight (lbs)"
              placeholder="Enter weight"
              value={weight}
              onChangeText={text => setWeight(text.replace(/[^0-9.]/g, ''))}
              required
            />

            {/* Recipient */}
            <RequiredInput
              label="Recipient"
              placeholder="Select NPO Recipient"
              value={selectedNPO}
              onChangeText={setSelectedNPO}
              required
              isPicker
              options={npoOptions}
            />

            {/* Image upload */}
            <Text className="text-xs font-label text-neutral-600 text-left pb-3">
              Add Pick-up Image
            </Text>
            <View className="border border-neutral-200 rounded-2xl justify-center pb-4 shadow-sm">
              <PhotoUpload onSelect={() => {}} />

              {/* Notes */}
              <Text className="font-body text-xs text-neutral-500 px-4 pt-6">
                Notes
              </Text>
              <TextInput
                className="mx-4 min-h-[50px] font-body text-sm bg-neutral-50 rounded-lg p-3 border border-neutral-200"
                multiline
                numberOfLines={4}
                placeholder="Optional notes"
                placeholderTextColor={colors.neutral[400]}
                accessibilityLabel="Optional notes"
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer Buttons */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-row gap-3 px-5 pt-4 bg-white shadow-header"
        style={{ paddingBottom: Math.max(insets.bottom, 20) + 10 }}
      >
        <AnimatedPressable
          className="flex-1 border-[1.5px] border-error rounded-xl items-center py-3 min-h-[48px] justify-center"
          onPress={handleMissed}
          accessibilityRole="button"
          accessibilityLabel="Mark as missed"
        >
          <Text className="text-error text-sm font-subheading">Missed</Text>
        </AnimatedPressable>
        <AnimatedPressable
          className={`flex-1 rounded-xl items-center py-3 min-h-[48px] justify-center ${
            isFormValid && !loading ? 'bg-primary-400' : 'bg-neutral-300'
          }`}
          onPress={handleComplete}
          disabled={!isFormValid || loading}
          accessibilityRole="button"
          accessibilityLabel="Complete donation"
        >
          <Text
            className={`text-sm font-subheading ${
              isFormValid && !loading ? 'text-white' : 'text-neutral-500'
            }`}
          >
            Complete
          </Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}
