import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * Card component for content containers
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.variant] - 'elevated' | 'outlined' | 'filled'
 * @param {Object} [props.style] - Additional styles
 * @param {number} [props.padding] - Custom padding
 */
const Card = ({
  children,
  variant = 'elevated',
  style,
  padding = spacing.md,
  ...props
}) => {
  const cardStyles = [
    styles.card,
    styles[`card_${variant}`],
    { padding },
    style,
  ];

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },

  // Variants
  card_elevated: {
    backgroundColor: colors.surface,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card_outlined: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  card_filled: {
    backgroundColor: colors.backgroundSecondary,
  },
});

export default Card;
