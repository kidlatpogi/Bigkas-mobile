import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Typography from './Typography';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';
import { fontSize } from '../../styles/typography';

/**
 * Reusable text input with label, error, and right adornment.
 * @param {Object} props
 * @param {string} props.label - Input label text.
 * @param {string} props.value - Input value.
 * @param {Function} props.onChangeText - Value change handler.
 * @param {string} [props.placeholder] - Placeholder text.
 * @param {string} [props.keyboardType] - Keyboard type.
 * @param {boolean} [props.autoCorrect] - Auto-correct toggle.
 * @param {string} [props.autoCapitalize] - Auto-capitalization mode.
 * @param {boolean} [props.secureTextEntry] - Secure entry for passwords.
 * @param {string} [props.error] - Error message string.
 * @param {Object} [props.containerStyle] - Wrapper style overrides.
 * @param {Object} [props.inputStyle] - Input style overrides.
 * @param {React.ReactNode} [props.rightAdornment] - Right-side icon or action.
 */
const TextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCorrect = false,
  autoCapitalize = 'none',
  secureTextEntry = false,
  error,
  containerStyle,
  inputStyle,
  rightAdornment,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Typography variant="bodySmall" style={styles.label}>
        {label}
      </Typography>
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCorrect={autoCorrect}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
        />
        {rightAdornment ? <View style={styles.adornment}>{rightAdornment}</View> : null}
      </View>
      {error ? (
        <Typography variant="caption" color="error" style={styles.errorText}>
          {error}
        </Typography>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.textSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.25,
    borderColor: colors.borderDark,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    minHeight: 52,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  adornment: {
    marginLeft: spacing.sm,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    marginTop: spacing.xs,
  },
});

export default TextField;
