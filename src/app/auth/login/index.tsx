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
import { DriverLoginData } from '../../../../api/config';
import Button from '../../../components/Button/Button';
import { authStyles } from '../../../styles/authStyles';
import { useAuth } from '../../../utils/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      const loginData: DriverLoginData = {
        email,
        password,
      };

      await login(loginData, staySignedIn);
      Alert.alert('Success', 'Welcome back!', [{ text: 'OK' }]);
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error instanceof Error
          ? error.message
          : 'Invalid email or password. Please try again.',
      );
    } finally {
      setIsLoading(false);
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
          placeholder="Email@gmail.com"
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

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => setStaySignedIn(!staySignedIn)}
            style={{
              width: 20,
              height: 20,
              borderWidth: 2,
              borderColor: '#333',
              backgroundColor: staySignedIn ? '#333' : 'transparent',
              marginRight: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {staySignedIn && (
              <Text style={{ color: 'white', fontSize: 12 }}>✓</Text>
            )}
          </TouchableOpacity>
          <Text style={authStyles.linkText}>Stay signed in</Text>
        </View>

        <View style={authStyles.buttonContainer}>
          <Button
            text={isLoading ? 'Logging in...' : 'Log in'}
            disabled={!email || !password || isLoading}
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
