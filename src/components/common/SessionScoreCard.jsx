import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Typography from './Typography';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * Session score card component for displaying individual session results.
 * Background color adapts based on score value.
 * 
 * @param {Object} props
 * @param {string} props.title - Session title/name
 * @param {string} props.subtitle - Session metadata (date, duration)
 * @param {number} props.score - Score value (0-100)
 * @param {Function} props.onPress - Press handler
 * 
 * Variables for web version:
 * - title: session name (e.g., "Impromptu Speech #10")
 * - subtitle: session metadata (e.g., "Oct 23 • 4 mins")
 * - score: numeric score 0-100
 * - scoreColor: computed color based on score threshold
 * - backgroundColor: computed background color based on score
 */
const SessionScoreCard = ({ title, subtitle, score, onPress }) => {
  // Determine score color based on value
  const getScoreColor = () => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  // Determine background color (lighter shade of score color)
  const getBackgroundColor = () => {
    if (score >= 80) return 'rgba(52, 199, 89, 0.1)'; // Light green
    if (score >= 60) return 'rgba(255, 149, 0, 0.1)'; // Light orange
    return 'rgba(255, 59, 48, 0.1)'; // Light red
  };

  const scoreColor = getScoreColor();
  const backgroundColor = getBackgroundColor();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Typography variant="body" weight="semibold" style={styles.title}>
            {title}
          </Typography>
          <Typography variant="caption" color="textSecondary" style={styles.subtitle}>
            {subtitle}
          </Typography>
        </View>
        <View style={styles.scoreContainer}>
          <Typography variant="h2" style={{ color: scoreColor }}>
            {score}
          </Typography>
          <Typography variant="bodySmall" color="textSecondary">
            /100
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    marginBottom: spacing.xs / 2,
  },
  subtitle: {
    marginTop: spacing.xs / 2,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});

export default SessionScoreCard;
