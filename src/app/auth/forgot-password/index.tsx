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
import { driverAPI } from '../../../../api/config';
// Assets
import LOGIN_LOGO from '../../../../assets/login-logo.png';
import { authStyles, ERROR_COLOR } from '../../../styles/authStyles';
import { validateEmail } from '../../../utils/validation';

interface ApiErrorResponse {
  message?: string;
  errors?: string[];
  status?: number;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Error states
  const [emailError, setEmailError] = useState<string | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  const emailBorderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(emailBorderAnim, {
      toValue: email ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [email]);

  const emailBorderColor = emailBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#a9a9a9', '#a9a9a9'],
  });

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError(null);
  };

  // Check if email is valid (no validation errors)
  const isEmailValid = email.trim().length > 0 && validateEmail(email) === null;

  const handleRequestReset = async () => {
    // Guard: Don't proceed if validation fails
    if (!email || !isEmailValid || isLoading) {
      return;
    }

    // Clear previous errors
    setEmailError(null);

    // Validate email
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
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
      const apiError = error as ApiErrorResponse;
      const errorMessage =
        apiError.message || 'Failed to send reset email. Please try again.';
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
      <SafeAreaView style={authStyles.container}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            authStyles.scrollViewContent,
            {
              paddingTop: Math.max(insets.top + 20, 40),
              paddingBottom: Math.max(insets.bottom + 40, 60),
            },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={authStyles.formCard}>
            <View style={authStyles.logoContainer}>
              <Image source={LOGIN_LOGO} style={authStyles.logoImage} />
            </View>
            <Text style={authStyles.titleCentered}>Check your email</Text>
            <Text style={authStyles.subtitleCentered}>
              We've sent password reset instructions to {email}
            </Text>

            <View style={authStyles.buttonContainer}>
              <TouchableOpacity
                style={authStyles.grayButton}
                onPress={() => router.push('/auth/login')}
                activeOpacity={0.8}
              >
                <Text style={authStyles.grayButtonText}>Back to login</Text>
              </TouchableOpacity>
            </View>

            <Text style={authStyles.linkTextSignup}>
              Didn't receive the email?{' '}
              <Text
                style={authStyles.linkSignup}
                onPress={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
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
    <SafeAreaView style={authStyles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          authStyles.content,
          {
            paddingTop: Math.max(insets.top + 20, 40),
            paddingBottom: Math.max(insets.bottom + 40, 60),
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={authStyles.formCard}>
          <View style={authStyles.logoContainer}>
            <Image source={LOGIN_LOGO} style={authStyles.logoImage} />
          </View>
          <Text style={authStyles.titleCentered}>Forgot Password?</Text>
          <Text style={authStyles.subtitleCentered}>
            Enter your email address and we'll send you instructions to reset
            your password.
          </Text>

          <View>
            <Text style={authStyles.inputLabelDark}>EMAIL</Text>
            <Animated.View
              style={[
                authStyles.inputWrapper,
                {
                  borderColor: emailError ? ERROR_COLOR : emailBorderColor,
                },
              ]}
            >
              <TextInput
                style={[authStyles.inputInner, authStyles.textBlack]}
                placeholder="Enter your email"
                placeholderTextColor="#989898"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                  handleRequestReset();
                }}
              />
            </Animated.View>
            {emailError && (
              <Text style={authStyles.errorText}>{emailError}</Text>
            )}
          </View>

          <View style={authStyles.buttonContainer}>
            <TouchableOpacity
              style={[
                authStyles.grayButton,
                authStyles.buttonEnabled,
                {
                  opacity: !email || !isEmailValid || isLoading ? 0.5 : 1,
                },
              ]}
              disabled={!email || !isEmailValid || isLoading}
              onPress={handleRequestReset}
              activeOpacity={0.8}
            >
              <Text style={authStyles.grayButtonText}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={authStyles.linkTextSignup}>
            Remember your password?{' '}
            <Text
              style={authStyles.linkSignup}
              onPress={() => router.push('/auth/login')}
            >
              Log in
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
