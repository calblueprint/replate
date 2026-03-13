import React, { useEffect, useState } from 'react';
import { Animated, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import ReAnimated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAnimatedBorder } from '@/hooks/useAnimatedBorder';
import colors from '@/styles/colors';

interface RequiredInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  isPicker?: boolean;
  options?: { label: string; value: string }[];
  error?: string | null;
}

const SHAKE_DURATION = 50;

export default function RequiredInput({
  label,
  placeholder,
  value,
  onChangeText,
  required,
  isPicker,
  options,
  error,
}: RequiredInputProps) {
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const hasError = required && touched && value.trim().length === 0;
  const showError = hasError || !!error;

  const { borderColor, borderWidth } = useAnimatedBorder(focused, showError);

  const shakeX = useSharedValue(0);

  useEffect(() => {
    if (showError) {
      shakeX.value = withSequence(
        withTiming(-6, { duration: SHAKE_DURATION }),
        withTiming(6, { duration: SHAKE_DURATION }),
        withTiming(-4, { duration: SHAKE_DURATION }),
        withTiming(4, { duration: SHAKE_DURATION }),
        withTiming(0, { duration: SHAKE_DURATION }),
      );
    }
  }, [showError, shakeX]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const errorMessage = error || (hasError ? `${label} is required` : null);

  return (
    <View className="mb-4">
      <View className="flex-row items-center gap-1.5 mb-1.5">
        <Text className="text-xs text-neutral-600 font-label uppercase tracking-wider">
          {label}
        </Text>
        {required && (
          <Text className="text-error text-xs font-body-medium">*</Text>
        )}
      </View>

      <ReAnimated.View style={shakeStyle}>
        {isPicker ? (
          <DropDownPicker
            open={open}
            value={value}
            items={options || []}
            setOpen={setOpen}
            setValue={callback => onChangeText(callback(value))}
            listMode="SCROLLVIEW"
            placeholder={placeholder}
            style={{
              borderWidth: 0.8,
              borderColor: showError
                ? colors.error.main
                : focused
                  ? colors.primary[300]
                  : open
                    ? colors.primary[600] + 'B2'
                    : colors.neutral[300],
              borderRadius: 8,
              paddingVertical: 14,
              paddingHorizontal: 16,
              backgroundColor: 'white',
            }}
            dropDownContainerStyle={{
              borderColor: colors.neutral[200],
              borderRadius: 7,
            }}
            textStyle={{
              fontSize: 14,
              color: colors.neutral[900],
              fontFamily: 'Lato-Regular',
            }}
            selectedItemContainerStyle={{
              backgroundColor: colors.primary[200],
            }}
            selectedItemLabelStyle={{
              color: colors.neutral[900],
              fontFamily: 'Lato-Bold',
              fontSize: 14,
            }}
            onOpen={() => setFocused(true)}
            onClose={() => {
              setFocused(false);
              setTouched(true);
            }}
          />
        ) : (
          <Animated.View
            className="flex-row items-center rounded-lg bg-white"
            style={{ borderColor, borderWidth }}
            accessibilityLabel={`${label} input field`}
          >
            <TextInput
              placeholder={placeholder}
              value={value}
              onChangeText={onChangeText}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                setFocused(false);
                setTouched(true);
              }}
              className="flex-1 p-3 text-sm font-body text-neutral-900 min-h-[48px]"
              placeholderTextColor={colors.neutral[400]}
              accessibilityLabel={`${label}${required ? ', required' : ''}`}
            />
          </Animated.View>
        )}
      </ReAnimated.View>

      {errorMessage && (
        <Animated.Text
          className="text-xs font-body text-error mt-1 ml-0.5"
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          {errorMessage}
        </Animated.Text>
      )}
    </View>
  );
}
