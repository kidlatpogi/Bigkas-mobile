import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TextField from './TextField';
import { colors } from '../../styles/colors';

/**
 * Password field with visibility toggle.
 * @param {Object} props
 * @param {string} props.label - Input label text.
 * @param {string} props.value - Input value.
 * @param {Function} props.onChangeText - Value change handler.
 * @param {string} [props.placeholder] - Placeholder text.
 * @param {string} [props.error] - Error message string.
 */
const PasswordField = ({ label, value, onChangeText, placeholder, error }) => {
  const [isHidden, setIsHidden] = useState(true);

  return (
    <TextField
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={isHidden}
      error={error}
      rightAdornment={
        <TouchableOpacity
          onPress={() => setIsHidden((prev) => !prev)}
          accessibilityRole="button"
          accessibilityLabel={isHidden ? 'Show password' : 'Hide password'}
        >
          <Ionicons
            name={isHidden ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      }
    />
  );
};

export default PasswordField;
