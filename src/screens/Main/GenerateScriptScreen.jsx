import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import PrimaryButton from '../../components/common/PrimaryButton';
import ChoiceChips from '../../components/common/ChoiceChips';
import BackButton from '../../components/common/BackButton';
import { createScript } from '../../api/scriptsApi';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * GenerateScriptScreen — Generate Script Practice / Save.
 *
 * Layout (top -> bottom):
 * 1. Back button
 * 2. "Generate Script" header
 * 3. Multiline prompt input + Random Topic action
 * 4. Vibe chips
 * 5. Duration chips
 * 6. "Generate and Start" or "Generate and Save" button (based on entryPoint)
 *
 * Route params:
 * - entryPoint: 'scripts' | 'training' (default 'training')
 *   When 'scripts', saves to DB and goes back.
 *   When 'training', saves to DB and navigates to TrainingScripted.
 *
 * After generation, a modal displays the generated text for user to
 * review, edit, and optionally regenerate before confirming.
 */
const GenerateScriptScreen = ({ navigation, route }) => {
  const entryPoint = route?.params?.entryPoint || 'training';

  /** @type {string} promptText - user prompt for script generation */
  const [promptText, setPromptText] = useState('');
  /** @type {string} selectedVibe - selected vibe tag */
  const [selectedVibe, setSelectedVibe] = useState('inspirational');
  /** @type {string} selectedDuration - selected duration tag */
  const [selectedDuration, setSelectedDuration] = useState('medium');
  /** @type {boolean} isGenerating - loading state while calling Supabase */
  const [isGenerating, setIsGenerating] = useState(false);

  /** Modal state for reviewing generated script */
  const [modalVisible, setModalVisible] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  /** @type {Array<{value: string, label: string}>} */
  const vibeOptions = useMemo(
    () => [
      { value: 'professional', label: 'Professional' },
      { value: 'casual', label: 'Casual' },
      { value: 'humorous', label: 'Humorous' },
      { value: 'inspirational', label: 'Inspirational' },
    ],
    []
  );

  /** @type {Array<{value: string, label: string}>} */
  const durationOptions = useMemo(
    () => [
      { value: 'short', label: 'Short (1-2m)' },
      { value: 'medium', label: 'Medium (3-5m)' },
      { value: 'long', label: 'Long (5m+)' },
    ],
    []
  );

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Dashboard' });
    }
  };

  const handleRandomTopic = () => {
    // TODO: Replace with a Supabase function or table lookup for random topics.
    setPromptText('Generate a short speech about resilience and new beginnings.');
  };

  const handleGenerateStart = async () => {
    setIsGenerating(true);
    try {
      // TODO: Call Supabase Edge Function for script generation with promptText, selectedVibe, selectedDuration.
      // Returns: { title: string, body: string }
      // For now, simulate a generated script:
      const title = promptText
        ? promptText.slice(0, 40).replace(/\n/g, ' ')
        : 'Generated Speech';
      const body =
        'Ladies and gentlemen, thank you for being here today. ' +
        'It is truly an honor to stand before you on this memorable occasion. ' +
        'As we reflect on the journey that brought us here, let us remember ' +
        'the challenges we overcame and the lessons we learned along the way. ' +
        'Together, we have proven that with perseverance and dedication, ' +
        'anything is possible. Let us carry this spirit forward as we embrace ' +
        'the opportunities that lie ahead.';

      console.info('Generate script', { promptText, selectedVibe, selectedDuration });

      // Show the modal with the generated content for user review
      setGeneratedTitle(title);
      setGeneratedContent(body);
      setModalVisible(true);
    } finally {
      setIsGenerating(false);
    }
  };

  /** Re-generate (same flow, replaces modal content) */
  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      // TODO: Call Supabase Edge Function again with same params
      const body =
        'Thank you all for gathering here today. ' +
        'This moment represents not just an ending, but a beautiful new beginning. ' +
        'We have grown, we have learned, and we have become stronger together. ' +
        'As I look around this room, I see the faces of people who have made ' +
        'an incredible impact. Let us continue to support one another ' +
        'and build a future we can all be proud of.';
      setGeneratedContent(body);
    } finally {
      setIsGenerating(false);
    }
  };

  /** Confirm the generated script — save to DB and navigate */
  const handleConfirmGenerated = async () => {
    setIsSaving(true);
    try {
      // Save to Supabase scripts table
      const result = await createScript({
        title: generatedTitle,
        content: generatedContent,
        type: 'auto-generated',
      });

      setModalVisible(false);

      if (entryPoint === 'scripts' || entryPoint === 'practice') {
        // Go back to previous screen (Scripts or Practice Setup, which re-fetches on focus)
        navigation.goBack();
      } else {
        // Navigate to training with the new script
        navigation.navigate('TrainingScripted', {
          scriptId: result.script?.id || Math.random().toString(36).substr(2, 9),
          focusMode: 'free',
          scriptType: 'autogenerated',
          autoStart: true,
          entryPoint: entryPoint || 'training',
        });
      }
    } catch (err) {
      console.error('Failed to save generated script:', err);
    } finally {
      setIsSaving(false);
    }
  };

  /** Button label depends on entry point */
  const primaryButtonLabel =
    (entryPoint === 'scripts' || entryPoint === 'practice')
      ? 'Generate and Save'
      : 'Generate and Start';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Back button */}
          <BackButton onPress={handleGoBack} style={{ marginBottom: spacing.md }} />

          {/* Header */}
          <Typography variant="h1" align="center" style={styles.title}>
            Generate{"\n"}Script
          </Typography>

          {/* Prompt Input */}
          <View style={styles.inputWrap}>
            <TextInput
              value={promptText}
              onChangeText={setPromptText}
              placeholder="What are you talking about? Be specific about your main message and who the audience is."
              placeholderTextColor={colors.textSecondary}
              style={styles.textArea}
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={styles.randomTopic}
              onPress={handleRandomTopic}
              activeOpacity={0.7}
            >
              <Ionicons name="shuffle" size={14} color={colors.black} />
              <Typography variant="caption" weight="medium" style={styles.randomTopicText}>
                Random Topic
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Vibe */}
          <Typography variant="body" weight="bold" style={styles.sectionTitle}>
            What's the vibe?
          </Typography>
          <ChoiceChips
            options={vibeOptions}
            selected={selectedVibe}
            onSelect={setSelectedVibe}
            containerStyle={styles.chipsRow}
          />

          {/* Duration */}
          <Typography variant="body" weight="bold" style={styles.sectionTitle}>
            Approx. Duration
          </Typography>
          <ChoiceChips
            options={durationOptions}
            selected={selectedDuration}
            onSelect={setSelectedDuration}
            containerStyle={styles.chipsRow}
          />
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <PrimaryButton
            title={primaryButtonLabel}
            onPress={handleGenerateStart}
            loading={isGenerating}
            variant="primary"
            size="large"
            style={styles.generateButton}
          />
        </View>

        {/* Generated Script Review Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContainer}>
              {/* Modal header */}
              <View style={styles.modalHeader}>
                <Typography variant="h3">Generated Speech</Typography>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Title input */}
              <Typography variant="caption" color="textSecondary" weight="medium" style={styles.modalLabel}>
                TITLE
              </Typography>
              <TextInput
                value={generatedTitle}
                onChangeText={setGeneratedTitle}
                style={styles.modalTitleInput}
                placeholder="Script title"
                placeholderTextColor={colors.textSecondary}
              />

              {/* Content editor */}
              <Typography variant="caption" color="textSecondary" weight="medium" style={styles.modalLabel}>
                CONTENT
              </Typography>
              <ScrollView style={styles.modalContentScroll} nestedScrollEnabled>
                <TextInput
                  value={generatedContent}
                  onChangeText={setGeneratedContent}
                  style={styles.modalContentInput}
                  multiline
                  textAlignVertical="top"
                  placeholder="Generated content will appear here…"
                  placeholderTextColor={colors.textSecondary}
                />
              </ScrollView>

              {/* Actions */}
              <View style={styles.modalActions}>
                <PrimaryButton
                  title="Regenerate"
                  onPress={handleRegenerate}
                  variant="outline"
                  size="medium"
                  loading={isGenerating}
                  style={styles.modalActionBtn}
                />
                <PrimaryButton
                  title={entryPoint === 'scripts' ? 'Save' : 'Save & Start'}
                  onPress={handleConfirmGenerated}
                  variant="primary"
                  size="medium"
                  loading={isSaving}
                  style={styles.modalActionBtn}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },

  title: {
    marginBottom: spacing.md,
  },
  inputWrap: {
    marginBottom: spacing.md,
  },
  textArea: {
    minHeight: 120,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: spacing.md,
    backgroundColor: colors.white,
    color: colors.textPrimary,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  randomTopic: {
    marginTop: spacing.xs,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  randomTopicText: {
    color: colors.textPrimary,
  },
  sectionTitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  chipsRow: {
    marginBottom: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  generateButton: {
    backgroundColor: colors.primary,
  },
  /* Modal styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalLabel: {
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  modalTitleInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: colors.textPrimary,
    backgroundColor: colors.background,
    marginBottom: spacing.md,
  },
  modalContentScroll: {
    maxHeight: 260,
    marginBottom: spacing.md,
  },
  modalContentInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.textPrimary,
    backgroundColor: colors.background,
    minHeight: 200,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalActionBtn: {
    flex: 1,
  },
});

export default GenerateScriptScreen;
