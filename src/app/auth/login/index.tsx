import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AuthButton from '@/components/AuthButton';
import AuthFooterLink from '@/components/AuthFooterLink';
import AuthInput from '@/components/AuthInput';
import AuthScreenLayout from '@/components/AuthScreenLayout';
import { authStyles } from '@/styles/authStyles';
import { useAuth } from '@/utils/AuthContext';
import { parseLoginApiErrors, showAuthErrorToast } from '@/utils/authErrors';
import { INPUT_LIMITS, validateEmail } from '@/utils/validation';
import { DriverLoginData } from '~/api/config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { login } = useAuth();

  const handleLogin = async () => {
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
      setTimeout(() => {
        router.replace('/(tabs)/my-tasks');
      }, 500);
    } catch (error: unknown) {
      const parsed = parseLoginApiErrors(error);
      if (parsed.toast) {
        showAuthErrorToast(parsed.toast.text1, parsed.toast.text2);
      } else {
        setEmailError(parsed.fieldErrors.email ?? null);
        setPasswordError(parsed.fieldErrors.password ?? null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthScreenLayout title="Welcome!" subtitle="Please enter your details">
      <AuthInput
        label="EMAIL"
        placeholder="Enter email"
        value={email}
        onChangeText={text => {
          setEmail(text);
          if (emailError) setEmailError(null);
        }}
        error={emailError}
        keyboardType="email-address"
        autoCapitalize="none"
        maxLength={INPUT_LIMITS.EMAIL_MAX}
      />

      <AuthInput
        isPassword
        label="PASSWORD"
        placeholder="Enter password"
        value={password}
        onChangeText={text => {
          setPassword(text);
          if (passwordError) setPasswordError(null);
        }}
        error={passwordError}
        maxLength={INPUT_LIMITS.PASSWORD_MAX}
      />

      <TouchableOpacity
        onPress={() => router.replace('/auth/forgot-password')}
        style={authStyles.forgotPasswordLink}
      >
        <Text style={[authStyles.footerText, { marginTop: 0 }]}>
          Forgot Password? <Text style={authStyles.footerLink}>Reset Here</Text>
        </Text>
      </TouchableOpacity>

      <AuthButton
        label={isLoading ? 'Logging in...' : 'LOGIN'}
        disabled={!email || !password || isLoading}
        onPress={handleLogin}
      />

      <AuthFooterLink
        prompt="Need an account?"
        actionLabel="Sign up"
        onPress={() => router.replace('/auth/signup')}
      />
    </AuthScreenLayout>
  );
}
