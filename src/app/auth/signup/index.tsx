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
import { authStyles } from '../../../styles/authStyles';

export default function SignupPage() {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const firstNameBorderAnim = useRef(new Animated.Value(0)).current;
  const lastNameBorderAnim = useRef(new Animated.Value(0)).current;
  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const phoneBorderAnim = useRef(new Animated.Value(0)).current;
  const passwordBorderAnim = useRef(new Animated.Value(0)).current;
  const confirmPasswordBorderAnim = useRef(new Animated.Value(0)).current;

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

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    const signupData: DriverSignupData = {
      email,
      password,
      password_confirmation: password,
      first_name,
      last_name,
      phone: phone_number,
    };

    router.push({
      pathname: '/auth/signup/npo-selection',
      params: {
        signupData: JSON.stringify(signupData),
      },
    });
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
                    { borderColor: firstNameBorderColor },
                  ]}
                >
                  <TextInput
                    style={authStyles.inputHalfInner}
                    placeholder="First name"
                    value={first_name}
                    onChangeText={setFirstName}
                    autoComplete="off"
                    textContentType="none"
                    autoCorrect={false}
                  />
                </Animated.View>
              </View>
              <View style={authStyles.nameFieldContainer}>
                <Text style={authStyles.inputLabel}>LAST</Text>
                <Animated.View
                  style={[
                    authStyles.inputHalfWrapper,
                    { borderColor: lastNameBorderColor },
                  ]}
                >
                  <TextInput
                    style={authStyles.inputHalfInner}
                    placeholder="Last name"
                    value={last_name}
                    onChangeText={setLastName}
                    autoComplete="off"
                    textContentType="none"
                    autoCorrect={false}
                  />
                </Animated.View>
              </View>
            </View>

            <Text style={authStyles.inputLabel}>EMAIL</Text>
            <Animated.View
              style={[
                authStyles.inputWrapper,
                { borderColor: emailBorderColor },
              ]}
            >
              <TextInput
                style={authStyles.inputInner}
                placeholder="Email@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="off"
                textContentType="none"
                autoCorrect={false}
              />
            </Animated.View>

            <Text style={authStyles.inputLabel}>PHONE</Text>
            <Animated.View
              style={[
                authStyles.inputWrapper,
                { borderColor: phoneBorderColor },
              ]}
            >
              <TextInput
                style={authStyles.inputInner}
                placeholder="(123) 456-7890"
                value={phone_number}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                autoComplete="off"
                textContentType="none"
                autoCorrect={false}
              />
            </Animated.View>

            <Text style={authStyles.inputLabel}>PASSWORD</Text>
            <Animated.View
              style={[
                authStyles.passwordContainer,
                { borderColor: passwordBorderColor },
              ]}
            >
              <TextInput
                style={authStyles.passwordInput}
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
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

            <Text style={authStyles.inputLabel}>CONFIRM PASSWORD</Text>
            <Animated.View
              style={[
                authStyles.passwordContainer,
                { borderColor: confirmPasswordBorderColor },
              ]}
            >
              <TextInput
                style={authStyles.passwordInput}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
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

            <View style={authStyles.buttonContainer}>
              <Button
                text="Continue"
                disabled={
                  !email ||
                  !password ||
                  !confirmPassword ||
                  !first_name ||
                  !last_name ||
                  !phone_number
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
