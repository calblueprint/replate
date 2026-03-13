import React, { forwardRef, useEffect, useState } from 'react';
import {
  Animated,
  Pressable,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import ReAnimated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useAnimatedBorder } from '@/hooks/useAnimatedBorder';
import colors from '@/styles/colors';

interface FormInputProps extends Omit<TextInputProps, 'onFocus' | 'onBlur'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string | null;
  secureTextEntry?: boolean;
  showToggle?: boolean;
}

const SHAKE_DURATION = 50;

const FormInput = forwardRef<TextInput, FormInputProps>(function FormInput(
  { label, value, onChangeText, error, secureTextEntry, showToggle, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry ?? false);
  const { borderColor, borderWidth } = useAnimatedBorder(focused, !!error);

  const shakeX = useSharedValue(0);

  useEffect(() => {
    if (error) {
      shakeX.value = withSequence(
        withTiming(-6, { duration: SHAKE_DURATION }),
        withTiming(6, { duration: SHAKE_DURATION }),
        withTiming(-4, { duration: SHAKE_DURATION }),
        withTiming(4, { duration: SHAKE_DURATION }),
        withTiming(0, { duration: SHAKE_DURATION }),
      );
    }
  }, [error, shakeX]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  return (
    <View className="mb-4">
      <Animated.Text className="text-xs font-label text-neutral-600 mb-2 uppercase tracking-wider">
        {label}
      </Animated.Text>
      <ReAnimated.View style={shakeStyle}>
        <Animated.View
          className="flex-row items-center rounded-lg bg-white"
          style={{ borderColor, borderWidth }}
          accessibilityLabel={`${label} input field`}
        >
          <TextInput
            ref={ref}
            className="flex-1 p-3 text-sm font-body text-neutral-900 min-h-[48px]"
            placeholderTextColor={colors.neutral[400]}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            secureTextEntry={hidden}
            accessibilityLabel={label}
            {...rest}
          />
          {showToggle && (
            <Pressable
              className="p-3 min-h-[48px] justify-center"
              onPress={() => setHidden(h => !h)}
              accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
              accessibilityRole="button"
            >
              <Ionicons
                name={hidden ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.neutral[500]}
              />
            </Pressable>
          )}
        </Animated.View>
      </ReAnimated.View>
      {error && (
        <Animated.Text
          className="text-xs font-body text-error mt-1 ml-0.5"
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          {error}
        </Animated.Text>
      )}
    </View>
  );
});

export default FormInput;
