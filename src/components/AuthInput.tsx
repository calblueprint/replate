import React, { useState } from 'react';
import {
  Keyboard,
  NativeSyntheticEvent,
  TargetedEvent,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { authStyles, ERROR_COLOR } from '@/styles/authStyles';
import colors from '@/styles/colors';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string | null;
  isPassword?: boolean;
  halfWidth?: boolean;
  children?: React.ReactNode;
}

export default function AuthInput({
  label,
  error,
  isPassword = false,
  halfWidth = false,
  children,
  onFocus,
  onBlur,
  placeholderTextColor = colors.textTertiary,
  ...textInputProps
}: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = (e: NativeSyntheticEvent<TargetedEvent>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TargetedEvent>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const borderStyle = {
    borderColor: error
      ? ERROR_COLOR
      : isFocused
        ? colors.primaryGreen
        : colors.borderPrimary,
    borderWidth: isFocused ? 1.5 : 0.8,
  };

  const wrapperStyle = isPassword
    ? authStyles.passwordContainer
    : halfWidth
      ? authStyles.inputHalfWrapper
      : authStyles.inputWrapper;

  const inputStyle = isPassword
    ? authStyles.passwordInput
    : halfWidth
      ? authStyles.inputHalfInner
      : authStyles.inputInner;

  const toggleAccessibilityLabel = `${isPasswordVisible ? 'Hide' : 'Show'} ${label.toLowerCase()}`;

  return (
    <View style={halfWidth ? authStyles.nameFieldContainer : undefined}>
      <Text style={authStyles.inputLabelDark}>{label}</Text>
      <View style={[wrapperStyle, borderStyle]}>
        <TextInput
          style={[inputStyle, authStyles.textBlack]}
          placeholderTextColor={placeholderTextColor}
          autoComplete="off"
          textContentType={isPassword ? 'oneTimeCode' : 'none'}
          autoCorrect={false}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...(isPassword
            ? {
                secureTextEntry: !isPasswordVisible,
                passwordRules: '',
                blurOnSubmit: false,
                onSubmitEditing: () => Keyboard.dismiss(),
              }
            : null)}
          {...textInputProps}
        />
        {isPassword && (
          <TouchableOpacity
            style={authStyles.showButton}
            onPress={() => setIsPasswordVisible(prev => !prev)}
            accessibilityLabel={toggleAccessibilityLabel}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>
      {children}
      {error && <Text style={authStyles.errorText}>{error}</Text>}
    </View>
  );
}
