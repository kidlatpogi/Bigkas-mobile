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
  const { user, logout, isLoading, updateNickname } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    nickname: user?.nickname || '',
    email: user?.email || '',
    avatarUri: user?.avatar_url || null,
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  /** Update a single form field and clear its error. */
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  /** Validate & save profile to Supabase. */
  const handleSaveChanges = async () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSaving(true);

      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;

      // Upload avatar if changed (local URI means new pick)
      let avatarUrl = formData.avatarUri;
      if (formData.avatarUri && formData.avatarUri !== user?.avatar_url && formData.avatarUri.startsWith('file')) {
        avatarUrl = await uploadAvatar(formData.avatarUri);
      }

      // Update Supabase user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          nickname: formData.nickname.trim() || null,
          avatar_url: avatarUrl,
        },
      });

      if (updateError) throw updateError;

      // Also update nickname via context so local state stays in sync
      if (formData.nickname.trim()) {
        await updateNickname(formData.nickname.trim());
      }

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK' },
      ]);
    } catch (err) {
      console.error('Profile save error:', err);
      Alert.alert('Error', err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
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

  const handleCancel = () => {
    setFormData({
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
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
      navigation.navigate('Dashboard');
    }
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleAccountSettings = () => {
    navigation.navigate('AccountSettings');
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrap}>
            {/* ──── Back button ──── */}
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={24} color={colors.black} />
            </TouchableOpacity>

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
                onImageSelect={(uri) => updateField('avatarUri', uri)}
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

  /* ──── Back button ──── */
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
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
