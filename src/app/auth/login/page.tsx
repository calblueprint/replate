import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { driverAPI, DriverLoginData } from '../../../../api/config';
import Button from '../../../components/Button/Button';

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

  const handleSignUp = () => {
    router.push('/auth/signup/page');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>Logo</Text>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Please input your details</Text>
        <TextInput
          style={styles.input}
          placeholder="youremailaddress@address.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter password"
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
        <View style={styles.buttonContainer}>
          <Button
            text="Log in"
            disabled={!email || !password}
            onPress={handleLogin}
          />
        </View>
        <Text style={styles.linkText}>
          Need an account?{' '}
          <Text style={styles.link} onPress={handleSignUp}>
            Sign up
          </Text>
        </Text>
      </ScrollView>
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
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#666',
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
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});
