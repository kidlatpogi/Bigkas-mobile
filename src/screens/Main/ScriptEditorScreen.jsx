import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import PrimaryButton from '../../components/common/PrimaryButton';
import TextField from '../../components/common/TextField';
import BackButton from '../../components/common/BackButton';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';
import { supabase } from '../../api/supabaseClient';

/**
 * Script Editor Screen for creating and editing practice scripts.
 * 
 * Route Params:
 * - scriptId: (optional) ID of script to edit. If not provided, creates new script
 * - script: (optional) Existing script data object
 * 
 * Features:
 * - Fixed header that doesn't scroll
 * - Real-time character count
 * - Script title and content editing
 * - Save to Supabase
 * - Back navigation support
 */
const ScriptEditorScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const scriptId = route?.params?.scriptId;
  const existingScript = route?.params?.script;
  const isEditing = !!scriptId;

  const [title, setTitle] = useState(existingScript?.title || '');
  const [content, setContent] = useState(existingScript?.content || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load script if editing
  useEffect(() => {
    if (isEditing && !existingScript && scriptId) {
      loadScript();
    }
  }, [isEditing, scriptId]);

  const loadScript = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('scripts')
        .select('id, user_id, title, content, type, created_at, updated_at')
        .eq('id', scriptId)
        .single();

      if (error) throw error;
      if (data) {
        setTitle(data.title);
        setContent(data.content);
      }
    } catch (err) {
      console.error('Failed to load script:', err);
      Alert.alert('Error', 'Failed to load script');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a script title');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Error', 'Please enter script content');
      return;
    }

    try {
      setIsSaving(true);

      if (isEditing) {
        // Update existing script
        const { error } = await supabase
          .from('scripts')
          .update({
            title: title.trim(),
            content: content.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', scriptId);

        if (error) throw error;
        Alert.alert('Success', 'Script updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        // Create new script
        const { error } = await supabase
          .from('scripts')
          .insert({
            user_id: user?.id,
            title: title.trim(),
            content: content.trim(),
            type: 'self-authored',
          })
          .select('id, user_id, title, content, type, created_at, updated_at')
          .single();

        if (error) throw error;
        Alert.alert('Success', 'Script created successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      console.error('Failed to save script:', err);
      Alert.alert('Error', 'Failed to save script. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      Alert.alert(
        'Discard Changes?',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Fixed Header */}
        <View style={styles.header}>
          <BackButton onPress={handleCancel} />
          <Typography variant="h3">
            {isEditing ? 'Edit Script' : 'New Script'}
          </Typography>
          <View style={styles.headerSpacer} />
        </View>

        {/* Scrollable Content */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.form}>
              {/* Title Field */}
              <TextField
                label="SCRIPT TITLE"
                placeholder="Enter script title..."
                value={title}
                onChangeText={setTitle}
                autoCapitalize="words"
              />

              {/* Content Field */}
              <View style={styles.contentFieldContainer}>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  style={styles.label}
                >
                  SCRIPT CONTENT
                </Typography>
                <TextInput
                  style={styles.contentInput}
                  placeholder="Enter script content..."
                  placeholderTextColor={colors.textMuted}
                  value={content}
                  onChangeText={setContent}
                  multiline
                  textAlignVertical="top"
                />
                <Typography
                  variant="caption"
                  color="textSecondary"
                  style={styles.characterCount}
                >
                  {content.length} characters
                </Typography>
              </View>

              {/* Action Buttons */}
              <View style={styles.actions}>
                <PrimaryButton
                  title="Save"
                  onPress={handleSave}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  /* Layout */
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    paddingBottom: 100, // room for floating nav
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },

  headerSpacer: {
    width: 40,
  },

  /* Form */
  form: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
  },

  /* Content Input */
  contentFieldContainer: {
    marginBottom: spacing.md,
  },
  contentInput: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 200,
    maxHeight: 400,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  characterCount: {
    textAlign: 'right',
    paddingHorizontal: spacing.md,
  },

  /* Actions */
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

  /* Loader */
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScriptEditorScreen;
