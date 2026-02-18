import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../styles/colors';
import { borderRadius } from '../../styles/spacing';

/**
 * Consistent circular back button used across all screens.
 *
 * Design: 48×48 circle, light gray border (#E0E0E0), white background,
 * dark arrow-back icon (22px). Based on Figma reference.
 *
 * @param {Object} props
 * @param {Function} [props.onPress] - Custom press handler. Defaults to navigation.goBack().
 * @param {Object} [props.style]    - Additional container style overrides.
 */
const BackButton = ({ onPress, style }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Ionicons name="arrow-back" size={22} color={colors.black} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BackButton;
