import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { DriverSignupData } from '../../../../api/config';
import Button from '../../../components/Button/Button';
import { authStyles, ERROR_COLOR } from '../../../styles/authStyles';
import { useAuth } from '../../../utils/AuthContext';
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordMatch,
  validatePhone,
} from '../../../utils/validation';

interface ApiErrorResponse {
  message?: string;
  errors?: string[];
  status?: number;
}

export default function SignupPage() {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Error states
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  const firstNameBorderAnim = useRef(new Animated.Value(0)).current;
  const lastNameBorderAnim = useRef(new Animated.Value(0)).current;
  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const phoneBorderAnim = useRef(new Animated.Value(0)).current;
  const passwordBorderAnim = useRef(new Animated.Value(0)).current;
  const confirmPasswordBorderAnim = useRef(new Animated.Value(0)).current;

  const { signup } = useAuth();

  useEffect(() => {
    Animated.timing(firstNameBorderAnim, {
      toValue: first_name ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [first_name]);

  useEffect(() => {
    Animated.timing(lastNameBorderAnim, {
      toValue: last_name ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [last_name]);

  useEffect(() => {
    Animated.timing(emailBorderAnim, {
      toValue: email ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [email]);

  useEffect(() => {
    Animated.timing(phoneBorderAnim, {
      toValue: phone_number ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [phone_number]);

  useEffect(() => {
    Animated.timing(passwordBorderAnim, {
      toValue: password ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [password]);

  useEffect(() => {
    Animated.timing(confirmPasswordBorderAnim, {
      toValue: confirmPassword ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [confirmPassword]);

  const firstNameBorderColor = firstNameBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E5E5', '#000000'],
  });

  const lastNameBorderColor = lastNameBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E5E5', '#000000'],
  });

  const emailBorderColor = emailBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E5E5', '#000000'],
  });

  const phoneBorderColor = phoneBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E5E5', '#000000'],
  });

  const passwordBorderColor = passwordBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E5E5', '#000000'],
  });

  const confirmPasswordBorderColor = confirmPasswordBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E5E5', '#000000'],
  });

  const handleSignUp = async () => {
    // Clear previous errors
    setFirstNameError(null);
    setLastNameError(null);
    setPhoneError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    // Run all validations
    const firstNameErr = validateName(first_name, 'First name');
    const lastNameErr = validateName(last_name, 'Last name');
    const phoneErr = validatePhone(phone_number);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmPasswordErr = validatePasswordMatch(password, confirmPassword);

    // Set errors
    setFirstNameError(firstNameErr);
    setLastNameError(lastNameErr);
    setPhoneError(phoneErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);

    // If any errors exist, don't proceed
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
        password_confirmation: password,
        first_name,
        last_name,
        phone: phone_number,
      };

      await signup(signupData);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account created successfully!',
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
      const errorsArray: string[] =
        'errors' in apiError && Array.isArray(apiError.errors)
          ? apiError.errors.filter((e): e is string => typeof e === 'string')
          : [];
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

      // Parse errors and map to specific fields
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

        // Email errors
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
        }
        // Password errors
        else if (errLower.includes('password')) {
          hasFieldErrors = true;
          if (errLower.includes('too short') || errLower.includes('minimum')) {
            setPasswordError('Password must be at least 8 characters long.');
          } else if (
            errLower.includes('complexity') ||
            errLower.includes('weak')
          ) {
            setPasswordError(
              'Password is too weak. Please use a stronger password.',
            );
          } else {
            setPasswordError(err);
          }
        }
        // Phone errors
        else if (errLower.includes('phone')) {
          hasFieldErrors = true;
          if (errLower.includes('invalid')) {
            setPhoneError('Please enter a valid phone number.');
          } else {
            setPhoneError(err);
          }
        }
        // Name errors
        else if (
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

      // If no specific field errors, show generic error toast
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

  // Clear errors when user starts typing
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
    if (confirmPasswordError && text === confirmPassword) {
      setConfirmPasswordError(null);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordError) setConfirmPasswordError(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SafeAreaView style={authStyles.container}>
        <ScrollView
          contentContainerStyle={authStyles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.formCard}>
            <Text style={authStyles.title}>Let's get started</Text>
            <Text style={authStyles.subtitle}>Please input your details</Text>

            <View style={authStyles.nameRow}>
              <View style={authStyles.nameFieldContainer}>
                <Text style={authStyles.inputLabel}>NAME</Text>
                <Animated.View
                  style={[
                    authStyles.inputHalfWrapper,
                    {
                      borderColor: firstNameError
                        ? ERROR_COLOR
                        : firstNameBorderColor,
                    },
                  ]}
                >
                  <TextInput
                    style={authStyles.inputHalfInner}
                    placeholder="First name"
                    value={first_name}
                    onChangeText={handleFirstNameChange}
                    autoComplete="off"
                    textContentType="none"
                    autoCorrect={false}
                  />
                </Animated.View>
                {firstNameError && (
                  <Text style={authStyles.errorText}>{firstNameError}</Text>
                )}
              </View>
              <View style={authStyles.nameFieldContainer}>
                <Text style={authStyles.inputLabel}>LAST</Text>
                <Animated.View
                  style={[
                    authStyles.inputHalfWrapper,
                    {
                      borderColor: lastNameError
                        ? ERROR_COLOR
                        : lastNameBorderColor,
                    },
                  ]}
                >
                  <TextInput
                    style={authStyles.inputHalfInner}
                    placeholder="Last name"
                    value={last_name}
                    onChangeText={handleLastNameChange}
                    autoComplete="off"
                    textContentType="none"
                    autoCorrect={false}
                  />
                </Animated.View>
                {lastNameError && (
                  <Text style={authStyles.errorText}>{lastNameError}</Text>
                )}
              </View>
            </View>

            <Text style={authStyles.inputLabel}>EMAIL</Text>
            <Animated.View
              style={[
                authStyles.inputWrapper,
                { borderColor: emailError ? ERROR_COLOR : emailBorderColor },
              ]}
            >
              <TextInput
                style={authStyles.inputInner}
                placeholder="Email@gmail.com"
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

            <Text style={authStyles.inputLabel}>PHONE</Text>
            <Animated.View
              style={[
                authStyles.inputWrapper,
                { borderColor: phoneError ? ERROR_COLOR : phoneBorderColor },
              ]}
            >
              <TextInput
                style={authStyles.inputInner}
                placeholder="(123) 456-7890"
                value={phone_number}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                autoComplete="off"
                textContentType="none"
                autoCorrect={false}
              />
            </Animated.View>
            {phoneError && (
              <Text style={authStyles.errorText}>{phoneError}</Text>
            )}

            <Text style={authStyles.inputLabel}>PASSWORD</Text>
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
                style={authStyles.passwordInput}
                placeholder="Enter password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                autoComplete="off"
                textContentType="none"
                autoCorrect={false}
                passwordRules=""
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

            <Text style={authStyles.inputLabel}>CONFIRM PASSWORD</Text>
            <Animated.View
              style={[
                authStyles.passwordContainer,
                {
                  borderColor: confirmPasswordError
                    ? ERROR_COLOR
                    : confirmPasswordBorderColor,
                },
              ]}
            >
              <TextInput
                style={authStyles.passwordInput}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry={!showConfirmPassword}
                autoComplete="off"
                textContentType="none"
                autoCorrect={false}
                passwordRules=""
              />
              <TouchableOpacity
                style={authStyles.showButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={authStyles.showButtonText}>Show</Text>
              </TouchableOpacity>
            </Animated.View>
            {confirmPasswordError && (
              <Text style={authStyles.errorText}>{confirmPasswordError}</Text>
            )}

            <View style={authStyles.buttonContainer}>
              <Button
                text={isLoading ? 'Creating Account...' : 'Continue'}
                disabled={
                  !email ||
                  !password ||
                  !confirmPassword ||
                  !first_name ||
                  !last_name ||
                  !phone_number ||
                  isLoading
                }
                onPress={handleSignUp}
              />
            </View>

            <Text style={authStyles.linkText}>
              Already have an account?{' '}
              <Text
                style={authStyles.link}
                onPress={() => router.push('/auth/login')}
              >
                Sign in
              </Text>
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
