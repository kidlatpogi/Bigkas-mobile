import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import PrimaryButton from '../../components/common/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../api/supabaseClient';
import BackButton from '../../components/common/BackButton';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * AccountSettingsScreen — Account deactivation and deletion.
 *
 * Layout (top → bottom):
 *  1. Circular back-arrow button
 *  2. "Account Settings" bold title centred
 *  3. Description text
 *  4. "Deactivate Profile" button section
 *  5. "Delete Account" red button section
 *  6. "Cancel" outlined button
 *
 * Delete Account flow:
 * - User clicks "Delete Account"
 * - Modal appears requiring:
 *   - Password input
 *   - "Confirm Delete" text (must type exactly)
 *   - Two buttons: Confirm + Cancel
 *
 * @component
 * @param {{ navigation: import('@react-navigation/native').NavigationProp }} props
 */
const AccountSettingsScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleDeactivateProfile = () => {
    Alert.alert(
      'Deactivate Profile',
      'Your profile will be hidden but you can reactivate it anytime by logging in.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Deactivate', style: 'destructive', onPress: async () => {
          // TODO: Implement deactivation in Supabase
          Alert.alert('Info', 'Profile deactivation coming soon.');
        }},
      ]
    );
  };

  const handleDeleteAccountPress = () => {
    setPassword('');
    setConfirmText('');
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    if (confirmText !== 'confirm delete') {
      Alert.alert('Error', 'Please type "confirm delete" exactly to confirm deletion');
      return;
    }

    try {
      setIsDeleting(true);

      // TODO: Authenticate user with password to verify identity before deletion
      // For now, we'll proceed with deletion (in production, verify password with Supabase)
      
      // Delete user account via Supabase auth
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ''
      );

      if (error) throw error;

      setShowDeleteModal(false);
      Alert.alert('Account Deleted', 'Your account has been permanently deleted.', [
        { 
          text: 'OK', 
          onPress: async () => {
            await logout();
            navigation.navigate('Login');
          }
        },
      ]);
    } catch (err) {
      console.error('Delete account error:', err);
      Alert.alert('Error', 'Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const isConfirmDeleteValid = password.trim() && confirmText === 'CONFIRM DELETE';

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
              Account Settings
            </Typography>

            {/* ── Description ── */}
            <Typography variant="body" color="textSecondary" style={styles.description}>
              Choose to temporarily hide your profile or permanently delete your account and data.
            </Typography>

            {/* ── Deactivate Profile ── */}
            <View style={styles.section}>
              <Typography variant="h4" style={styles.sectionTitle}>
                Deactivate Profile
              </Typography>
              <Typography variant="bodySmall" color="textSecondary" style={styles.sectionDesc}>
                Your profile will be hidden but you can reactivate it anytime by logging in.
              </Typography>
              <PrimaryButton
                title="Deactivate Profile"
                onPress={handleDeactivateProfile}
                variant="outline"
                style={styles.deactivateButton}
              />
            </View>

            {/* ── Delete Account ── */}
            <View style={styles.section}>
              <Typography variant="h4" style={styles.sectionTitle}>
                Delete Account
              </Typography>
              <Typography variant="bodySmall" color="textSecondary" style={styles.sectionDesc}>
                Your account and all data will be permanently removed. This action cannot be undone.
              </Typography>
              <PrimaryButton
                title="Delete Account"
                onPress={handleDeleteAccountPress}
                variant="primary"
                style={styles.deleteButton}
                textStyle={styles.deleteButtonText}
              />
            </View>
          </View>
        </ScrollView>

        {/* ── Cancel button (fixed at bottom) ── */}
        <View style={styles.bottomButtonContainer}>
          <PrimaryButton
            title="Cancel"
            onPress={handleGoBack}
            variant="outline"
            style={styles.cancelButton}
          />
        </View>
      </KeyboardAvoidingView>

      {/* ── Delete Account Modal ── */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => !isDeleting && setShowDeleteModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => !isDeleting && setShowDeleteModal(false)}
        >
          <View style={styles.modalContent}>
            <Typography variant="h3" style={styles.modalTitle}>
              Confirm Account Deletion
            </Typography>

            <Typography variant="body" color="textSecondary" style={styles.modalDesc}>
              This action cannot be undone. Enter your password and type "CONFIRM DELETE" to proceed.
            </Typography>

            {/* ── Password input ── */}
            <Typography variant="bodySmall" weight="medium" style={styles.inputLabel}>
              PASSWORD
            </Typography>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isDeleting}
              placeholderTextColor={colors.textSecondary}
            />

            {/* ── Confirm delete input ── */}
            <Typography variant="bodySmall" weight="medium" style={styles.inputLabel}>
              TYPE "CONFIRM DELETE"
            </Typography>
            <TextInput
              style={styles.textInput}
              placeholder="Type 'CONFIRM DELETE'"
              value={confirmText}
              onChangeText={setConfirmText}
              editable={!isDeleting}
              autoCapitalize="none"
              placeholderTextColor={colors.textSecondary}
            />

            {/* ── Buttons ── */}
            <View style={styles.modalActions}>
              <PrimaryButton
                title="Cancel"
                onPress={() => setShowDeleteModal(false)}
                variant="outline"
                disabled={isDeleting}
                style={styles.modalCancelBtn}
              />

              <PrimaryButton
                title={isDeleting ? 'Deleting...' : 'Delete Account'}
                onPress={handleConfirmDelete}
                variant="primary"
                disabled={!isConfirmDeleteValid || isDeleting}
                loading={isDeleting}
                style={[
                  styles.modalDeleteBtn,
                  {
                    opacity: isConfirmDeleteValid && !isDeleting ? 1 : 0.5,
                  },
                ]}
                textStyle={styles.modalDeleteButtonText}
              />
            </View>
          </View>
        </Pressable>
      </Modal>
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
    marginBottom: spacing.sm,
    fontWeight: '700',
  },

  /* ── Description ── */
  description: {
    marginBottom: spacing.xxl,
    lineHeight: 20,
  },

  /* ── Sections ── */
  section: {
    marginBottom: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    marginBottom: spacing.xs,
    fontWeight: '900',
  },
  sectionDesc: {
    marginBottom: spacing.md,
    lineHeight: 19,
  },
  deactivateButton: {
    width: '100%',
  },
  deleteButton: {
    width: '100%',
    backgroundColor: colors.error,
  },
  deleteButtonText: {
    color: colors.white,
  },

  /* ── Bottom button container ── */
  bottomButtonContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  /* ── Cancel button ── */
  cancelButton: {
    width: '100%',
  },

  /* ── Modal ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: spacing.sm,
    fontWeight: '700',
  },
  modalDesc: {
    marginBottom: spacing.md,
    lineHeight: 20,
  },

  /* ── Modal inputs ── */
  inputLabel: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    fontSize: 15,
    color: colors.textPrimary,
  },

  /* ── Modal actions ── */
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  modalCancelBtn: {
    flex: 1,
  },
  modalDeleteBtn: {
    flex: 1,
    backgroundColor: colors.error,
  },
  modalDeleteButtonText: {
    color: colors.white,
  },
});

export default AccountSettingsScreen;
