import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { driverAPI, DriverSignupData } from '../../../../api/config';
import Button from '../../../components/Button/Button';
import { authStyles } from '../../../styles/authStyles';

export default function SignupPage() {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    try {
      console.log('Creating driver account...');

      const signupData: DriverSignupData = {
        email,
        password,
        password_confirmation: password,
        first_name,
        last_name,
        phone: phone_number,
        // You'll need to add these fields to your form or provide defaults
        zone_id: 1, // TODO: Add zone selection to form
        home_lat: 0, // TODO: Add location picker to form
        home_lon: 0, // TODO: Add location picker to form
      };

      const driver = await driverAPI.signup(signupData);
      console.log('Driver created successfully:', driver);
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.push('/auth/login') },
      ]);
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert(
        'Signup Failed',
        error instanceof Error
          ? error.message
          : 'Failed to create account. Please try again.',
      );
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.content}>
        <Text style={authStyles.logo}>Logo</Text>
        <Text style={authStyles.title}>Let's get started</Text>
        <Text style={authStyles.subtitle}>Please input your details</Text>
        <View style={authStyles.inputContainer}>
          <TextInput
            style={authStyles.inputHalf}
            placeholder="First name"
            value={first_name}
            onChangeText={setFirstName}
          />
          <TextInput
            style={authStyles.inputHalf}
            placeholder="Last name"
            value={last_name}
            onChangeText={setLastName}
          />
        </View>
        <TextInput
          style={authStyles.input}
          placeholder="Your phone number"
          value={phone_number}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <TextInput
          style={authStyles.input}
          placeholder="Your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={authStyles.passwordContainer}>
          <TextInput
            style={authStyles.passwordInput}
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={authStyles.showButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={authStyles.showButtonText}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          text="Continue"
          disabled={
            !email || !password || !first_name || !last_name || !phone_number
          }
          onPress={handleSignUp}
        />
        <Text style={authStyles.linkText}>
          Have an account?{' '}
          <Text
            style={authStyles.link}
            onPress={() => router.push('/auth/login')}
          >
            Sign in
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
