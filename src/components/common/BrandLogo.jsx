import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { textStyles } from '../../styles/typography';

/**
 * Brand logo mark + wordmark for consistent auth headers.
 * @param {Object} props
 * @param {string} [props.title] - Brand name text.
 * @param {Object} [props.style] - Optional wrapper styles.
 */
const BrandLogo = ({ title = 'Bigkas', style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.mark}>
        <View style={[styles.bar, styles.barSm]} />
        <View style={[styles.bar, styles.barMd]} />
        <View style={[styles.bar, styles.barLg]} />
        <View style={[styles.bar, styles.barMd]} />
        <View style={[styles.bar, styles.barSm]} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mark: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: spacing.sm,
  },
  bar: {
    width: 4,
    marginHorizontal: 1,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  barSm: {
    height: 10,
  },
  barMd: {
    height: 16,
  },
  barLg: {
    height: 22,
  },
  title: {
    ...textStyles.h3,
    color: colors.textPrimary,
  },
});

export default BrandLogo;
