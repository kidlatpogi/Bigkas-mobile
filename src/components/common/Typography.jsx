import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import {
  textStyles as typographyStyles,
  fontWeight as fontWeights,
  fontFamily as fontFamilies,
} from '../../styles/typography';

/**
 * Typography component for consistent text styling
 * @param {Object} props
 * @param {React.ReactNode} props.children - Text content
 * @param {string} [props.variant] - 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodySmall' | 'caption'
 * @param {string} [props.color] - Text color (from colors)
 * @param {string} [props.weight] - 'regular' | 'medium' | 'semibold' | 'bold'
 * @param {string} [props.align] - 'left' | 'center' | 'right'
 * @param {Object} [props.style] - Additional styles
 */
const Typography = ({
  children,
  variant = 'body',
  color = 'textPrimary',
  weight,
  align = 'left',
  style,
  ...props
}) => {
  const weightFamilyMap = {
    regular: fontFamilies.regular,
    medium: fontFamilies.medium,
    semibold: fontFamilies.bold,
    bold: fontFamilies.bold,
  };

  const textStyles = [
    styles.base,
    typographyStyles[variant],
    { color: colors[color] || color },
    weight && { fontWeight: fontWeights[weight], fontFamily: weightFamilyMap[weight] },
    { textAlign: align },
    style,
  ];

  return (
    <Text style={textStyles} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    color: colors.textPrimary,
    fontFamily: fontFamilies.regular,
  },
});

// Convenience components
export const Heading1 = (props) => <Typography variant="h1" {...props} />;
export const Heading2 = (props) => <Typography variant="h2" {...props} />;
export const Heading3 = (props) => <Typography variant="h3" {...props} />;
export const Heading4 = (props) => <Typography variant="h4" {...props} />;
export const Body = (props) => <Typography variant="body" {...props} />;
export const BodySmall = (props) => <Typography variant="bodySmall" {...props} />;
export const Caption = (props) => <Typography variant="caption" {...props} />;

export default Typography;
