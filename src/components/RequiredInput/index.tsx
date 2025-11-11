import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
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
  const [open, setOpen] = useState(false);
  const hasError = required && value.trim().length === 0;

  return (
    <View style={[styles.container, hasError && styles.errorBorder]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredText}>*required</Text>}
      </View>

      {isPicker ? (
        <DropDownPicker
          open={open}
          value={value}
          items={options || []}
          setOpen={setOpen}
          setValue={callback => onChangeText(callback(value))}
          placeholder={placeholder}
          style={[
            styles.input,
            focused && styles.focusBorder,
            { borderColor: open ? '#77C29F' : '#E0E0E0' },
          ]}
          dropDownContainerStyle={{
            borderColor: '#E0E0E0',
            borderRadius: 20,
          }}
          textStyle={{
            fontSize: 16,
            color: '#000',
          }}
          onOpen={() => setFocused(true)}
          onClose={() => setFocused(false)}
        />
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
