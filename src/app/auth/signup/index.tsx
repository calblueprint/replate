import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { DriverSignupData } from '../../../../api/config';
import AuthButton from '../../../components/AuthButton';
import AuthFooterLink from '../../../components/AuthFooterLink';
import AuthInput from '../../../components/AuthInput';
import AuthScreenLayout from '../../../components/AuthScreenLayout';
import PasswordRequirements, {
  isPasswordValid,
} from '../../../components/PasswordRequirements';
import { authStyles } from '../../../styles/authStyles';
import { useAuth } from '../../../utils/AuthContext';
import {
  parseSignupApiErrors,
  showAuthErrorToast,
} from '../../../utils/authErrors';
import {
  INPUT_LIMITS,
  validateEmail,
  validateName,
  validatePasswordMatch,
  validatePhone,
} from '../../../utils/validation';

interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

type FieldKey = keyof SignupForm;
type FieldErrors = Partial<Record<FieldKey, string>>;

const INITIAL_FORM: SignupForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export default function SignupPage() {
  const [form, setForm] = useState<SignupForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();

  const isSubmitDisabled =
    !form.firstName ||
    !form.lastName ||
    !form.email ||
    !form.phone ||
    !form.password ||
    !form.confirmPassword ||
    !isPasswordValid(form.password) ||
    isLoading;

  const updateField = (field: FieldKey, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const next: FieldErrors = { ...prev, [field]: undefined };
      if (field === 'password') {
        next.confirmPassword = form.confirmPassword
          ? (validatePasswordMatch(value, form.confirmPassword) ?? undefined)
          : undefined;
      } else if (field === 'confirmPassword') {
        next.confirmPassword = value
          ? (validatePasswordMatch(form.password, value) ?? undefined)
          : undefined;
      }
      return next;
    });
  };

  const handleSignUp = async () => {
    const nextErrors: FieldErrors = {
      firstName: validateName(form.firstName, 'First name') ?? undefined,
      lastName: validateName(form.lastName, 'Last name') ?? undefined,
      phone: validatePhone(form.phone) ?? undefined,
      email: validateEmail(form.email) ?? undefined,
      password: !form.password ? 'Password is required' : undefined,
      confirmPassword:
        validatePasswordMatch(form.password, form.confirmPassword) ?? undefined,
    };

    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    try {
      setIsLoading(true);
      const signupData: DriverSignupData = {
        email: form.email,
        password: form.password,
        password_confirmation: form.password,
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
      };
      await signup(signupData);
      setTimeout(() => {
        router.replace('/onboarding');
      }, 500);
    } catch (error: unknown) {
      const parsed = parseSignupApiErrors(error);
      if (parsed.toast) {
        showAuthErrorToast(parsed.toast.text1, parsed.toast.text2);
      } else {
        setErrors(parsed.fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthScreenLayout title="Welcome!" subtitle="Please enter your details">
      <View style={authStyles.nameRow}>
        <AuthInput
          halfWidth
          label="NAME"
          placeholder="First name "
          value={form.firstName}
          onChangeText={text => updateField('firstName', text)}
          error={errors.firstName}
          maxLength={INPUT_LIMITS.NAME_MAX}
        />
        <AuthInput
          halfWidth
          label="LAST"
          placeholder="Last name "
          value={form.lastName}
          onChangeText={text => updateField('lastName', text)}
          error={errors.lastName}
          maxLength={INPUT_LIMITS.NAME_MAX}
        />
      </View>

      <AuthInput
        label="EMAIL"
        placeholder="Enter your email"
        value={form.email}
        onChangeText={text => updateField('email', text)}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        maxLength={INPUT_LIMITS.EMAIL_MAX}
      />

      <AuthInput
        label="PHONE"
        placeholder="(123) 456-7890"
        value={form.phone}
        onChangeText={text => updateField('phone', text)}
        error={errors.phone}
        keyboardType="phone-pad"
        maxLength={20}
      />

      <AuthInput
        isPassword
        label="PASSWORD"
        placeholder="Enter password"
        value={form.password}
        onChangeText={text => updateField('password', text)}
        error={errors.password}
        maxLength={INPUT_LIMITS.PASSWORD_MAX}
      >
        <PasswordRequirements password={form.password} />
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
        value={form.confirmPassword}
        onChangeText={text => updateField('confirmPassword', text)}
        error={errors.confirmPassword}
        maxLength={INPUT_LIMITS.PASSWORD_MAX}
      />

      <AuthButton
        label={isLoading ? 'Creating Account...' : 'CONTINUE'}
        disabled={isSubmitDisabled}
        onPress={handleSignUp}
      />

      <AuthFooterLink
        prompt="Already have an account?"
        actionLabel="Sign in"
        onPress={() => router.replace('/auth/login')}
      />
    </AuthScreenLayout>
  );
}
