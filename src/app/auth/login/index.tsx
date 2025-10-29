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
import { driverAPI, DriverLoginData } from '../../../../api/config';
import Button from '../../../components/Button/Button';
import { authStyles } from '../../../styles/authStyles';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      console.log('Logging in with:', { email, password });

      const loginData: DriverLoginData = {
        email,
        password,
      };

      const driver = await driverAPI.login(loginData);
      console.log('Login successful:', driver);
      Alert.alert('Success', `Welcome back, ${driver.first_name}!`, [
        { text: 'OK', onPress: () => router.push('/') },
      ]);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        error instanceof Error
          ? error.message
          : 'Invalid email or password. Please try again.',
      );
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.content}>
        <Text style={authStyles.logo}>Logo</Text>
        <Text style={authStyles.title}>Welcome</Text>
        <Text style={authStyles.subtitle}>Please input your details</Text>
        <TextInput
          style={authStyles.input}
          placeholder="youremailaddress@address.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={authStyles.passwordContainer}>
          <TextInput
            style={authStyles.passwordInput}
            placeholder="Enter password"
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
        <View style={authStyles.buttonContainer}>
          <Button
            text="Log in"
            disabled={!email || !password}
            onPress={handleLogin}
          />
        </View>
        <Text style={authStyles.linkText}>
          Need an account?{' '}
          <Text
            style={authStyles.link}
            onPress={() => router.push('/auth/signup')}
          >
            Sign up
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
