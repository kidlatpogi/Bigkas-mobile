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
import TextField from '../../components/common/TextField';
import AvatarPicker from '../../components/common/AvatarPicker';
import BackButton from '../../components/common/BackButton';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../api/supabaseClient';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * ProfileScreen — User profile with editable details.
 * 1:1 copy of the Figma design showing user info + edit capability.
 *
 * Layout (top → bottom):
 *  1. Circular back-arrow button
 *  2. "Edit Profile" bold title centered
 *  3. AvatarPicker (120 px, dark circle, camera icon overlay)
 *  4. First Name + Last Name side-by-side inputs
 *  5. Email Address full-width input (read-only)
 *  6. "Change Password" row with chevron
 *  7. "Account Settings" row with chevron
 *  8. "Save Changes" black button
 *  9. "Cancel" outlined button
 *
 * @component
 * @param {{ navigation: import('@react-navigation/native').NavigationProp }} props
 */
const ProfileScreen = ({ navigation }) => {
  const { user, logout, isLoading, updateNickname, updateNicknameLocal } =
    useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || user?.name?.split(' ')[0] || '',
    lastName: user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
    nickname: user?.nickname || '',
    email: user?.email || '',
    avatarUri: user?.avatar_url || null,
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Detect if any form field differs from the original user data.
   * Returns true if there are unsaved changes.
   */
  const hasChanges = () => {
    const originalFirstName = user?.firstName || user?.name?.split(' ')[0] || '';
    const originalLastName = user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '';
    const originalNickname = user?.nickname || '';
    const originalAvatar = user?.avatar_url || null;

    return (
      formData.firstName !== originalFirstName ||
      formData.lastName !== originalLastName ||
      formData.nickname !== originalNickname ||
      formData.avatarUri !== originalAvatar
    );
  };

  /** Update a single form field and clear its error. */
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  /** Validate & save profile to Supabase with optimistic UI updates. */
  const handleSaveChanges = async () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSaving(true);

      const firstName = formData.firstName.trim();
      const lastName = formData.lastName.trim();
      const fullName = `${firstName} ${lastName}`.trim();
      let avatarUrl = formData.avatarUri;
      const hasNewAvatar = formData.avatarUri && formData.avatarUri !== user?.avatar_url && formData.avatarUri.startsWith('file');

      // Update Supabase user metadata immediately (without waiting for avatar)
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          nickname: formData.nickname.trim() || null,
          avatar_url: hasNewAvatar ? formData.avatarUri : avatarUrl, // Temporarily use local URI
        },
      });

      if (updateError) throw updateError;

      // Update nickname via context in parallel (local only since we already updated Supabase)
      const nicknamePromise = formData.nickname.trim() 
        ? updateNicknameLocal(formData.nickname.trim())
        : Promise.resolve({ success: true });

      // Show success immediately for better UX
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK' },
      ]);

      // Upload avatar in background if needed
      if (hasNewAvatar) {
        uploadAvatarInBackground(formData.avatarUri);
      }

      // Wait for nickname update
      await nicknamePromise;

    } catch (err) {
      console.error('Profile save error:', err);
      Alert.alert('Error', err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  /** Upload avatar in background and update user metadata when complete. */
  const uploadAvatarInBackground = async (localUri) => {
    try {
      const avatarUrl = await uploadAvatar(localUri);
      
      // Update local state with the uploaded URL
      setFormData((prev) => ({ ...prev, avatarUri: avatarUrl }));
      
      // Try to update user metadata with actual avatar URL
      try {
        await supabase.auth.updateUser({
          data: {
            avatar_url: avatarUrl,
          },
        });
      } catch (updateErr) {
        // RLS policy may prevent user_metadata updates — avatar is still in storage
        console.warn('Could not update user metadata (RLS policy):', updateErr);
      }
    } catch (err) {
      console.warn('Background avatar upload failed:', err);
      // Don't revert UI — the local URI still works for display
    }
  };

  /**
   * Upload avatar image to Supabase Storage.
   * @param {string} localUri - Local file URI from image picker
   * @returns {Promise<string>} Public URL of uploaded avatar
   */
  const uploadAvatar = async (localUri) => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) throw new Error('Not authenticated');

    const fileExt = localUri.split('.').pop() || 'jpg';
    const fileName = `${currentUser.id}/avatar.${fileExt}`;

    // Fetch file as blob
    const response = await fetch(localUri);
    const blob = await response.blob();

    // Convert blob to ArrayBuffer for Supabase upload
    const arrayBuffer = await new Response(blob).arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, arrayBuffer, {
        contentType: `image/${fileExt}`,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  /**
   * Auto-save avatar to Supabase when user picks and crops.
   * Updates form state immediately, uploads in background.
   */
  const handleAvatarAutoSave = async (localUri) => {
    try {
      // Update local state immediately so user sees the new picture
      setFormData((prev) => ({ ...prev, avatarUri: localUri }));

      // Try uploading to Supabase Storage
      const avatarUrl = await uploadAvatar(localUri);

      // Update local state with the remote URL
      setFormData((prev) => ({ ...prev, avatarUri: avatarUrl }));

      // Try to update user metadata
      try {
        await supabase.auth.updateUser({
          data: { avatar_url: avatarUrl },
        });
      } catch (metaErr) {
        console.warn('Could not update user metadata:', metaErr);
      }

      Alert.alert('Success', 'Profile picture updated!', [{ text: 'OK' }]);
    } catch (err) {
      console.error('Avatar auto-save error:', err);
      // Keep the local URI so the user can still see the picture locally
      Alert.alert(
        'Notice',
        'Profile picture updated locally. Cloud sync may be unavailable — please check your storage permissions in Supabase.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || user?.name?.split(' ')[0] || '',
      lastName: user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
      nickname: user?.nickname || '',
      email: user?.email || '',
      avatarUri: user?.avatar_url || null,
    });
    setErrors({});
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Dashboard' });
    }
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleAccountSettings = () => {
    navigation.navigate('AccountSettings');
  };

  /**
   * Handle removing the current avatar
   */
  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatarUri: null }));
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (err) {
              console.error('Logout error:', err);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
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
            {/* ──── Back button ──── */}
            <BackButton onPress={handleGoBack} style={{ marginBottom: spacing.sm }} />

            {/* ──── Title ──── */}
            <Typography variant="h1" style={styles.title}>
              Edit Profile
            </Typography>

            {/* ──── Avatar ──── */}
            <View style={styles.avatarWrap}>
              <AvatarPicker
                uri={formData.avatarUri}
                username={formData.firstName || 'U'}
                size={120}
                editable
                onImageSelectAndUpload={handleAvatarAutoSave}
                onRemoveImage={handleRemoveAvatar}
              />
            </View>

            {/* ──── Form ──── */}
            <View style={styles.form}>
              {/* First Name + Last Name */}
              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <TextField
                    label="FIRST NAME"
                    placeholder="Juan"
                    value={formData.firstName}
                    onChangeText={(v) => updateField('firstName', v)}
                    autoCapitalize="words"
                    error={errors.firstName}
                  />
                </View>
                <View style={styles.rowItem}>
                  <TextField
                    label="LAST NAME"
                    placeholder="Dela Cruz"
                    value={formData.lastName}
                    onChangeText={(v) => updateField('lastName', v)}
                    autoCapitalize="words"
                    error={errors.lastName}
                  />
                </View>
              </View>

              {/* Email (read-only) */}
              <TextField
                label="EMAIL ADDRESS"
                placeholder="juan@student.edu.ph"
                value={formData.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={false}
                error={errors.email}
              />

              {/* Nickname */}
              <TextField
                label="NICKNAME"
                placeholder="Enter your nickname"
                value={formData.nickname}
                onChangeText={(v) => updateField('nickname', v)}
                autoCapitalize="words"
                error={errors.nickname}
              />

              {/* Change Password */}
              <TouchableOpacity style={styles.settingRow} onPress={handleChangePassword}>
                <Typography variant="body" style={styles.settingLabel}>
                  Change Password
                </Typography>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Account Settings */}
              <TouchableOpacity style={styles.settingRow} onPress={handleAccountSettings}>
                <Typography variant="body" style={styles.settingLabel}>
                  Account Settings
                </Typography>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* ──── Action buttons ──── */}
            <View style={styles.actions}>
              <PrimaryButton
                title="Save Changes"
                onPress={handleSaveChanges}
                loading={isSaving}
                disabled={!hasChanges()}
                variant="secondary"
                size="large"
                style={styles.saveButton}
              />

              <PrimaryButton
                title="Cancel"
                onPress={handleCancel}
                variant="outline"
                size="large"
                style={styles.cancelButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  /* ──── Layout ──── */
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
    paddingBottom: 100, // room for floating nav
  },
  contentWrap: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },



  /* ──── Title ──── */
  title: {
    textAlign: 'center',
    marginBottom: spacing.md,
    fontWeight: '700',
  },

  /* ──── Avatar ──── */
  avatarWrap: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  /* ──── Form ──── */
  form: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItem: {
    width: '48%',
  },

  /* ──── Setting rows ──── */
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  settingLabel: {
    fontSize: 15,
  },

  /* ──── Action buttons ──── */
  actions: {
    marginTop: spacing.md,
  },
  saveButton: {
    width: '100%',
    backgroundColor: colors.black,
    borderRadius: borderRadius.lg,
  },
  cancelButton: {
    width: '100%',
    marginTop: spacing.sm,
    borderRadius: borderRadius.lg,
    borderColor: colors.borderDark,
  },
});

export default ProfileScreen;
