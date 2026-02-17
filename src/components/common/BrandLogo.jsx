import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../styles/colors';

// Pre-require the logo so bundler includes it
const logoSource = require('../../../assets/logo.png');

/**
 * Brand logo with waveform mark + wordmark "Bigkas".
 * Matches the Figma reference: logo image on left, bold "Bigkas" text on right.
 *
 * @param {Object} props
 * @param {number} [props.size] - Logo mark size in pixels (default: 28).
 * @param {boolean} [props.showText] - Whether to show "Bigkas" text (default: true).
 * @param {Object} [props.style] - Optional wrapper styles.
 */
const BrandLogo = ({ size = 28, showText = true, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={logoSource}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
      {showText && (
        <Text style={[styles.title, { fontSize: size * 0.75 }]}>Bigkas</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});

export default BrandLogo;
