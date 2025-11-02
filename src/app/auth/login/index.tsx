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
import { authStyles, ERROR_COLOR } from '../../../styles/authStyles';
import { useAuth } from '../../../utils/AuthContext';
import { validateEmail, validatePassword } from '../../../utils/validation';

interface ApiErrorResponse {
  message?: string;
  errors?: string[];
  status?: number;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Error states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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
    // Clear previous errors
    setEmailError(null);
    setPasswordError(null);

    // Run validations
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    // Set errors
    setEmailError(emailErr);
    setPasswordError(passwordErr);

    // If any errors exist, don't proceed
    if (emailErr || passwordErr) {
      return;
    }

    try {
      setIsLoading(true);

      const loginData: DriverLoginData = {
        email,
        password,
      };

      await login(loginData, staySignedIn);
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'Login successful',
        position: 'top',
        visibilityTime: 2000,
      });
      setTimeout(() => {
        router.push('/(tabs)/dashboard');
      }, 500);
    } catch (error: unknown) {
      // Handle backend errors
      const apiError = error as ApiErrorResponse | Error;
      const errorMessage: string =
        'message' in apiError && apiError.message
          ? apiError.message
          : apiError instanceof Error
            ? apiError.message
            : '';
      const status = 'status' in apiError ? apiError.status : undefined;

      // Handle network errors
      if (
        status === 0 ||
        (errorMessage && errorMessage.toLowerCase().includes('network'))
      ) {
        Toast.show({
          type: 'error',
          text1: 'Connection Error',
          text2: 'Please check your internet connection and try again.',
          position: 'top',
          visibilityTime: 3000,
        });
        return;
      }

      // Handle server errors
      if (status && status >= 500) {
        Toast.show({
          type: 'error',
          text1: 'Server Error',
          text2: 'Server is temporarily unavailable. Please try again later.',
          position: 'top',
          visibilityTime: 3000,
        });
        return;
      }

      // Check for invalid credentials
      if (errorMessage) {
        const errLower = errorMessage.toLowerCase();
        if (
          errLower.includes('invalid') ||
          errLower.includes('credentials') ||
          errLower.includes('password') ||
          errLower.includes('incorrect')
        ) {
          setEmailError('Invalid email or password. Please try again.');
          setPasswordError('Invalid email or password. Please try again.');
        } else if (errLower.includes('email')) {
          setEmailError(errorMessage);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2:
              errorMessage || 'Invalid email or password. Please try again.',
            position: 'top',
            visibilityTime: 3000,
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'Invalid email or password. Please try again.',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clear errors when user starts typing
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError(null);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError(null);
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
                { borderColor: emailError ? ERROR_COLOR : emailBorderColor },
              ]}
            >
              <TextInput
                style={authStyles.inputInner}
                placeholder="Email@gmail.com"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="off"
                textContentType="none"
                autoCorrect={false}
              />
            </Animated.View>
            {emailError && (
              <Text style={authStyles.errorText}>{emailError}</Text>
            )}

            <Text style={authStyles.inputLabel}>PASSWORD</Text>
            <Animated.View
              style={[
                authStyles.passwordContainer,
                {
                  borderColor: passwordError
                    ? ERROR_COLOR
                    : passwordBorderColor,
                },
              ]}
            >
              <TextInput
                style={authStyles.passwordInput}
                placeholder="Enter password"
                value={password}
                onChangeText={handlePasswordChange}
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
            {passwordError && (
              <Text style={authStyles.errorText}>{passwordError}</Text>
            )}

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
