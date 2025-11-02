import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
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
import { router } from 'expo-router';
import { DriverLoginData } from '../../../../api/config';
import Button from '../../../components/Button/Button';
import { authStyles } from '../../../styles/authStyles';
import { useAuth } from '../../../utils/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const passwordBorderAnim = useRef(new Animated.Value(0)).current;

  const { login } = useAuth();

  useEffect(() => {
    Animated.timing(emailBorderAnim, {
      toValue: email ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [email]);

  useEffect(() => {
    Animated.timing(passwordBorderAnim, {
      toValue: password ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [password]);

  const emailBorderColor = emailBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E5E5', '#000000'],
  });

  const passwordBorderColor = passwordBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E5E5', '#000000'],
  });

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      console.log('Logging in with:', { email, password });

      const loginData: DriverLoginData = {
        email,
        password,
      };

      await login(loginData, staySignedIn);
      console.log('Login successful');
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'Login successful',
        position: 'top',
        visibilityTime: 2000,
      });
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2:
          error instanceof Error
            ? error.message
            : 'Invalid email or password. Please try again.',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SafeAreaView style={authStyles.container}>
        <ScrollView
          contentContainerStyle={authStyles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.formCard}>
            <Text style={authStyles.title}>Welcome back</Text>
            <Text style={authStyles.subtitle}>Please input your details</Text>

            <Text style={authStyles.inputLabel}>EMAIL</Text>
            <Animated.View
              style={[
                authStyles.inputWrapper,
                { borderColor: emailBorderColor },
              ]}
            >
              <TextInput
                style={authStyles.inputInner}
                placeholder="Email@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="off"
                textContentType="none"
                autoCorrect={false}
              />
            </Animated.View>

            <Text style={authStyles.inputLabel}>PASSWORD</Text>
            <Animated.View
              style={[
                authStyles.passwordContainer,
                { borderColor: passwordBorderColor },
              ]}
            >
              <TextInput
                style={authStyles.passwordInput}
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="off"
                textContentType="none"
                autoCorrect={false}
                passwordRules=""
              />
              <TouchableOpacity
                style={authStyles.showButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={authStyles.showButtonText}>Show</Text>
              </TouchableOpacity>
            </Animated.View>

            <View style={authStyles.checkboxRow}>
              <TouchableOpacity
                onPress={() => setStaySignedIn(!staySignedIn)}
                style={[
                  authStyles.checkboxBox,
                  { backgroundColor: staySignedIn ? '#000' : 'transparent' },
                ]}
              >
                {staySignedIn && <Text style={authStyles.checkboxMark}>✓</Text>}
              </TouchableOpacity>
              <Text style={authStyles.checkboxLabel}>Stay signed in</Text>
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
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
