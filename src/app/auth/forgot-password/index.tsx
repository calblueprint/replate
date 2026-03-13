import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
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
import { INPUT_LIMITS, validateEmail } from '@/utils/validation';
import { ApiError } from '~/api/apiUtils';
import { driverAPI } from '~/api/config';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const insets = useSafeAreaInsets();

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError(null);
  };

  const isEmailValid = email.trim().length > 0 && validateEmail(email) === null;

  const handleRequestReset = async () => {
    if (!email || !isEmailValid || isLoading) return;

    setEmailError(null);

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    setIsLoading(true);

    try {
      await driverAPI.requestPasswordReset(email);
      setEmailSent(true);
      Toast.show({
        type: 'success',
        text1: 'Email sent',
        text2: 'Password reset instructions have been sent to your email.',
      });
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : 'Failed to send reset email. Please try again.';
      setEmailError(errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
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
              Check your email
            </Text>
            <Text className="text-sm font-body text-center mb-6 text-neutral-500">
              We've sent password reset instructions to {email}
            </Text>

            <View className="mt-3 mb-4">
              <AnimatedPressable
                className="w-full bg-primary-400 rounded-xl py-3.5 items-center justify-center min-h-[48px]"
                onPress={() => router.push('/auth/login')}
                accessibilityRole="button"
              >
                <Text className="text-base font-subheading text-white">
                  Back to login
                </Text>
              </AnimatedPressable>
            </View>

            <Text className="text-center text-neutral-600 font-body text-sm mt-4">
              Didn't receive the email?{' '}
              <Text
                className="text-primary-600 underline font-body-medium"
                onPress={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                accessibilityRole="link"
              >
                Try again
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
              Forgot Password?
            </Text>
            <Text className="text-sm font-body text-center mb-6 text-neutral-500">
              Enter your email address and we'll send you instructions to reset
              your password.
            </Text>
          </AnimatedEntry>

          <AnimatedEntry delay={200}>
            <FormInput
              label="EMAIL"
              value={email}
              onChangeText={handleEmailChange}
              error={emailError}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleRequestReset}
              maxLength={INPUT_LIMITS.EMAIL_MAX}
            />
          </AnimatedEntry>

          <AnimatedEntry delay={300}>
            <View className="mt-3 mb-4">
              <AnimatedPressable
                className={`w-full rounded-xl py-3.5 items-center justify-center min-h-[48px] ${
                  !email || !isEmailValid || isLoading
                    ? 'bg-neutral-300'
                    : 'bg-primary-400'
                }`}
                disabled={!email || !isEmailValid || isLoading}
                onPress={handleRequestReset}
                accessibilityRole="button"
              >
                <Text
                  className={`text-base font-subheading ${
                    !email || !isEmailValid || isLoading
                      ? 'text-neutral-500'
                      : 'text-white'
                  }`}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Text>
              </AnimatedPressable>
            </View>
          </AnimatedEntry>

          <AnimatedEntry delay={400}>
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
