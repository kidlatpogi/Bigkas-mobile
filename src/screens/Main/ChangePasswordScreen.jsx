import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import PrimaryButton from '../../components/common/PrimaryButton';
import PasswordField from '../../components/common/PasswordField';
import { supabase } from '../../api/supabaseClient';
import BackButton from '../../components/common/BackButton';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * ChangePasswordScreen — Change user password via Supabase.
 *
 * Layout (top → bottom):
 *  1. Circular back-arrow button
 *  2. "New Password" bold title
 *  3. "Create a new, strong password for your account" description
 *  4. New Password field
 *  5. Confirm New Password field
 *  6. "Save New Password" primary button
 *  7. "Cancel" outlined button
 *
 * @component
 * @param {{ navigation: import('@react-navigation/native').NavigationProp }} props
 */
const ChangePasswordScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleSaveNewPassword = async () => {
    const newErrors = {};

    if (!newPassword.trim()) newErrors.newPassword = 'New password is required';
    else if (newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (!confirmPassword.trim()) newErrors.confirmPassword = 'Please confirm your new password';
    else if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSaving(true);

      // Update password via Supabase (built-in verification)
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        // Handle specific Supabase errors
        if (updateError.message?.includes('New password should be different')) {
          setErrors({ newPassword: 'New password must be different from current password' });
        } else if (updateError.message?.includes('weak')) {
          setErrors({ newPassword: 'Password is too weak. Please choose a stronger password.' });
        } else {
          throw updateError;
        }
        return;
      }

      Alert.alert('Success', 'Your password has been updated successfully.', [
        { text: 'OK', onPress: handleGoBack },
      ]);
    } catch (err) {
      console.error('Change password error:', err);
      Alert.alert('Error', err.message || 'Failed to update password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field, value) => {
    if (field === 'newPassword') setNewPassword(value);
    else if (field === 'confirmPassword') setConfirmPassword(value);

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrap}>
            {/* ── Back button ── */}
            <BackButton onPress={handleGoBack} style={{ marginBottom: spacing.sm }} />

            {/* ── Title ── */}
            <Typography variant="h1" style={styles.title}>
              New Password
            </Typography>

            {/* ── Description ── */}
            <Typography variant="body" color="textSecondary" style={styles.description}>
              Create a new, strong password{'\n'}for your account
            </Typography>

            {/* ── Form ── */}
            <View style={styles.form}>
              <PasswordField
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={(v) => updateField('newPassword', v)}
                error={errors.newPassword}
              />

              <PasswordField
                label="Confirm New Password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChangeText={(v) => updateField('confirmPassword', v)}
                error={errors.confirmPassword}
              />
            </View>
          </View>
        </ScrollView>

        {/* ── Action buttons (fixed at bottom) ── */}
        <View style={styles.bottomActions}>
          <PrimaryButton
            title="Save New Password"
            onPress={handleSaveNewPassword}
            loading={isSaving}
            variant="primary"
            size="large"
            style={styles.saveButton}
          />

          <PrimaryButton
            title="Cancel"
            onPress={handleGoBack}
            variant="outline"
            size="large"
            style={styles.cancelButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  /* ── Layout ── */
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 100,
  },
  contentWrap: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },



  /* ── Title ── */
  title: {
    fontWeight: '700',
    marginBottom: spacing.xs,
  },

  /* ── Description ── */
  description: {
    marginBottom: spacing.xl,
    lineHeight: 20,
  },

  /* ── Form ── */
  form: {
    gap: spacing.sm,
  },

  /* ── Bottom actions ── */
  bottomActions: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  saveButton: {
    width: '100%',
    borderRadius: borderRadius.lg,
  },
  cancelButton: {
    width: '100%',
    marginTop: spacing.sm,
    borderRadius: borderRadius.lg,
    borderColor: colors.borderDark,
  },
});

export default ChangePasswordScreen;
