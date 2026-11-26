import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { authStyles } from '../styles/authStyles';
import colors from '../styles/colors';

export function isPasswordValid(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password) &&
    /[0-9]/.test(password)
  );
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
      <RequirementRow label="8 characters" met={password.length >= 8} />
      <RequirementRow label="1 uppercase letter" met={/[A-Z]/.test(password)} />
      <RequirementRow label="1 lowercase letter" met={/[a-z]/.test(password)} />
      <RequirementRow
        label="1 special character"
        met={/[!@#$%^&*(),.?":{}|<>]/.test(password)}
      />
      <RequirementRow label="1 number" met={/[0-9]/.test(password)} />
    </View>
  );
}
