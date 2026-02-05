import React, { useState } from 'react';
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
import dateIcon from 'assets/date.png';
import RequiredInput from '@/components/RequiredInput/RequiredInput';
import PhotoUpload from '../../components/PhotoUpload/PhotoUpload';
import { styles } from '../../styles/pages/donation-details-styles';

const MOCK_NPOS = [
  { label: 'Rescuing Leftover Cuisine (RLC)', value: 'RLC' },
  { label: 'Denver Food Rescue (DFR)', value: 'DFR' },
  { label: 'Hollywood Food Coalition (HFC)', value: 'HFC' },
];

export default function DonationLayout() {
  const params = useLocalSearchParams<{ id?: string; location?: string }>();
  const location = params.location || 'Unknown';
  const [weight, setWeight] = useState('');
  const [selectedNPO, setSelectedNPO] = useState('');
  const isFormValid = weight.trim().length > 0 && selectedNPO.trim().length > 0;

  const handleComplete = () => {
    Toast.show({
      type: 'success',
      text1: 'Complete',
      text2: `Donation recorded for ${location}.`,
    });
  };

  const handleMissed = () => {
    Toast.show({
      type: 'info',
      text1: 'Missed',
      text2: `Marked ${location} as missed.`,
    });
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
                <Text style={styles.dueDateText}>Today, 10:00 AM</Text>
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
              options={MOCK_NPOS}
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
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* FOOTER BUTTONS */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.missedButton} onPress={handleMissed}>
          <Text style={styles.missedText}>Missed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.completeButton,
            !isFormValid && styles.completeButtonDisabled,
          ]}
          onPress={handleComplete}
          disabled={!isFormValid}
        >
          <Text style={[styles.completeText]}>Complete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
