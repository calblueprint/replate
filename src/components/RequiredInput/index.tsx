import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from './styles';

interface RequiredInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  isPicker?: boolean;
  options?: { label: string; value: string }[];
}

export default function RequiredInput({
  label,
  placeholder,
  value,
  onChangeText,
  required,
  isPicker,
  options,
}: RequiredInputProps) {
  const [focused, setFocused] = useState(false);
  const hasError = required && value.trim().length === 0;

  return (
    <View style={[styles.container, hasError && styles.errorBorder]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredText}>*required</Text>}
      </View>

      {isPicker ? (
        <View style={[styles.input, focused && styles.focusBorder]}>
          <Picker
            selectedValue={value}
            onValueChange={onChangeText}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={styles.picker}
          >
            <Picker.Item label={placeholder ?? ''} value="" />
            {options?.map(opt => (
              <Picker.Item
                key={opt.value}
                label={opt.label}
                value={opt.value}
              />
            ))}
          </Picker>
        </View>
      ) : (
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, focused && styles.focusBorder]}
        />
      )}
    </View>
  );
}
