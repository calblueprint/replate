import React from 'react';
import { Text } from 'react-native';
import { authStyles } from '@/styles/authStyles';

interface AuthFooterLinkProps {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
}

export default function AuthFooterLink({
  prompt,
  actionLabel,
  onPress,
}: AuthFooterLinkProps) {
  return (
    <Text style={authStyles.footerText}>
      {prompt}{' '}
      <Text style={authStyles.footerLink} onPress={onPress}>
        {actionLabel}
      </Text>
    </Text>
  );
}
