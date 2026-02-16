import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';
import { textStyles, fontFamily } from '../../styles/typography';

/**
 * Social sign-in button with icon and outline style.
 * @param {Object} props
 * @param {string} props.title - Button label text.
 * @param {Function} props.onPress - Press handler.
 * @param {Object} [props.style] - Container style overrides.
 */
const SocialButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconWrap}>
        <FontAwesome name="google" size={18} color="#DB4437" />
      </View>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1.25,
    borderColor: colors.borderDark,
    backgroundColor: colors.white,
  },
  iconWrap: {
    marginRight: spacing.sm,
  },
  text: {
    ...textStyles.body,
    color: colors.textPrimary,
    fontFamily: fontFamily.medium,
  },
});

export default SocialButton;
