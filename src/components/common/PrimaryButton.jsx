import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';
import { textStyles } from '../../styles/typography';

/**
 * Primary button component
 * @param {Object} props
 * @param {string} props.title - Button text
 * @param {Function} props.onPress - Press handler
 * @param {boolean} [props.loading] - Show loading indicator
 * @param {boolean} [props.disabled] - Disable button
 * @param {string} [props.variant] - 'primary' | 'secondary' | 'outline'
 * @param {string} [props.size] - 'small' | 'medium' | 'large'
 * @param {Object} [props.style] - Additional container styles
 * @param {Object} [props.textStyle] - Additional text styles
 */
const PrimaryButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    isDisabled && styles.button_disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    isDisabled && styles.text_disabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.primary : colors.white}
          size="small"
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },

  // Variants
  button_primary: {
    backgroundColor: colors.primary,
  },
  button_secondary: {
    backgroundColor: colors.secondary,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  button_disabled: {
    backgroundColor: colors.gray300,
    borderColor: colors.gray300,
  },

  // Sizes
  button_small: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  button_medium: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  button_large: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },

  // Text styles
  text: {
    ...textStyles.button,
    textAlign: 'center',
  },
  text_primary: {
    color: colors.white,
  },
  text_secondary: {
    color: colors.white,
  },
  text_outline: {
    color: colors.primary,
  },
  text_disabled: {
    color: colors.gray500,
  },
  text_small: {
    fontSize: 14,
  },
  text_medium: {
    fontSize: 16,
  },
  text_large: {
    fontSize: 18,
  },
});

export default PrimaryButton;
