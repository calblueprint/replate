import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { router, useLocalSearchParams } from 'expo-router';
import AnimatedEntry from '@/components/AnimatedEntry';
import AnimatedPressable from '@/components/AnimatedPressable';
import BackButton from '@/components/BackButton';
import FormInput from '@/components/FormInput';
import PasswordRequirements, {
  isPasswordValid as checkPasswordValid,
} from '@/components/PasswordRequirements';
import ReplateLogo from '@/components/ReplateLogo';
import {
  INPUT_LIMITS,
  validatePassword,
  validatePasswordMatch,
} from '@/utils/validation';
import { ApiError } from '~/api/apiUtils';
import { driverAPI, PasswordResetData } from '~/api/config';

export default function ResetPasswordPage() {
  const { reset_password_token } = useLocalSearchParams<{
    reset_password_token?: string;
  }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const insets = useSafeAreaInsets();
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!reset_password_token) {
      setTokenError(
        'Invalid or missing reset token. Please request a new password reset.',
      );
    }
  }, [reset_password_token]);

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordError(null);
    if (confirmPassword) {
      const matchError = validatePasswordMatch(text, confirmPassword);
      setConfirmPasswordError(matchError);
    } else {
      setConfirmPasswordError(null);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (text) {
      const matchError = validatePasswordMatch(password, text);
      setConfirmPasswordError(matchError);
    } else {
      setConfirmPasswordError(null);
    }
  };

  const isValid =
    checkPasswordValid(password) &&
    password === confirmPassword &&
    confirmPassword.length > 0;

  const handleResetPassword = async () => {
    if (!password || !confirmPassword || !isValid || isLoading) return;

    setPasswordError(null);
    setConfirmPasswordError(null);

    if (!reset_password_token) {
      setTokenError(
        'Invalid or missing reset token. Please request a new password reset.',
      );
      return;
    }

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    const passwordMatchError = validatePasswordMatch(password, confirmPassword);
    if (passwordMatchError) {
      setConfirmPasswordError(passwordMatchError);
      return;
    }

    setIsLoading(true);

    try {
      const resetData: PasswordResetData = {
        reset_password_token: reset_password_token as string,
        password,
        password_confirmation: confirmPassword,
      };

      await driverAPI.resetPassword(resetData);
      setPasswordReset(true);
      Toast.show({
        type: 'success',
        text1: 'Password reset',
        text2: 'Your password has been reset successfully.',
      });

      navTimerRef.current = setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      const isApiError = error instanceof ApiError;
      const errorMessage = isApiError
        ? error.message
        : 'Failed to reset password. Please try again.';
      const errors = isApiError ? error.errors : [];

      if (
        errorMessage.toLowerCase().includes('token') ||
        errorMessage.toLowerCase().includes('invalid') ||
        errorMessage.toLowerCase().includes('expired')
      ) {
        setTokenError(errorMessage);
      } else if (errors.length > 0) {
        errors.forEach(err => {
          if (err.toLowerCase().includes('password')) {
            if (err.toLowerCase().includes('confirmation')) {
              setConfirmPasswordError(err);
            } else {
              setPasswordError(err);
            }
          }
        });
      } else {
        setPasswordError(errorMessage);
      }

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (passwordReset) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            paddingTop: Math.max(insets.top + 20, 40),
            paddingBottom: Math.max(insets.bottom + 40, 60),
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full">
            <View className="items-center mb-6 mt-5">
              <ReplateLogo size={96} />
            </View>
            <Text className="text-3xl font-heading text-center mb-3 text-neutral-800">
              Password Reset!
            </Text>
            <Text className="text-sm font-body text-center mb-6 text-neutral-500">
              Your password has been reset successfully. Redirecting to login...
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!reset_password_token || tokenError) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            paddingTop: Math.max(insets.top + 20, 40),
            paddingBottom: Math.max(insets.bottom + 40, 60),
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full">
            <View className="items-center mb-6 mt-5">
              <ReplateLogo size={96} />
            </View>
            <Text className="text-3xl font-heading text-center mb-3 text-neutral-800">
              Invalid Reset Link
            </Text>
            <Text className="text-sm font-body text-center mb-6 text-neutral-500">
              {tokenError ||
                'This password reset link is invalid or has expired. Please request a new one.'}
            </Text>

            <View className="mt-3 mb-4">
              <AnimatedPressable
                className="w-full bg-primary-400 rounded-xl py-3.5 items-center justify-center min-h-[48px]"
                onPress={() => router.push('/auth/forgot-password')}
                accessibilityRole="button"
              >
                <Text className="text-base font-subheading text-white">
                  Request New Reset Link
                </Text>
              </AnimatedPressable>
            </View>

            <Text className="text-center text-neutral-600 font-body text-sm mt-4">
              Remember your password?{' '}
              <Text
                className="text-primary-600 underline font-body-medium"
                onPress={() => router.push('/auth/login')}
                accessibilityRole="link"
              >
                Log in
              </Text>
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: Math.max(insets.top + 20, 40),
          paddingBottom: Math.max(insets.bottom + 40, 60),
        }}
        keyboardShouldPersistTaps="handled"
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
              Reset Password
            </Text>
            <Text className="text-sm font-body text-center mb-6 text-neutral-500">
              Enter your new password below.
            </Text>
          </AnimatedEntry>

          <AnimatedEntry delay={200}>
            <FormInput
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
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              blurOnSubmit={false}
              maxLength={INPUT_LIMITS.PASSWORD_MAX}
            />
            <PasswordRequirements password={password} />

            {/* Hidden dummy TextInput to prevent iOS strong password suggestion */}
            <TextInput
              className="h-[0.1px] opacity-0 absolute"
              autoComplete="off"
              textContentType="none"
              accessibilityElementsHidden={true}
              importantForAccessibility="no"
            />

            <FormInput
              ref={confirmPasswordRef}
              label="CONFIRM PASSWORD"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              error={confirmPasswordError}
              placeholder="Enter same password"
              secureTextEntry
              showToggle
              autoComplete="off"
              textContentType="oneTimeCode"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleResetPassword}
              maxLength={INPUT_LIMITS.PASSWORD_MAX}
            />
          </AnimatedEntry>

          <AnimatedEntry delay={360}>
            <View className="mt-3 mb-4">
              <AnimatedPressable
                className={`w-full rounded-xl py-3.5 items-center justify-center min-h-[48px] ${
                  !password || !confirmPassword || !isValid || isLoading
                    ? 'bg-neutral-300'
                    : 'bg-primary-400'
                }`}
                disabled={
                  !password || !confirmPassword || !isValid || isLoading
                }
                onPress={handleResetPassword}
                accessibilityRole="button"
              >
                <Text
                  className={`text-base font-subheading ${
                    !password || !confirmPassword || !isValid || isLoading
                      ? 'text-neutral-500'
                      : 'text-white'
                  }`}
                >
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </Text>
              </AnimatedPressable>
            </View>
          </AnimatedEntry>

          <AnimatedEntry delay={440}>
            <Text className="text-center text-neutral-600 font-body text-sm mt-4">
              Remember your password?{' '}
              <Text
                className="text-primary-600 underline font-body-medium"
                onPress={() => router.push('/auth/login')}
                accessibilityRole="link"
              >
                Log in
              </Text>
            </Text>
          </AnimatedEntry>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
