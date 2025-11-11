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
import { DriverSignupData } from '../../../../api/config';
import CHECK_ICON from '../../../../assets/check-icon.png';
// Assets
import SIGNUP_LOGO from '../../../../assets/signup-logo.png';
import { authStyles, ERROR_COLOR } from '../../../styles/authStyles';
import { useAuth } from '../../../utils/AuthContext';
import {
  validateEmail,
  validateName,
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

  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

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
    outputRange: ['#a9a9a9', '#a9a9a9'],
  });

  const lastNameBorderColor = lastNameBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#a9a9a9', '#a9a9a9'],
  });

  const emailBorderColor = emailBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#a9a9a9', '#a9a9a9'],
  });

  const phoneBorderColor = phoneBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#a9a9a9', '#a9a9a9'],
  });

  const passwordBorderColor = passwordBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#a9a9a9', '#a9a9a9'],
  });

  const confirmPasswordBorderColor = confirmPasswordBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#a9a9a9', '#a9a9a9'],
  });

  const handleSignUp = async () => {
    // Clear previous errors
    setFirstNameError(null);
    setLastNameError(null);
    setPhoneError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    // Run all validations (skip password complexity since button is disabled until valid)
    const firstNameErr = validateName(first_name, 'First name');
    const lastNameErr = validateName(last_name, 'Last name');
    const phoneErr = validatePhone(phone_number);
    const emailErr = validateEmail(email);
    // Only check if password is required, not complexity (handled by button disable)
    const passwordErr = !password ? 'Password is required' : null;
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
        // Password errors - only show non-complexity errors (complexity handled by requirements list)
        else if (
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

  // Check if all password requirements are met
  const isPasswordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          {
            padding: 20,
            paddingTop: 40,
            paddingBottom: Math.max(insets.bottom + 40, 60),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
        keyboardDismissMode="interactive"
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
      >
        <View style={authStyles.formCard}>
          {/* Logo */}
          <View style={authStyles.logoContainer}>
            <Image source={SIGNUP_LOGO} style={authStyles.logoImage} />
          </View>

          <Text style={authStyles.titleCentered}>Welcome!</Text>
          <Text style={authStyles.subtitleCentered}>
            Please enter your details
          </Text>

          <View style={authStyles.nameRow}>
            <View style={authStyles.nameFieldContainer}>
              <Text style={authStyles.inputLabelDark}>NAME</Text>
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
                  style={[authStyles.inputHalfInner, { color: '#000' }]}
                  placeholder="First name "
                  placeholderTextColor="#989898"
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
              <Text style={authStyles.inputLabelDark}>LAST</Text>
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
                  style={[authStyles.inputHalfInner, { color: '#000' }]}
                  placeholder="Last name "
                  placeholderTextColor="#989898"
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

          <View>
            <Text style={authStyles.inputLabelDark}>EMAIL</Text>
            <Animated.View
              style={[
                authStyles.inputWrapper,
                { borderColor: emailError ? ERROR_COLOR : emailBorderColor },
              ]}
            >
              <TextInput
                style={[authStyles.inputInner, { color: '#000' }]}
                placeholder="Email@gmail.com"
                placeholderTextColor="#989898"
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
          </View>

          <View>
            <Text style={authStyles.inputLabelDark}>PHONE</Text>
            <Animated.View
              style={[
                authStyles.inputWrapper,
                { borderColor: phoneError ? ERROR_COLOR : phoneBorderColor },
              ]}
            >
              <TextInput
                style={[authStyles.inputInner, { color: '#000' }]}
                placeholder="(123) 456-7890"
                placeholderTextColor="#989898"
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
          </View>

          <View>
            <Text style={authStyles.inputLabelDark}>PASSWORD</Text>
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
                style={[authStyles.passwordInput, { color: '#000' }]}
                placeholder="Enter password"
                placeholderTextColor="#989898"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                autoComplete="off"
                textContentType="oneTimeCode"
                autoCorrect={false}
                passwordRules=""
                blurOnSubmit={false}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <TouchableOpacity
                style={authStyles.showButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={authStyles.showButtonText}>Show</Text>
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
                        !requirement.met && {
                          tintColor: '#898989',
                          opacity: 0.5,
                        },
                      ]}
                    />
                  </View>
                  <Text style={authStyles.requirementTextDark}>
                    {requirement.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Hidden dummy TextInput to prevent iOS strong password suggestion */}
          <TextInput
            style={{ height: 0.1, opacity: 0, position: 'absolute' }}
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
                },
              ]}
            >
              <TextInput
                style={[authStyles.passwordInput, { color: '#000' }]}
                placeholder="Enter same password"
                placeholderTextColor="#989898"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry={!showConfirmPassword}
                autoComplete="off"
                textContentType="oneTimeCode"
                autoCorrect={false}
                passwordRules=""
                blurOnSubmit={false}
                onSubmitEditing={() => Keyboard.dismiss()}
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
          </View>

          <View style={authStyles.buttonContainer}>
            <TouchableOpacity
              style={[
                authStyles.grayButton,
                {
                  opacity:
                    !email ||
                    !password ||
                    !confirmPassword ||
                    !first_name ||
                    !last_name ||
                    !phone_number ||
                    !isPasswordValid ||
                    isLoading
                      ? 0.5
                      : 1,
                },
              ]}
              disabled={
                !email ||
                !password ||
                !confirmPassword ||
                !first_name ||
                !last_name ||
                !phone_number ||
                !isPasswordValid ||
                isLoading
              }
              onPress={handleSignUp}
              activeOpacity={0.8}
            >
              <Text style={authStyles.grayButtonText}>
                {isLoading ? 'Creating Account...' : 'Continue '}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={authStyles.linkTextSignup}>
            Already have an account?{' '}
            <Text
              style={authStyles.linkSignup}
              onPress={() => router.push('/auth/login')}
            >
              Sign in
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
