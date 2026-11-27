import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { authStyles } from '@/styles/authStyles';
import colors from '@/styles/colors';

const PASSWORD_RULES: { label: string; test: (password: string) => boolean }[] =
  [
    { label: '8 characters', test: p => p.length >= 8 },
    { label: '1 uppercase letter', test: p => /[A-Z]/.test(p) },
    { label: '1 lowercase letter', test: p => /[a-z]/.test(p) },
    {
      label: '1 special character',
      test: p => /[!@#$%^&*(),.?":{}|<>]/.test(p),
    },
    { label: '1 number', test: p => /[0-9]/.test(p) },
  ];

export function isPasswordValid(password: string): boolean {
  return PASSWORD_RULES.every(rule => rule.test(password));
}

function RequirementRow({ label, met }: { label: string; met: boolean }) {
  return (
    <View style={authStyles.requirementRow}>
      <View
        style={[
          authStyles.requirementCircle,
          met && authStyles.requirementCircleMet,
        ]}
      >
        <Ionicons name="checkmark" size={9} color={colors.white} />
      </View>
      <Text style={authStyles.requirementTextDark}>{label}</Text>
    </View>
  );
}

export default function PasswordRequirements({
  password,
}: {
  password: string;
}) {
  return (
    <View style={authStyles.passwordRequirements}>
      {PASSWORD_RULES.map(rule => (
        <RequirementRow
          key={rule.label}
          label={rule.label}
          met={rule.test(password)}
        />
      ))}
    </View>
  );
}
