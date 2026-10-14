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
import { router, useLocalSearchParams } from 'expo-router';
import { driverAPI, PasswordResetData } from '../../../../api/config';
import CHECK_ICON from '../../../../assets/check-icon.png';
// Assets
import REPLATE_LOGO from '../../../../assets/replate-logo.png';
import BackButton from '../../../components/BackButton';
import { authStyles, ERROR_COLOR } from '../../../styles/authStyles';
import {
  INPUT_LIMITS,
  validatePassword,
  validatePasswordMatch,
} from '../../../utils/validation';

interface ApiErrorResponse {
  message?: string;
  errors?: string[];
  status?: number;
}

export default function ResetPasswordPage() {
  const { reset_password_token } = useLocalSearchParams<{
    reset_password_token?: string;
  }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  // Error states
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  // Focus states
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const passwordBorderAnim = useRef(new Animated.Value(0)).current;
  const confirmPasswordBorderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!reset_password_token) {
      setTokenError(
        'Invalid or missing reset token. Please request a new password reset.',
      );
    }
  }, [reset_password_token]);

  useEffect(() => {
    Animated.timing(passwordBorderAnim, {
      toValue: passwordFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [passwordFocused]);

  useEffect(() => {
    Animated.timing(confirmPasswordBorderAnim, {
      toValue: confirmPasswordFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [confirmPasswordFocused]);

  const passwordBorderWidth = passwordBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.5],
  });

  const passwordBorderColor = passwordBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#a9a9a9', '#58ad85'],
  });

  const confirmPasswordBorderWidth = confirmPasswordBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.5],
  });

  const confirmPasswordBorderColor = confirmPasswordBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#a9a9a9', '#58ad85'],
  });

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordError(null);
    // Live validation: check if confirm password matches
    if (confirmPassword) {
      const matchError = validatePasswordMatch(text, confirmPassword);
      setConfirmPasswordError(matchError);
    } else {
      // Clear error if confirm password is empty
      setConfirmPasswordError(null);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    // Live validation: check if passwords match
    if (text) {
      const matchError = validatePasswordMatch(password, text);
      setConfirmPasswordError(matchError);
    } else {
      // Clear error if field is empty
      setConfirmPasswordError(null);
    }
  };

  // Check if password meets all requirements and passwords match
  const isPasswordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password) &&
    /[0-9]/.test(password) &&
    password === confirmPassword &&
    confirmPassword.length > 0;

  const handleResetPassword = async () => {
    // Guard: Don't proceed if validation fails
    if (!password || !confirmPassword || !isPasswordValid || isLoading) {
      return;
    }

    // Clear previous errors
    setPasswordError(null);
    setConfirmPasswordError(null);

    if (!reset_password_token) {
      setTokenError(
        'Invalid or missing reset token. Please request a new password reset.',
      );
      return;
    }

    // Validate password
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    // Validate password match
    const passwordMatchError = validatePasswordMatch(password, confirmPassword);
    if (passwordMatchError) {
      setConfirmPasswordError(passwordMatchError);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
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

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      const errorMessage =
        apiError.message || 'Failed to reset password. Please try again.';

      // Check if it's a token-related error
      if (
        errorMessage.toLowerCase().includes('token') ||
        errorMessage.toLowerCase().includes('invalid') ||
        errorMessage.toLowerCase().includes('expired')
      ) {
        setTokenError(errorMessage);
      } else if (apiError.errors && apiError.errors.length > 0) {
        // Handle field-specific errors
        apiError.errors.forEach(err => {
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
              <Image source={REPLATE_LOGO} style={authStyles.logoImage} />
            </View>
            <Text style={authStyles.titleCentered}>Password Reset!</Text>
            <Text style={authStyles.subtitleCentered}>
              Your password has been reset successfully. Redirecting to login...
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!reset_password_token || tokenError) {
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
              <Image source={REPLATE_LOGO} style={authStyles.logoImage} />
            </View>
            <Text style={authStyles.titleCentered}>Invalid Reset Link</Text>
            <Text style={authStyles.subtitleCentered}>
              {tokenError ||
                'This password reset link is invalid or has expired. Please request a new one.'}
            </Text>

            <View style={authStyles.buttonContainer}>
              <TouchableOpacity
                style={authStyles.grayButton}
                onPress={() => router.push('/auth/forgot-password')}
                activeOpacity={0.8}
              >
                <Text style={authStyles.grayButtonText}>
                  Request New Reset Link
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
          <BackButton />
          <View style={authStyles.logoContainer}>
            <Image source={REPLATE_LOGO} style={authStyles.logoImage} />
          </View>
          <Text style={authStyles.titleCentered}>Reset Password</Text>
          <Text style={authStyles.subtitleCentered}>
            Enter your new password below.
          </Text>

          <View>
            <Text style={authStyles.inputLabelDark}>PASSWORD</Text>
            <Animated.View
              style={[
                authStyles.passwordContainer,
                {
                  borderColor: passwordError
                    ? ERROR_COLOR
                    : passwordBorderColor,
                  borderWidth: passwordBorderWidth,
                },
              ]}
            >
              <TextInput
                style={[authStyles.passwordInput, authStyles.textBlack]}
                placeholder="Enter password"
                placeholderTextColor="#989898"
                value={password}
                onChangeText={handlePasswordChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry={!showPassword}
                autoComplete="off"
                textContentType="oneTimeCode"
                autoCorrect={false}
                passwordRules=""
                blurOnSubmit={false}
                onSubmitEditing={() => Keyboard.dismiss()}
                maxLength={INPUT_LIMITS.PASSWORD_MAX}
              />
              <TouchableOpacity
                style={authStyles.showButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text
                  style={
                    showPassword
                      ? authStyles.showButtonTextGrey
                      : authStyles.showButtonText
                  }
                >
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
            <View style={authStyles.passwordRequirements}>
              {[
                {
                  text: '8 characters',
                  met: password.length >= 8,
                },
                {
                  text: '1 uppercase letter',
                  met: /[A-Z]/.test(password),
                },
                {
                  text: '1 lowercase letter',
                  met: /[a-z]/.test(password),
                },
                {
                  text: '1 special character',
                  met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
                },
                {
                  text: '1 number',
                  met: /[0-9]/.test(password),
                },
              ].map((requirement, index) => (
                <View key={index} style={authStyles.requirementRow}>
                  <View
                    style={[
                      authStyles.requirementCircle,
                      requirement.met && authStyles.requirementCircleMet,
                    ]}
                  >
                    <Image
                      source={CHECK_ICON}
                      style={[
                        authStyles.requirementCheckmark,
                        requirement.met
                          ? authStyles.requirementCheckmarkMet
                          : authStyles.requirementCheckmarkUnmet,
                      ]}
                    />
                  </View>
                  <Text style={authStyles.requirementTextDark}>
                    {requirement.text}
                  </Text>
                </View>
              ))}
            </View>
            {passwordError && (
              <Text style={authStyles.errorText}>{passwordError}</Text>
            )}
          </View>

          {/* Hidden dummy TextInput to prevent iOS strong password suggestion */}
          <TextInput
            style={authStyles.hiddenInput}
            autoComplete="off"
            textContentType="none"
          />

          <View>
            <Text style={authStyles.inputLabelDark}>CONFIRM PASSWORD</Text>
            <Animated.View
              style={[
                authStyles.passwordContainer,
                {
                  borderColor: confirmPasswordError
                    ? ERROR_COLOR
                    : confirmPasswordBorderColor,
                  borderWidth: confirmPasswordBorderWidth,
                },
              ]}
            >
              <TextInput
                style={[authStyles.passwordInput, authStyles.textBlack]}
                placeholder="Enter same password"
                placeholderTextColor="#989898"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                secureTextEntry={!showConfirmPassword}
                autoComplete="off"
                textContentType="oneTimeCode"
                autoCorrect={false}
                passwordRules=""
                blurOnSubmit={false}
                onSubmitEditing={() => Keyboard.dismiss()}
                maxLength={INPUT_LIMITS.PASSWORD_MAX}
              />
              <TouchableOpacity
                style={authStyles.showButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text
                  style={
                    showConfirmPassword
                      ? authStyles.showButtonTextGrey
                      : authStyles.showButtonText
                  }
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
            {confirmPasswordError && (
              <Text style={authStyles.errorText}>{confirmPasswordError}</Text>
            )}
          </View>

          <View style={authStyles.buttonContainer}>
            <TouchableOpacity
              style={[
                authStyles.grayButton,
                authStyles.buttonEnabled,
                {
                  opacity:
                    !password ||
                    !confirmPassword ||
                    !isPasswordValid ||
                    isLoading
                      ? 0.5
                      : 1,
                },
              ]}
              disabled={
                !password || !confirmPassword || !isPasswordValid || isLoading
              }
              onPress={handleResetPassword}
              activeOpacity={0.8}
            >
              <Text style={authStyles.grayButtonText}>
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
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
