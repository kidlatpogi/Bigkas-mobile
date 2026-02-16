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
 * 
 * Variables for web version:
 * - tabs: array of objects with {value, label}
 * - selected: current active tab value
 * - onSelect: handler function receiving selected value
 */
const FilterTabs = ({ tabs = [], selected, onSelect }) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.value}
          style={[
            styles.tab,
            selected === tab.value && styles.tabActive,
          ]}
          onPress={() => onSelect(tab.value)}
          activeOpacity={0.7}
        >
          <Typography
            variant="bodySmall"
            weight="medium"
            color={selected === tab.value ? 'black' : 'textSecondary'}
          >
            {tab.label}
          </Typography>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.xs / 2,
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
});

export default FilterTabs;
