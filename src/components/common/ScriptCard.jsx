import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Typography from './Typography';
import PrimaryButton from './PrimaryButton';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * Script card component for displaying individual script items.
 * Shows title, description, edit timestamp, and action buttons.
 * 
 * @param {Object} props
 * @param {string} props.title - Script title/name
 * @param {string} props.description - Script description/preview text
 * @param {string} props.editedTime - Last edited timestamp text
 * @param {Function} props.onEdit - Handler for Edit button
 * @param {Function} props.onUseInPractice - Handler for Use in Practice button
 * @param {Function} props.onPress - Handler for card press (optional)
 * 
 * Variables for web version:
 * - title: script title string
 * - description: script body preview
 * - editedTime: formatted timestamp (e.g., "EDITED YESTERDAY")
 * - onEdit: edit button callback
 * - onUseInPractice: use in practice button callback
 */
const ScriptCard = ({
  title,
  description,
  editedTime,
  onEdit,
  onUseInPractice,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={!onPress}
    >
      <View style={styles.content}>
        <Typography variant="body" weight="bold" style={styles.title}>
          {title}
        </Typography>
        
        <Typography
          variant="bodySmall"
          color="textSecondary"
          numberOfLines={3}
          style={styles.description}
        >
          {description}
        </Typography>

        <Typography
          variant="caption"
          color="textSecondary"
          weight="medium"
          style={styles.editedTime}
        >
          {editedTime}
        </Typography>

        <View style={styles.buttonsRow}>
          <PrimaryButton
            title="Edit"
            onPress={onEdit}
            variant="outline"
            size="small"
            style={styles.editButton}
          />
          <PrimaryButton
            title="Use in Practice"
            onPress={onUseInPractice}
            variant="secondary"
            size="small"
            style={styles.practiceButton}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  content: {
    padding: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  description: {
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  editedTime: {
    marginBottom: spacing.md,
    letterSpacing: 0.5,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  editButton: {
    flex: 1,
  },
  practiceButton: {
    flex: 1,
  },
});

export default ScriptCard;
