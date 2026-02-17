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
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * ChangePasswordScreen — Change user password via Supabase.
 *
 * Layout (top → bottom):
 *  1. Circular back-arrow button
 *  2. "New Password" bold title
 *  3. "Create a new, strong password for your account" description
 *  4. Enter old Password field
 *  5. New Password field
 *  6. Confirm New Password field
 *  7. "Save New Password" primary button
 *  8. "Cancel" outlined button
 *
 * @component
 * @param {{ navigation: import('@react-navigation/native').NavigationProp }} props
 */
const ChangePasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
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

    if (!oldPassword.trim()) newErrors.oldPassword = 'Old password is required';
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

      // Verify old password by re-authenticating
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error('Unable to verify current user');

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      });

      if (signInError) {
        setErrors({ oldPassword: 'Incorrect current password' });
        return;
      }

      // Update password via Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

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
    if (field === 'oldPassword') setOldPassword(value);
    else if (field === 'newPassword') setNewPassword(value);
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
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={24} color={colors.black} />
            </TouchableOpacity>

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
                label="Enter old Password"
                placeholder="Enter old password"
                value={oldPassword}
                onChangeText={(v) => updateField('oldPassword', v)}
                error={errors.oldPassword}
              />

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

  /* ── Back button ── */
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
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
