import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Typography from './Typography';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * ChoiceChips component for single-select pill options.
 *
 * @param {Object} props
 * @param {Array<{value: string, label: string}>} props.options - Array of chip options
 * @param {string} props.selected - Currently selected value
 * @param {Function} props.onSelect - Callback when chip selected
 * @param {Object} [props.containerStyle] - Optional container style override
 * @param {Object} [props.chipStyle] - Optional chip style override
 * @param {Object} [props.activeChipStyle] - Optional active chip style override
 * @param {Object} [props.labelStyle] - Optional label style override
 * @param {Object} [props.activeLabelStyle] - Optional active label style override
 */
const ChoiceChips = ({
  options = [],
  selected,
  onSelect,
  containerStyle,
  chipStyle,
  activeChipStyle,
  labelStyle,
  activeLabelStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {options.map((option) => {
        const isActive = selected === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.chip,
              chipStyle,
              isActive && styles.chipActive,
              isActive && activeChipStyle,
            ]}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.7}
          >
            <Typography
              variant="bodySmall"
              weight="medium"
              color={isActive ? 'black' : 'textSecondary'}
              style={[labelStyle, isActive && activeLabelStyle]}
            >
              {option.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});

export default ChoiceChips;
