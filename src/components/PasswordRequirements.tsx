import React from 'react';
import { Image, Text, View } from 'react-native';
import colors from '@/styles/colors';
import CHECK_ICON from '~/assets/check-icon.png';

interface PasswordRequirementsProps {
  password: string;
}

const REQUIREMENTS = [
  { text: '8 characters', test: (p: string) => p.length >= 8 },
  { text: '1 uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { text: '1 lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  {
    text: '1 special character',
    test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
  { text: '1 number', test: (p: string) => /[0-9]/.test(p) },
];

export default function PasswordRequirements({
  password,
}: PasswordRequirementsProps) {
  return (
    <View className="-mt-1.5 mb-0.5">
      {REQUIREMENTS.map(req => {
        const met = req.test(password);
        return (
          <View
            key={req.text}
            className="flex-row items-center mb-0.5"
            accessibilityLabel={`${req.text} - ${met ? 'met' : 'not met'}`}
          >
            <View
              className={`w-[11px] h-[11px] rounded-full mr-2 justify-center items-center ${
                met ? 'bg-primary-400' : 'bg-neutral-400'
              }`}
            >
              <Image
                source={CHECK_ICON}
                className="w-[9px] h-[9px]"
                style={
                  met
                    ? { tintColor: colors.white, opacity: 1 }
                    : { tintColor: colors.neutral[400], opacity: 0.5 }
                }
              />
            </View>
            <Text className="text-xs font-body text-neutral-600 leading-[19.2px]">
              {req.text}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

/** Check if all password requirements are met */
export function isPasswordValid(password: string): boolean {
  return REQUIREMENTS.every(r => r.test(password));
}
