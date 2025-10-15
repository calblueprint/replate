import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const MOCK_NPOS = [
  { id: 1, name: 'NPO 1' },
  { id: 2, name: 'NPO 2' },
  { id: 3, name: 'NPO 3' },
];

export default function DonationLayout() {
  const params = useLocalSearchParams<{ id?: string; location?: string }>();
  const location = params.location || 'Unknown';
  const [selectedNPO, setSelectedNPO] = useState('');
  const [weight, setWeight] = useState('');

  const handleComplete = () => {
    Alert.alert('Complete', `Donation recorded for ${location}.`);
  };

  const handleMissed = () => {
    Alert.alert('Missed', `Marked ${location} as missed.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'Donation Details',
          headerTitleAlign: 'center',
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: 'black',
        }}
      />

      <View style={styles.content}>
        <Text style={styles.header}>{location} Pick-up</Text>

        <Text style={styles.label}>
          Enter Weight(lbs) & Description{' '}
          <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 10.3 lbs"
          value={weight}
          onChangeText={setWeight}
        />

        <Text style={styles.label}>Recipient</Text>
        <View>
          <Picker
            selectedValue={selectedNPO}
            onValueChange={value => setSelectedNPO(value)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Select NPO Recipient" value="" />
            {MOCK_NPOS.map(npo => (
              <Picker.Item key={npo.id} label={npo.name} value={npo.name} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.outlineButton} onPress={handleMissed}>
          <Text style={styles.outlineButtonText}>Mark as Missed</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineButton} onPress={handleComplete}>
          <Text style={styles.outlineButtonText}>Complete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#6E6E6E',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    backgroundColor: 'white',
    marginBottom: 20,
    height: 52,
    justifyContent: 'center',
    //overflow: "hidden",
  },
  picker: {
    width: '100%',
    height: '100%',
    color: 'black',
    fontSize: 16,
  },
  pickerItem: {
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 10,
  },
  outlineButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
  },
});
