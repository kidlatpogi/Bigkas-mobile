import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from './Typography';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * Script card component for displaying individual script items.
 * Shows title, description, edit timestamp, and a 3-dot overflow menu.
 * 
 * @param {Object} props
 * @param {string} props.title - Script title/name
 * @param {string} props.description - Script description/preview text
 * @param {string} props.editedTime - Last edited timestamp text
 * @param {string} props.type - Script type ('self-authored' | 'auto-generated')
 * @param {Function} props.onEdit - Handler for Edit action
 * @param {Function} props.onDelete - Handler for Delete action
 * @param {Function} props.onPress - Handler for card press (optional)
 * 
 * Variables for web version:
 * - title: script title string
 * - description: script body preview
 * - editedTime: formatted timestamp (e.g., "EDITED YESTERDAY")
 * - type: 'self-authored' or 'auto-generated'
 * - onEdit: edit menu callback
 * - onDelete: delete menu callback
 */
const ScriptCard = ({
  title,
  description,
  editedTime,
  type = 'self-authored',
  onEdit,
  onDelete,
  onPress,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const getBadgeStyle = () => {
    if (type === 'auto-generated') {
      return { backgroundColor: colors.gray200, text: colors.textSecondary };
    }
    return { backgroundColor: colors.primary, text: colors.black };
  };

  const badge = getBadgeStyle();
  const badgeLabel = type === 'self-authored' ? 'Self-Authored' : 'Auto-Generated';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={!onPress}
    >
      <View style={styles.content}>
        {/* Top row: badge + 3-dot menu */}
        <View style={styles.topRow}>
          <View style={[styles.badge, { backgroundColor: badge.backgroundColor }]}>
            <Typography 
              variant="caption" 
              weight="medium" 
              style={{ color: badge.text, fontSize: 12 }}
            >
              {badgeLabel}
            </Typography>
          </View>

          <TouchableOpacity
            style={styles.menuTrigger}
            onPress={() => setMenuVisible(true)}
            activeOpacity={0.6}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

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
      </View>

      {/* Overflow menu modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                onEdit?.();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={20} color={colors.textPrimary} />
              <Typography variant="body" style={styles.menuItemText}>Edit</Typography>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                onDelete?.();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
              <Typography variant="body" style={[styles.menuItemText, { color: colors.error }]}>
                Delete
              </Typography>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  menuTrigger: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
  },
  title: {
    marginBottom: spacing.sm,
  },
  description: {
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  editedTime: {
    letterSpacing: 0.5,
  },
  /* Overflow menu */
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xs,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  menuItemText: {
    flex: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginHorizontal: spacing.md,
  },
});

export default ScriptCard;
