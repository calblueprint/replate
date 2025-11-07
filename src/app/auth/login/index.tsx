import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { DriverLoginData } from '../../../../api/config';
// Assets
import LOGIN_LOGO from '../../../../assets/login-logo.png';
import { authStyles, ERROR_COLOR } from '../../../styles/authStyles';
import { useAuth } from '../../../utils/AuthContext';
import { validateEmail } from '../../../utils/validation';

interface ApiErrorResponse {
  message?: string;
  errors?: string[];
  status?: number;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Error states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

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
    outputRange: ['#a9a9a9', '#a9a9a9'],
  });

  const passwordBorderColor = passwordBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#a9a9a9', '#a9a9a9'],
  });

  const handleLogin = async () => {
    // Clear previous errors
    setEmailError(null);
    setPasswordError(null);

    // Run validations
    const emailErr = validateEmail(email);
    const passwordErr =
      !password || password.trim() === '' ? 'Password is required' : null;

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

      await login(loginData, false);
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
    <SafeAreaView style={authStyles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          {
            padding: 20,
            paddingTop: 40,
            paddingBottom: Math.max(insets.bottom + 40, 60),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
        keyboardDismissMode="interactive"
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
      >
        <View style={authStyles.formCard}>
          {/* Logo */}
          <View style={authStyles.logoContainer}>
            <Image source={LOGIN_LOGO} style={authStyles.logoImage} />
          </View>

          <Text style={authStyles.titleCentered}>Welcome!</Text>
          <Text style={authStyles.subtitleCentered}>
            Please enter your details
          </Text>

          <View>
            <Text style={authStyles.inputLabelDark}>EMAIL</Text>
            <Animated.View
              style={[
                authStyles.inputWrapper,
                { borderColor: emailError ? ERROR_COLOR : emailBorderColor },
              ]}
            >
              <TextInput
                style={[authStyles.inputInner, { color: '#000' }]}
                placeholder="Email@gmail.com"
                placeholderTextColor="#989898"
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
          </View>

          <View>
            <Text style={authStyles.inputLabelDark}>PASSWORD</Text>
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
                style={[authStyles.passwordInput, { color: '#000' }]}
                placeholder="Enter password"
                placeholderTextColor="#989898"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                autoComplete="off"
                textContentType="oneTimeCode"
                autoCorrect={false}
                passwordRules=""
                blurOnSubmit={false}
                onSubmitEditing={() => Keyboard.dismiss()}
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
          </View>

          <View style={authStyles.buttonContainer}>
            <TouchableOpacity
              style={[
                authStyles.grayButton,
                {
                  opacity: !email || !password || isLoading ? 0.5 : 1,
                },
              ]}
              disabled={!email || !password || isLoading}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={authStyles.grayButtonText}>
                {isLoading ? 'Logging in...' : 'Log in '}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={authStyles.linkTextSignup}>
            Need an account?{' '}
            <Text
              style={authStyles.linkSignup}
              onPress={() => router.push('/auth/signup')}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
