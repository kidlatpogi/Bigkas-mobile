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
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * Edit Profile screen for updating user details and avatar.
 * Variables documented for web version reuse.
 */
const EditProfileScreen = ({ navigation }) => {
  const { user, updateNickname, isLoading } = useAuth();

  // Profile form state for cross-platform reuse (web + mobile).
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    avatarUri: user?.avatar_url || null,
  });

  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSaveChanges = async () => {
    // Basic validation
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // TODO: Wire Supabase profile update when backend is ready
    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change flow will be available soon.');
  };

  const handleAccountSettings = () => {
    Alert.alert('Account Settings', 'Account settings will be available soon.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.contentWrap}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name="arrow-back" size={18} color={colors.textPrimary} />
            </TouchableOpacity>

            <Typography variant="h1" style={styles.title}>
              Edit Profile
            </Typography>

            <View style={styles.avatarWrap}>
              <AvatarPicker
                uri={formData.avatarUri}
                username={formData.firstName || 'U'}
                size={120}
                editable
                onImageSelect={(uri) => updateField('avatarUri', uri)}
              />
            </View>

            <View style={styles.form}>
              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <TextField
                    label="First Name"
                    placeholder="Juan"
                    value={formData.firstName}
                    onChangeText={(value) => updateField('firstName', value)}
                    autoCapitalize="words"
                    error={errors.firstName}
                  />
                </View>
                <View style={styles.rowItem}>
                  <TextField
                    label="Last Name"
                    placeholder="Dela Cruz"
                    value={formData.lastName}
                    onChangeText={(value) => updateField('lastName', value)}
                    autoCapitalize="words"
                    error={errors.lastName}
                  />
                </View>
              </View>

              <TextField
                label="Email Address"
                placeholder="juan@student.edu.ph"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email}
              />

              <TouchableOpacity style={styles.settingRow} onPress={handleChangePassword}>
                <Typography variant="body">Change Password</Typography>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingRow} onPress={handleAccountSettings}>
                <Typography variant="body">Account Settings</Typography>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              <PrimaryButton
                title="Save Changes"
                onPress={handleSaveChanges}
                loading={isLoading}
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  contentWrap: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  avatarWrap: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  form: {
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  rowItem: {
    width: '48%',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  saveButton: {
    width: '100%',
    marginTop: spacing.lg,
    backgroundColor: colors.black,
  },
  cancelButton: {
    width: '100%',
    marginTop: spacing.sm,
  },
});

export default EditProfileScreen;
