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
import PasswordRequirements, {
  isPasswordValid,
} from '@/components/PasswordRequirements';
import ReplateLogo from '@/components/ReplateLogo';
import { useAuth } from '@/utils/AuthContext';
import {
  INPUT_LIMITS,
  validateEmail,
  validateName,
  validatePasswordMatch,
  validatePhone,
} from '@/utils/validation';
import { ApiError } from '~/api/apiUtils';
import { DriverSignupData } from '~/api/config';

export default function SignupPage() {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  const insets = useSafeAreaInsets();
  const { signup } = useAuth();
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const handleSignUp = async () => {
    setFirstNameError(null);
    setLastNameError(null);
    setPhoneError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    const firstNameErr = validateName(first_name, 'First name');
    const lastNameErr = validateName(last_name, 'Last name');
    const phoneErr = validatePhone(phone_number);
    const emailErr = validateEmail(email);
    const passwordErr = !password ? 'Password is required' : null;
    const confirmPasswordErr = validatePasswordMatch(password, confirmPassword);

    setFirstNameError(firstNameErr);
    setLastNameError(lastNameErr);
    setPhoneError(phoneErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);

    if (
      firstNameErr ||
      lastNameErr ||
      phoneErr ||
      emailErr ||
      passwordErr ||
      confirmPasswordErr
    ) {
      return;
    }

    try {
      setIsLoading(true);

      const signupData: DriverSignupData = {
        email,
        password,
        password_confirmation: confirmPassword,
        first_name,
        last_name,
        phone: phone_number,
      };

      await signup(signupData);
      navTimerRef.current = setTimeout(() => {
        router.replace('/onboarding');
      }, 500);
    } catch (error: unknown) {
      const isApiError = error instanceof ApiError;
      const errorMessage = isApiError
        ? error.message
        : error instanceof Error
          ? error.message
          : '';
      const errorsArray = isApiError ? error.errors : [];
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

      let hasFieldErrors = false;
      const allErrors =
        errorsArray.length > 0
          ? errorsArray
          : errorMessage
            ? [errorMessage]
            : [];

      for (const err of allErrors) {
        if (!err) continue;
        const errLower = err.toLowerCase();

        if (errLower.includes('email')) {
          hasFieldErrors = true;
          if (errLower.includes('taken') || errLower.includes('already')) {
            setEmailError(
              'This email is already registered. Please use a different email.',
            );
          } else if (errLower.includes('invalid')) {
            setEmailError('Please enter a valid email address.');
          } else {
            setEmailError(err);
          }
        } else if (
          errLower.includes('password') &&
          !errLower.includes('too short') &&
          !errLower.includes('minimum') &&
          !errLower.includes('complexity') &&
          !errLower.includes('weak') &&
          !errLower.includes('uppercase') &&
          !errLower.includes('lowercase') &&
          !errLower.includes('number') &&
          !errLower.includes('special')
        ) {
          hasFieldErrors = true;
          setPasswordError(err);
        } else if (errLower.includes('phone')) {
          hasFieldErrors = true;
          if (errLower.includes('invalid')) {
            setPhoneError('Please enter a valid phone number.');
          } else {
            setPhoneError(err);
          }
        } else if (
          errLower.includes('first name') ||
          errLower.includes('first_name')
        ) {
          hasFieldErrors = true;
          setFirstNameError(err);
        } else if (
          errLower.includes('last name') ||
          errLower.includes('last_name')
        ) {
          hasFieldErrors = true;
          setLastNameError(err);
        }
      }

      if (!hasFieldErrors) {
        Toast.show({
          type: 'error',
          text1: 'Signup Failed',
          text2: errorMessage || 'Failed to create account. Please try again.',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFirstNameChange = (text: string) => {
    setFirstName(text);
    if (firstNameError) setFirstNameError(null);
  };
  const handleLastNameChange = (text: string) => {
    setLastName(text);
    if (lastNameError) setLastNameError(null);
  };
  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    if (phoneError) setPhoneError(null);
  };
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError(null);
  };
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError(null);
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

  const passwordValid = isPasswordValid(password);

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
              Create Account
            </Text>
            <Text className="text-sm font-body text-center mb-6 text-neutral-500">
              Please enter your details
            </Text>
          </AnimatedEntry>

          <AnimatedEntry delay={200}>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <FormInput
                  label="FIRST NAME"
                  value={first_name}
                  onChangeText={handleFirstNameChange}
                  error={firstNameError}
                  placeholder="First name"
                  autoComplete="off"
                  textContentType="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => lastNameRef.current?.focus()}
                  blurOnSubmit={false}
                  maxLength={INPUT_LIMITS.NAME_MAX}
                />
              </View>
              <View className="flex-1">
                <FormInput
                  ref={lastNameRef}
                  label="LAST NAME"
                  value={last_name}
                  onChangeText={handleLastNameChange}
                  error={lastNameError}
                  placeholder="Last name"
                  autoComplete="off"
                  textContentType="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                  blurOnSubmit={false}
                  maxLength={INPUT_LIMITS.NAME_MAX}
                />
              </View>
            </View>

            <FormInput
              ref={emailRef}
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
              onSubmitEditing={() => phoneRef.current?.focus()}
              blurOnSubmit={false}
              maxLength={INPUT_LIMITS.EMAIL_MAX}
            />

            <FormInput
              ref={phoneRef}
              label="PHONE"
              value={phone_number}
              onChangeText={handlePhoneChange}
              error={phoneError}
              placeholder="(123) 456-7890"
              keyboardType="phone-pad"
              autoComplete="off"
              textContentType="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
              maxLength={20}
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
              onSubmitEditing={handleSignUp}
              maxLength={INPUT_LIMITS.PASSWORD_MAX}
            />
          </AnimatedEntry>

          <AnimatedEntry delay={360}>
            <View className="mt-3 mb-4">
              <AnimatedPressable
                className={`w-full rounded-xl py-3.5 items-center justify-center min-h-[48px] ${
                  !email ||
                  !password ||
                  !confirmPassword ||
                  !first_name ||
                  !last_name ||
                  !phone_number ||
                  !passwordValid ||
                  isLoading
                    ? 'bg-neutral-300'
                    : 'bg-primary-400'
                }`}
                disabled={
                  !email ||
                  !password ||
                  !confirmPassword ||
                  !first_name ||
                  !last_name ||
                  !phone_number ||
                  !passwordValid ||
                  isLoading
                }
                onPress={handleSignUp}
                scaleValue={0.97}
                accessibilityRole="button"
              >
                <Text
                  className={`text-base font-subheading ${
                    !email ||
                    !password ||
                    !confirmPassword ||
                    !first_name ||
                    !last_name ||
                    !phone_number ||
                    !passwordValid ||
                    isLoading
                      ? 'text-neutral-500'
                      : 'text-white'
                  }`}
                >
                  {isLoading ? 'Creating Account...' : 'Continue'}
                </Text>
              </AnimatedPressable>
            </View>
          </AnimatedEntry>

          <AnimatedEntry delay={440}>
            <Text className="text-center text-neutral-600 font-body text-sm mt-4">
              Already have an account?{' '}
              <Text
                className="text-primary-600 underline font-body-medium"
                onPress={() => router.replace('/auth/login')}
                accessibilityRole="link"
              >
                Sign in
              </Text>
            </Text>
          </AnimatedEntry>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
