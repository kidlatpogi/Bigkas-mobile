import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Typography from './Typography';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * Time range selector component with pill-style tabs.
 * Used in progress tracking to filter by week/month/year.
 * 
 * @param {Object} props
 * @param {('week'|'month'|'year')} props.selected - Currently selected time range
 * @param {Function} props.onSelect - Callback when a range is selected
 * 
 * Variables for web version:
 * - selected: current active tab ('week' | 'month' | 'year')
 * - onSelect: handler function receiving selected value
 */
const TimeRangeSelector = ({ selected = 'week', onSelect }) => {
  const options = [
    { value: 'week', label: 'WEEK' },
    { value: 'month', label: 'MONTH' },
    { value: 'year', label: 'YEAR' },
  ];

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.tab,
            selected === option.value && styles.tabActive,
          ]}
          onPress={() => onSelect(option.value)}
          activeOpacity={0.7}
        >
          <Typography
            variant="caption"
            weight="bold"
            color={selected === option.value ? 'black' : 'textSecondary'}
            style={styles.tabText}
          >
            {option.label}
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
    borderRadius: borderRadius.full,
    padding: 3,
    alignSelf: 'flex-start',
  },
  tab: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    marginHorizontal: 1,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    letterSpacing: 0.3,
    fontSize: 10,
  },
});

export default TimeRangeSelector;
