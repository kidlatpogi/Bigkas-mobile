import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
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
        <Image
          source={require('../../../assets/Google-Logo.png')}
          style={styles.googleIcon}
          resizeMode="contain"
        />
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
  googleIcon: {
    width: 20,
    height: 20,
  },
  text: {
    ...textStyles.body,
    color: colors.textPrimary,
    fontFamily: fontFamily.medium,
  },
});

export default SocialButton;
