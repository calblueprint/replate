import React, { useState } from 'react';
import { Keyboard } from 'react-native';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import AuthButton from '@/components/AuthButton';
import AuthFooterLink from '@/components/AuthFooterLink';
import AuthInput from '@/components/AuthInput';
import AuthScreenLayout from '@/components/AuthScreenLayout';
import {
  extractApiErrorDetails,
  getNetworkOrServerToast,
  showAuthErrorToast,
} from '@/utils/authErrors';
import { INPUT_LIMITS, validateEmail } from '@/utils/validation';
import { driverAPI } from '~/api/config';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const isEmailValid = email.trim().length > 0 && validateEmail(email) === null;

  const handleRequestReset = async () => {
    if (!email || !isEmailValid || isLoading) return;

    setEmailError(null);
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
      const networkOrServer = getNetworkOrServerToast(error);
      if (networkOrServer) {
        showAuthErrorToast(networkOrServer.text1, networkOrServer.text2);
        return;
      }

      const { message } = extractApiErrorDetails(error);
      const errorMessage =
        message || 'Failed to send reset email. Please try again.';
      setEmailError(errorMessage);
      showAuthErrorToast('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <AuthScreenLayout
        title="Email Sent!"
        subtitle="Check your email for password recovery"
      >
        <AuthButton
          label="Back to login"
          onPress={() => router.replace('/auth/login')}
        />

        <AuthFooterLink
          prompt="Didn't receive the email?"
          actionLabel="Try again"
          onPress={() => {
            setEmailSent(false);
            setEmail('');
          }}
        />
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout
      title="Reset your password"
      subtitle="Please enter your email to reset the password"
    >
      <AuthInput
        label="EMAIL"
        placeholder="email@gmail.com..."
        value={email}
        onChangeText={text => {
          setEmail(text);
          setEmailError(null);
        }}
        error={emailError}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        blurOnSubmit={false}
        onSubmitEditing={() => {
          Keyboard.dismiss();
          handleRequestReset();
        }}
        maxLength={INPUT_LIMITS.EMAIL_MAX}
      />

      <AuthButton
        label={isLoading ? 'Sending...' : 'Reset Password'}
        disabled={!email || !isEmailValid || isLoading}
        onPress={handleRequestReset}
      />

      <AuthFooterLink
        prompt="Remember your password?"
        actionLabel="Log in"
        onPress={() => router.replace('/auth/login')}
      />
    </AuthScreenLayout>
  );
}
