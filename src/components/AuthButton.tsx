import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { authStyles } from '@/styles/authStyles';

interface AuthButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function AuthButton({
  label,
  onPress,
  disabled = false,
}: AuthButtonProps) {
  return (
    <View style={authStyles.buttonContainer}>
      <TouchableOpacity
        style={[
          authStyles.primaryButton,
          disabled && authStyles.buttonDisabled,
        ]}
        disabled={disabled}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={authStyles.primaryButtonText}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}
