import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import AnimatedEntry from '@/components/AnimatedEntry';
import AnimatedPressable from '@/components/AnimatedPressable';
import BackButton from '@/components/BackButton';
import FormInput from '@/components/FormInput';
import ReplateLogo from '@/components/ReplateLogo';
import { useAuth } from '@/utils/AuthContext';
import { INPUT_LIMITS, validateEmail } from '@/utils/validation';
import { ApiError } from '~/api/apiUtils';
import { DriverLoginData } from '~/api/config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const passwordRef = useRef<TextInput>(null);

  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const handleLogin = async () => {
    setEmailError(null);
    setPasswordError(null);

    const emailErr = validateEmail(email);
    const passwordErr =
      !password || password.trim() === '' ? 'Password is required' : null;

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) return;

    try {
      setIsLoading(true);

      const loginData: DriverLoginData = { email, password };
      await login(loginData, true);
      navTimerRef.current = setTimeout(() => {
        router.replace('/(tabs)/my-tasks');
      }, 500);
    } catch (error: unknown) {
      const isApiError = error instanceof ApiError;
      const errorMessage = isApiError
        ? error.message
        : error instanceof Error
          ? error.message
          : '';
      const status = isApiError ? error.status : undefined;

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

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError(null);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: 40,
          paddingBottom: Math.max(insets.bottom + 40, 60),
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
        keyboardDismissMode="interactive"
        contentInsetAdjustmentBehavior="automatic"
        className="flex-1"
      >
        <View className="w-full">
          <BackButton />
          <AnimatedEntry from={{ opacity: 0, scale: 0.9 }} duration={450}>
            <View className="items-center mb-6 mt-5">
              <ReplateLogo size={96} />
            </View>
          </AnimatedEntry>

          <AnimatedEntry delay={100}>
            <Text className="text-3xl font-heading text-center mb-3 text-neutral-800">
              Welcome Back
            </Text>
            <Text className="text-sm font-body text-center mb-6 text-neutral-500">
              Please enter your details
            </Text>
          </AnimatedEntry>

          <AnimatedEntry delay={200}>
            <FormInput
              label="EMAIL"
              value={email}
              onChangeText={handleEmailChange}
              error={emailError}
              placeholder="Email@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="off"
              textContentType="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
              maxLength={INPUT_LIMITS.EMAIL_MAX}
            />

            <FormInput
              ref={passwordRef}
              label="PASSWORD"
              value={password}
              onChangeText={handlePasswordChange}
              error={passwordError}
              placeholder="Enter password"
              secureTextEntry
              showToggle
              autoComplete="off"
              textContentType="oneTimeCode"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              maxLength={INPUT_LIMITS.PASSWORD_MAX}
            />
          </AnimatedEntry>

          <AnimatedEntry delay={280}>
            <AnimatedPressable
              className="self-start py-1.5 mb-4"
              onPress={() => router.replace('/auth/forgot-password')}
              accessibilityRole="link"
              accessibilityLabel="Forgot password"
            >
              <Text className="text-primary-600 underline font-body-medium text-sm">
                Forgot password?
              </Text>
            </AnimatedPressable>
          </AnimatedEntry>

          <AnimatedEntry delay={360}>
            <View className="mt-3 mb-4">
              <AnimatedPressable
                className={`w-full rounded-xl py-3.5 items-center justify-center min-h-[48px] ${
                  !email || !password || isLoading
                    ? 'bg-neutral-300'
                    : 'bg-primary-400'
                }`}
                disabled={!email || !password || isLoading}
                onPress={handleLogin}
                scaleValue={0.97}
                accessibilityRole="button"
                accessibilityLabel={isLoading ? 'Logging in' : 'Log in'}
              >
                <Text
                  className={`text-base font-subheading ${
                    !email || !password || isLoading
                      ? 'text-neutral-500'
                      : 'text-white'
                  }`}
                >
                  {isLoading ? 'Logging in...' : 'Log in'}
                </Text>
              </AnimatedPressable>
            </View>
          </AnimatedEntry>

          <AnimatedEntry delay={440}>
            <Text className="text-center text-neutral-600 font-body text-sm mt-4">
              Need an account?{' '}
              <Text
                className="text-primary-600 underline font-body-medium"
                onPress={() => router.replace('/auth/signup')}
                accessibilityRole="link"
              >
                Sign up
              </Text>
            </Text>
          </AnimatedEntry>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
