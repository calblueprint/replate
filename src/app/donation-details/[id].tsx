import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  getPartners,
  getTask,
  submitCompletionDetails,
  submitTaskMissed,
} from 'api/config';
import dateIcon from 'assets/date.png';
import RequiredInput from '@/components/RequiredInput/RequiredInput';
import { formatPickupDate, formatTimeRangeAny } from '@/utils/dateHelpers';
import PhotoUpload from '../../components/PhotoUpload/PhotoUpload';
import { styles } from '../../styles/pages/donation-details-styles';

interface NpoOption {
  label: string;
  value: string;
}

interface TaskPickupInfo {
  pickup_date: string | null;
  start_time: string | null;
  end_time: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseOptionalString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

export default function DonationLayout() {
  const params = useLocalSearchParams<{ id?: string; location?: string }>();
  const [weight, setWeight] = useState('');
  const [selectedNPO, setSelectedNPO] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [npoOptions, setNpoOptions] = useState<NpoOption[]>([]);
  const [task, setTask] = useState<TaskPickupInfo | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isFormValid = weight.trim().length > 0 && selectedNPO.trim().length > 0;

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setIsFetching(true);

      const partnersPromise = (async () => {
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
          if (!cancelled) {
            setNpoOptions(
              safe.map(([id, name]) => ({ label: name, value: String(id) })),
            );
          }
        } catch {
          if (!cancelled) {
            Toast.show({
              type: 'error',
              text1: 'Could not load recipients.',
            });
          }
        }
      })();

      const taskPromise = (async () => {
        if (!params.id) return;
        try {
          const data = await getTask(params.id);
          if (cancelled || !isRecord(data)) return;
          setTask({
            pickup_date:
              parseOptionalString(data.pickup_date) ??
              parseOptionalString(data.scheduled_date),
            start_time:
              parseOptionalString(data.start_time) ??
              parseOptionalString(data.activity_start_time),
            end_time:
              parseOptionalString(data.end_time) ??
              parseOptionalString(data.activity_end_time),
          });
        } catch {
          if (!cancelled) {
            Toast.show({
              type: 'error',
              text1: 'Could not load pickup details.',
            });
          }
        }
      })();

      await Promise.all([partnersPromise, taskPromise]);
      if (!cancelled) setIsFetching(false);
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const pickupTimeLabel = (() => {
    if (!task) return isFetching ? 'Loading…' : 'Time TBD';
    const datePart = task.pickup_date
      ? formatPickupDate(task.pickup_date)
      : null;
    const timePart = formatTimeRangeAny(task.start_time, task.end_time);
    if (datePart && timePart !== 'Time TBD') return `${datePart}, ${timePart}`;
    return datePart ?? timePart;
  })();

  const handleComplete = async () => {
    if (!params.id || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await submitCompletionDetails(params.id, {
        total_pounds_entered: weight,
        description: notes || undefined,
        photoUri,
      });
      Toast.show({ type: 'success', text1: 'Donation recorded!' });
      router.replace('/(tabs)/my-tasks');
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Could not save. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMissed = async () => {
    if (!params.id || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await submitTaskMissed(params.id);
      Toast.show({
        type: 'info',
        text1: 'Marked as missed',
        text2: `${params.location || 'Task'} marked as missed.`,
      });
      router.replace('/(tabs)/my-tasks');
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Could not mark as missed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)/my-tasks');
            }
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#525454" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Enter Donation Data</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <Text style={styles.sectionTitle}>Enter Details</Text>

            {/* Due Date */}
            <View style={styles.dueDateContainer}>
              <View style={styles.dueDateRow}>
                <Image
                  source={dateIcon}
                  style={styles.icon}
                  resizeMode="contain"
                />
                <Text style={styles.dueDateText}>{pickupTimeLabel}</Text>
              </View>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View pick-up details</Text>
              </TouchableOpacity>
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
            <Text style={styles.imageText}>Add Pick-up Image</Text>
            <View style={styles.section}>
              <PhotoUpload onSelect={setPhotoUri} />

              {/* Notes */}
              <Text style={styles.notesLabel}>Notes</Text>
              <TextInput
                style={styles.notesInput}
                multiline
                numberOfLines={4}
                placeholder="Optional notes"
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* FOOTER BUTTONS */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.missedButton,
            isSubmitting && styles.missedButtonDisabled,
          ]}
          onPress={handleMissed}
          disabled={isSubmitting}
        >
          <Text
            style={isSubmitting ? styles.missedTextDisabled : styles.missedText}
          >
            Missed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.completeButton,
            (!isFormValid || isSubmitting) && styles.completeButtonDisabled,
          ]}
          onPress={handleComplete}
          disabled={!isFormValid || isSubmitting}
        >
          <Text style={[styles.completeText]}>Complete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
