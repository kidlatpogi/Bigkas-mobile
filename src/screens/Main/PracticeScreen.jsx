import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import Card from '../../components/common/Card';
import PrimaryButton from '../../components/common/PrimaryButton';
import FilterTabs from '../../components/common/FilterTabs';
import BackButton from '../../components/common/BackButton';
import { fetchScripts } from '../../api/scriptsApi';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/** Random topics pool for the Randomizer tab */
const RANDOM_TOPICS = [
  { title: 'The Future of Education', body: 'Talk about how technology is changing the way we learn and what schools might look like in 20 years.' },
  { title: 'Why Failure is Important', body: 'Discuss how setbacks and mistakes are essential stepping stones to success and personal growth.' },
  { title: 'Climate Change in Our Lifetime', body: 'Share your thoughts on the environmental challenges we face and what each person can do about it.' },
  { title: 'The Power of Kindness', body: 'Speak about how small acts of kindness can create ripple effects in communities and the world.' },
  { title: 'Social Media: Blessing or Curse?', body: 'Debate the positive and negative impacts of social media on relationships, mental health, and society.' },
  { title: 'Dream Big, Start Small', body: 'Inspire listeners by talking about how every great achievement started with a single small step.' },
  { title: 'Lessons from My Hometown', body: 'Share stories and wisdom from where you grew up and how it shaped who you are today.' },
  { title: 'The Importance of Mental Health', body: 'Discuss why taking care of our mental well-being is just as important as physical health.' },
  { title: 'If I Could Change One Law', body: 'Pick a law or policy you\'d change and persuade your audience why it matters.' },
  { title: 'What Leadership Really Means', body: 'Share your perspective on true leadership — is it about authority, service, or something else?' },
  { title: 'My Biggest Life Lesson', body: 'Tell your audience about a pivotal moment that taught you something you\'ll never forget.' },
  { title: 'The Art of Listening', body: 'Explain why listening is an underrated skill and how it can transform our relationships.' },
  { title: 'Technology and Privacy', body: 'Discuss the balance between technological convenience and our right to privacy.' },
  { title: 'Why Travel Broadens the Mind', body: 'Talk about how experiencing different cultures and places changes our perspective on life.' },
  { title: 'The Value of Hard Work', body: 'Share examples of how dedication and perseverance lead to meaningful accomplishments.' },
];

/**
 * PracticeScreen — Practice Setup screen.
 *
 * Layout (top -> bottom):
 * 1. Back button
 * 2. "Practice Setup" title + helper text
 * 3. Pre-written / Randomizer / Generate tabs
 * 4. Script list cards OR random topic OR generate button
 * 5. Cancel button
 */
const PracticeScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('prewritten');
  const [scripts, setScripts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Teleprompter preview modal state
  const [previewScript, setPreviewScript] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Randomizer state
  const [randomTopic, setRandomTopic] = useState(null);

  // Load scripts from Supabase
  const loadScripts = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchScripts();
    if (result.success) {
      setScripts(result.scripts || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadScripts();
    });
    return unsubscribe;
  }, [navigation, loadScripts]);

  // Initialize random topic on first mount
  useEffect(() => {
    shuffleRandomTopic();
  }, []);

  const shuffleRandomTopic = () => {
    const idx = Math.floor(Math.random() * RANDOM_TOPICS.length);
    setRandomTopic(RANDOM_TOPICS[idx]);
  };

  /** @type {Array<{value: string, label: string}>} */
  const tabOptions = useMemo(
    () => [
      { value: 'prewritten', label: 'Pre-written' },
      { value: 'randomizer', label: 'Randomizer' },
      { value: 'generate', label: 'Generate' },
    ],
    []
  );

  /** Filter scripts by tab: pre-written = self-authored, generate = auto-generated */
  const visibleScripts = useMemo(() => {
    if (selectedTab === 'prewritten') {
      return scripts.filter((s) => s.type === 'self-authored');
    }
    if (selectedTab === 'generate') {
      return scripts.filter((s) => s.type === 'auto-generated');
    }
    return [];
  }, [scripts, selectedTab]);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Dashboard' });
    }
  };

  const handleCancel = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Dashboard' });
    }
  };

  /** Open teleprompter preview for a script */
  const handleScriptPress = (script) => {
    setPreviewScript(script);
    setShowPreview(true);
  };

  /** Start practice with the previewed script */
  const handleStartPractice = () => {
    if (!previewScript) return;
    setShowPreview(false);
    navigation.navigate('TrainingScripted', {
      scriptId: previewScript.id,
      focusMode: 'free',
      scriptType: previewScript.type === 'auto-generated' ? 'autogenerated' : 'prewritten',
      autoStart: true,
      entryPoint: 'practice',
    });
  };

  /** Start practice with the randomizer topic (free speech with context) */
  const handleStartRandomTopic = () => {
    if (!randomTopic) return;
    navigation.navigate('TrainingScripted', {
      focusMode: 'free',
      autoStart: true,
      entryPoint: 'practice',
      freeSpeechTopic: randomTopic.title,
      freeSpeechContext: randomTopic.body,
    });
  };

  const handleOpenGenerate = () => {
    navigation.navigate('GenerateScript', { entryPoint: 'practice' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrap}>
          {/* Back button */}
          <BackButton onPress={handleGoBack} style={{ marginBottom: spacing.md }} />

          {/* Title */}
          <Typography variant="h1" style={styles.title}>
            Practice{"\n"}Setup
          </Typography>
          <Typography variant="body" weight="medium" color="textSecondary" style={styles.subtitle}>
            Choose a speech to preview, generate your own, or try a random topic!
          </Typography>

          {/* Tabs */}
          <FilterTabs
            tabs={tabOptions}
            selected={selectedTab}
            onSelect={setSelectedTab}
          />

          {/* Generate tab: only show button */}
          {selectedTab === 'generate' && (
            <>
              <PrimaryButton
                title="Generate Speech"
                onPress={handleOpenGenerate}
                variant="primary"
                size="medium"
                style={styles.generateButton}
              />

              {/* Show existing generated scripts below */}
              <View style={styles.listWrap}>
                {visibleScripts.length > 0 && (
                  <Typography variant="caption" color="textSecondary" weight="medium" style={styles.sectionLabel}>
                    Your Generated Scripts
                  </Typography>
                )}
                {visibleScripts.map((script) => (
                  <TouchableOpacity
                    key={script.id}
                    activeOpacity={0.9}
                    onPress={() => handleScriptPress(script)}
                  >
                    <Card style={styles.scriptCard} padding={spacing.md}>
                      <Typography variant="body" weight="bold" style={styles.scriptTitle}>
                        {script.title}
                      </Typography>
                      <Typography
                        variant="bodySmall"
                        color="textSecondary"
                        numberOfLines={3}
                        style={styles.scriptBody}
                      >
                        {script.content}
                      </Typography>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Randomizer tab */}
          {selectedTab === 'randomizer' && (
            <View style={styles.randomizerWrap}>
              <Card style={styles.randomizerCard} padding={spacing.lg}>
                <Ionicons name="shuffle" size={32} color={colors.primary} style={{ alignSelf: 'center', marginBottom: spacing.sm }} />
                <Typography variant="h3" align="center" style={{ marginBottom: spacing.xs }}>
                  {randomTopic?.title || 'Surprise Topic'}
                </Typography>
                <Typography variant="bodySmall" color="textSecondary" align="center" style={{ marginBottom: spacing.md, lineHeight: 20 }}>
                  {randomTopic?.body || 'Press shuffle to get a random topic!'}
                </Typography>
                <View style={styles.randomizerActions}>
                  <PrimaryButton
                    title="Shuffle"
                    onPress={shuffleRandomTopic}
                    variant="outline"
                    size="medium"
                    style={{ flex: 1 }}
                  />
                  <PrimaryButton
                    title="Start"
                    onPress={handleStartRandomTopic}
                    variant="primary"
                    size="medium"
                    style={{ flex: 1 }}
                  />
                </View>
              </Card>
              <Typography variant="caption" color="textSecondary" align="center" style={{ marginTop: spacing.sm }}>
                Get a surprise topic and practice speaking about it!
              </Typography>
            </View>
          )}

          {/* Pre-written list */}
          {selectedTab === 'prewritten' && (
            <View style={styles.listWrap}>
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: spacing.lg }} />
              ) : visibleScripts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="document-text-outline" size={48} color={colors.textSecondary} style={{ marginBottom: spacing.sm }} />
                  <Typography variant="bodySmall" color="textSecondary" align="center">
                    No scripts yet. Write one from the Scripts tab or generate one!
                  </Typography>
                </View>
              ) : (
                visibleScripts.map((script) => (
                  <TouchableOpacity
                    key={script.id}
                    activeOpacity={0.9}
                    onPress={() => handleScriptPress(script)}
                  >
                    <Card style={styles.scriptCard} padding={spacing.md}>
                      <Typography variant="body" weight="bold" style={styles.scriptTitle}>
                        {script.title}
                      </Typography>
                      <Typography
                        variant="bodySmall"
                        color="textSecondary"
                        numberOfLines={3}
                        style={styles.scriptBody}
                      >
                        {script.content}
                      </Typography>
                    </Card>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {/* Footer */}
          <PrimaryButton
            title="Cancel"
            onPress={handleCancel}
            variant="outline"
            size="large"
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>

      {/* ── Teleprompter Preview Modal ── */}
      <Modal
        visible={showPreview}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPreview(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Typography variant="h3" numberOfLines={1} style={{ flex: 1 }}>
                {previewScript?.title || 'Script Preview'}
              </Typography>
              <TouchableOpacity
                onPress={() => setShowPreview(false)}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Script content (teleprompter preview) */}
            <ScrollView style={styles.modalScriptScroll} showsVerticalScrollIndicator>
              <Typography variant="body" style={styles.modalScriptText}>
                {previewScript?.content || previewScript?.body || 'No content available.'}
              </Typography>
            </ScrollView>

            {/* Actions */}
            <View style={styles.modalActions}>
              <PrimaryButton
                title="Close"
                onPress={() => setShowPreview(false)}
                variant="outline"
                size="medium"
                style={{ flex: 1 }}
              />
              <PrimaryButton
                title="Start Practice"
                onPress={handleStartPractice}
                variant="primary"
                size="medium"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  contentWrap: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },

  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  listWrap: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  generateButton: {
    marginTop: spacing.md,
  },
  scriptCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
  },
  scriptTitle: {
    marginBottom: spacing.xs,
  },
  scriptBody: {
    lineHeight: 18,
  },
  cancelButton: {
    width: '100%',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },

  /* Randomizer */
  randomizerWrap: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  randomizerCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'rgba(251, 175, 0, 0.06)',
  },
  randomizerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  /* Teleprompter Preview Modal */
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
  modalScriptScroll: {
    maxHeight: 350,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  modalScriptText: {
    lineHeight: 26,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});

export default PracticeScreen;
