import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import Toast from 'react-native-toast-message';
import { router, useLocalSearchParams } from 'expo-router';
import AuthButton from '@/components/AuthButton';
import AuthFooterLink from '@/components/AuthFooterLink';
import AuthInput from '@/components/AuthInput';
import AuthScreenLayout from '@/components/AuthScreenLayout';
import PasswordRequirements, {
  isPasswordValid,
} from '@/components/PasswordRequirements';
import { authStyles } from '@/styles/authStyles';
import {
  parseResetPasswordApiErrors,
  showAuthErrorToast,
} from '@/utils/authErrors';
import { INPUT_LIMITS, validatePasswordMatch } from '@/utils/validation';
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
    setConfirmPasswordError(
      confirmPassword ? validatePasswordMatch(text, confirmPassword) : null,
    );
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setConfirmPasswordError(
      text ? validatePasswordMatch(password, text) : null,
    );
  };

  const canSubmit =
    isPasswordValid(password) &&
    password === confirmPassword &&
    confirmPassword.length > 0;

  const handleResetPassword = async () => {
    if (!reset_password_token || !canSubmit || isLoading) return;

    setPasswordError(null);
    setConfirmPasswordError(null);
    setIsLoading(true);

    try {
      const resetData: PasswordResetData = {
        reset_password_token,
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

      setTimeout(() => {
        router.replace('/auth/login');
      }, 2000);
    } catch (error) {
      const parsed = parseResetPasswordApiErrors(error);
      if (parsed.fieldErrors.token) {
        setTokenError(parsed.fieldErrors.token);
      } else {
        setPasswordError(parsed.fieldErrors.password ?? null);
        setConfirmPasswordError(parsed.fieldErrors.confirmPassword ?? null);
      }
      showAuthErrorToast(parsed.toast.text1, parsed.toast.text2);
    } finally {
      setIsLoading(false);
    }
  };

  if (passwordReset) {
    return (
      <AuthScreenLayout
        showBackButton={false}
        title="Password Reset!"
        subtitle="Your password has been reset successfully. Redirecting to login..."
      />
    );
  }

  if (!reset_password_token || tokenError) {
    return (
      <AuthScreenLayout
        showBackButton={false}
        title="Invalid Reset Link"
        subtitle={
          tokenError ||
          'This password reset link is invalid or has expired. Please request a new one.'
        }
      >
        <AuthButton
          label="Request New Reset Link"
          onPress={() => router.replace('/auth/forgot-password')}
        />

        <AuthFooterLink
          prompt="Remember your password?"
          actionLabel="Log in"
          onPress={() => router.replace('/auth/login')}
        />
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout
      title="Reset Password"
      subtitle="Enter your new password below."
    >
      <AuthInput
        isPassword
        label="PASSWORD"
        placeholder="Enter password"
        value={password}
        onChangeText={handlePasswordChange}
        error={passwordError}
        maxLength={INPUT_LIMITS.PASSWORD_MAX}
      >
        <PasswordRequirements password={password} />
      </AuthInput>

      {/* Hidden dummy TextInput to prevent iOS strong password suggestion */}
      <TextInput
        style={authStyles.hiddenInput}
        autoComplete="off"
        textContentType="none"
      />

      <AuthInput
        isPassword
        label="CONFIRM PASSWORD"
        placeholder="Enter same password"
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        error={confirmPasswordError}
        maxLength={INPUT_LIMITS.PASSWORD_MAX}
      />

      <AuthButton
        label={isLoading ? 'Resetting Password...' : 'Reset Password'}
        disabled={!canSubmit || isLoading}
        onPress={handleResetPassword}
      />

      <AuthFooterLink
        prompt="Remember your password?"
        actionLabel="Log in"
        onPress={() => router.replace('/auth/login')}
      />
    </AuthScreenLayout>
  );
}
