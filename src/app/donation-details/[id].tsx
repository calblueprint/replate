import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Stack, useLocalSearchParams } from 'expo-router';
import RequiredInput from '@/components/RequiredInput/RequiredInput';
import PhotoUpload from '../../components/PhotoUpload';
import { styles } from './styles';

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
          headerTitle: 'Enter Donation Data',
          headerTitleAlign: 'center',
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: 'black',
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pickupTitle}>{location} Pickup</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enter Details</Text>

          {/* Due Date */}
          <View style={styles.dueDateContainer}>
            <Text style={styles.dueDateLabel}>Due Date</Text>
            <Text style={styles.dueDateText}>Today, 10:00 AM</Text>
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

          {/* Image upload placeholder */}
          <View style={styles.imageBox}>
            <Text style={styles.imagePlaceholder}>Add Pick-up Image</Text>
            <PhotoUpload onSelect={uri => console.log('Selected:', uri)} />
          </View>

          {/* Notes */}
          <Text style={styles.notesLabel}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={4}
            placeholder="Optional notes"
          />
        </View>
      </ScrollView>

      {/* FOOTER BUTTONS */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.missedButton} onPress={handleMissed}>
          <Text style={styles.missedText}>Missed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
        >
          <Text style={styles.completeText}>Complete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
