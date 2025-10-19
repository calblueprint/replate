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
import { useNavigation } from '@react-navigation/native';
import { driverAPI, DriverSignupData } from '../../../../api/config';
import Button from '../../../components/Button/Button';

export default function SignupPage() {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

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
        onfleet_worker_id: '', // TODO: Add OnFleet ID to form or set after signup
        deputy_employee_id: 0, // TODO: Add Deputy employee ID to form or set after signup
      };

      const driver = await driverAPI.signup(signupData);
      console.log('Driver created successfully:', driver);
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login' as never) },
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

  const handleSignIn = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>Logo</Text>
        <Text style={styles.title}>Let's get started</Text>
        <Text style={styles.subtitle}>Please input your details</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputHalf}
            placeholder="First name"
            value={first_name}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.inputHalf}
            placeholder="Last name"
            value={last_name}
            onChangeText={setLastName}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Your phone number"
          value={phone_number}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.showButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.showButtonText}>
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
        <Text style={styles.linkText}>
          Have an account?{' '}
          <Text style={styles.link} onPress={handleSignIn}>
            Sign in
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  showButton: {
    padding: 12,
  },
  showButtonText: {
    fontWeight: '500',
  },
  inputHalf: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    flex: 1,
    marginLeft: 3,
    marginRight: 3,
  },
  linkText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});
