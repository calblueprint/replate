import type { TaskResponse } from '~/api/config';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
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
import dateIcon from 'assets/date.png';
import RequiredInput from '@/components/RequiredInput/RequiredInput';
import { ApiError } from '~/api/apiUtils';
import {
  getPartners,
  getTask,
  submitTaskCompletion,
  submitTaskMissed,
} from '~/api/config';
import PhotoUpload from '../../components/PhotoUpload/PhotoUpload';
import { styles } from '../../styles/pages/donation-details-styles';

type TaskDetails = TaskResponse;

type PickerOption = {
  label: string;
  value: string;
};

export default function DonationLayout() {
  const params = useLocalSearchParams<{ id?: string; location?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const location = params.location || 'Unknown';

  const [task, setTask] = useState<TaskDetails | null>(null);
  const [weight, setWeight] = useState('');
  const [selectedNPO, setSelectedNPO] = useState('');
  const [notes, setNotes] = useState('');
  const [npoOptions, setNpoOptions] = useState<PickerOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submittingAction, setSubmittingAction] = useState<
    'complete' | 'missed' | null
  >(null);
  const [taskError, setTaskError] = useState<string | null>(null);
  const [partnerError, setPartnerError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const contentFade = React.useRef(new Animated.Value(0)).current;

  const startEntryAnimation = () => {
    Animated.timing(contentFade, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const isSubmitting = submittingAction !== null;
  const parsedWeight = Number.parseFloat(weight);
  const isFormValid =
    Number.isFinite(parsedWeight) &&
    parsedWeight > 0 &&
    selectedNPO.trim().length > 0 &&
    task !== null &&
    taskError === null;
  const canMarkMissed = !isSubmitting && task !== null && taskError === null;
  const selectedNPOName =
    npoOptions.find(option => option.value === selectedNPO)?.label ?? '';

  const parseTaskDate = (dateValue: string | null) => {
    if (!dateValue) return 'Date TBD';
    try {
      const parsed = new Date(`${dateValue}T00:00:00`);
      if (Number.isNaN(parsed.getTime())) return dateValue;
      return parsed.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateValue;
    }
  };

  const parseTaskTime = (timeValue: string | null) => {
    if (!timeValue) return null;
    const trimmed = timeValue.trim();

    if (trimmed.includes('UTC')) {
      const asDate = new Date(trimmed.replace(' ', 'T').replace(' UTC', 'Z'));
      if (!Number.isNaN(asDate.getTime())) {
        return asDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      }
    }

    const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?/);
    if (match) {
      return `${match[1].padStart(2, '0')}:${match[2]}`;
    }

    const parsed = new Date(
      trimmed.includes(' ') ? trimmed.replace(' ', 'T') : trimmed,
    );
    if (Number.isNaN(parsed.getTime())) return null;

    return parsed.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatTaskTime = (taskData: TaskDetails | null) => {
    if (!taskData) return 'Time TBD';

    const start = parseTaskTime(taskData.start_time);
    const end = parseTaskTime(taskData.end_time);
    if (!start || !end) return 'Time TBD';
    return `${start} - ${end}`;
  };

  const donorNotes = notes.trim() || null;
  const npoLine = `Recipient: ${selectedNPOName || selectedNPO.trim()}`;
  const handleRetry = () => setReloadToken(prev => prev + 1);

  const getErrorMessage = (err: unknown) => {
    if (err instanceof ApiError) return err.message;
    if (err instanceof Error) return err.message;
    return 'Unexpected error';
  };

  const handleComplete = async () => {
    if (!id) {
      Toast.show({
        type: 'error',
        text1: 'Could not complete donation',
        text2: 'Missing donation id.',
      });
      return;
    }

    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Invalid weight',
        text2: 'Please enter a valid number of pounds.',
      });
      return;
    }

    const donationNotes = [donorNotes, npoLine].filter(Boolean).join(' · ');

    try {
      setSubmittingAction('complete');
      await submitTaskCompletion(id, parsedWeight, donationNotes, []);
      Toast.show({
        type: 'success',
        text1: 'Complete',
        text2: `Donation recorded for ${location}.`,
      });
      router.replace('/(tabs)/my-tasks');
    } catch (err) {
      const message = getErrorMessage(err);
      Toast.show({
        type: 'error',
        text1: 'Could not complete donation',
        text2: message,
      });
    } finally {
      setSubmittingAction(null);
    }
  };

  const handleMissed = async () => {
    if (!id) {
      Toast.show({
        type: 'error',
        text1: 'Could not mark missed',
        text2: 'Missing donation id.',
      });
      return;
    }

    try {
      setSubmittingAction('missed');
      await submitTaskMissed(id, donorNotes || `Missed ${location}`, []);
      Toast.show({
        type: 'info',
        text1: 'Missed',
        text2: `Marked ${location} as missed.`,
      });
      router.replace('/(tabs)/my-tasks');
    } catch (err) {
      const message = getErrorMessage(err);
      Toast.show({
        type: 'error',
        text1: 'Could not mark missed',
        text2: message,
      });
    } finally {
      setSubmittingAction(null);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const fetchTask = async () => {
      setIsLoading(true);
      setTaskError(null);
      setPartnerError(null);
      setTask(null);
      setNpoOptions([]);
      contentFade.setValue(0);

      if (!id) {
        setTaskError('Missing donation id.');
        setIsLoading(false);
        return;
      }

      try {
        const [taskResult, partnerResult] = await Promise.allSettled([
          getTask(id),
          getPartners(),
        ]);

        if (isCancelled) return;

        if (taskResult.status === 'fulfilled') {
          setTask(taskResult.value);
          if (taskResult.value.total_pounds_entered != null) {
            setWeight(String(taskResult.value.total_pounds_entered));
          }
          setNotes(taskResult.value.food_rescuer_notes ?? '');
        } else {
          setTaskError(getErrorMessage(taskResult.reason));
          setTask(null);
          setWeight('');
          setNotes('');
        }

        if (partnerResult.status === 'fulfilled') {
          const partnerData = partnerResult.value;
          setNpoOptions(
            partnerData.map(([partnerId, partnerName]) => ({
              label: partnerName,
              value: String(partnerId),
            })),
          );
        } else {
          setPartnerError(getErrorMessage(partnerResult.reason));
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
          startEntryAnimation();
        }
      }
    };

    void fetchTask();

    return () => {
      isCancelled = true;
    };
  }, [id, reloadToken]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.stateContainer,
            {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <ActivityIndicator size="large" color="#58ad85" />
          <Text style={styles.loadingText}>Loading donation details...</Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  if (taskError && !task) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Text style={styles.errorText}>{taskError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.stateContainer,
            { flex: 1, justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <Text style={styles.emptyText}>No donation data available.</Text>
          <TouchableOpacity
            style={styles.retryTextButton}
            onPress={handleRetry}
          >
            <Text style={styles.retryTextButtonText}>Retry</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

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
      <Animated.View style={{ flex: 1, opacity: contentFade }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View>
              {partnerError ? (
                <View style={styles.partnerErrorCard}>
                  <Text style={styles.partnerErrorText}>
                    Could not load recipients: {partnerError}
                  </Text>
                  <TouchableOpacity
                    onPress={handleRetry}
                    style={styles.partnerRetryButton}
                  >
                    <Text style={styles.partnerRetryButtonText}>
                      Retry recipient list
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              <Text style={styles.sectionTitle}>Enter Details</Text>

              {/* Due Date */}
              <View style={styles.dueDateContainer}>
                <View style={styles.dueDateRow}>
                  <Image
                    source={dateIcon}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                  <Text style={styles.dueDateText}>
                    {task?.pickup_date
                      ? `${parseTaskDate(task.pickup_date)} • ${formatTaskTime(task)}`
                      : 'Date TBD'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => {
                    if (!id) return;
                    router.push({
                      pathname: '/pickup-details/[id]',
                      params: {
                        id,
                        location,
                      },
                    });
                  }}
                >
                  <Text style={styles.viewButtonText}>
                    View pick-up details
                  </Text>
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
                <PhotoUpload onSelect={() => {}} />

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
      </Animated.View>

      {/* FOOTER BUTTONS */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.missedButton,
            !canMarkMissed && styles.missedButtonDisabled,
          ]}
          onPress={handleMissed}
          disabled={!canMarkMissed}
        >
          <Text
            style={
              canMarkMissed ? styles.missedText : styles.missedTextDisabled
            }
          >
            {isSubmitting && submittingAction === 'missed'
              ? 'Marking...'
              : 'Missed'}
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
          <Text style={styles.completeText}>
            {isSubmitting && submittingAction === 'complete'
              ? 'Saving...'
              : 'Complete'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
