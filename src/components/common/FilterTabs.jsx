import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Typography from './Typography';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * Filter tabs component for switching between content types.
 * Used in Scripts screen for Self-Authored vs Auto-Generated filter.
 * 
 * @param {Object} props
 * @param {Array<{value: string, label: string}>} props.tabs - Array of tab options
 * @param {string} props.selected - Currently selected tab value
 * @param {Function} props.onSelect - Callback when a tab is selected
 * @param {Object} [props.containerStyle] - Optional container style override
 * @param {Object} [props.tabStyle] - Optional tab style override
 * @param {Object} [props.activeTabStyle] - Optional active tab style override
 * @param {Object} [props.labelStyle] - Optional label style override
 * @param {Object} [props.activeLabelStyle] - Optional active label style override
 * 
 * Variables for web version:
 * - tabs: array of objects with {value, label}
 * - selected: current active tab value
 * - onSelect: handler function receiving selected value
 */
const FilterTabs = ({
  tabs = [],
  selected,
  onSelect,
  containerStyle,
  tabStyle,
  activeTabStyle,
  labelStyle,
  activeLabelStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {tabs.map((tab) => {
        const isActive = selected === tab.value;
        return (
          <TouchableOpacity
            key={tab.value}
            style={[
              styles.tab,
              tabStyle,
              isActive && styles.tabActive,
              isActive && activeTabStyle,
            ]}
            onPress={() => onSelect(tab.value)}
            activeOpacity={0.7}
          >
            <Typography
              variant="bodySmall"
              weight="medium"
              color={isActive ? 'black' : 'textSecondary'}
              style={[styles.tabLabel, labelStyle, isActive && activeLabelStyle]}
            >
              {tab.label}
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
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.gray300,
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    fontSize: 13,
  },
});

export default FilterTabs;
