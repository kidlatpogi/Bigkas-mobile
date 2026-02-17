import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Text,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import PrimaryButton from '../../components/common/PrimaryButton';
import AudioLevelIndicator from '../../components/audio/AudioLevelIndicator';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * TrainingScriptedScreen — Live training/teleprompter with script reading.
 *
 * Layout (top -> bottom):
 * 1. Header: back button | script title | settings icon
 * 2. "Training" title
 * 3. Script text (scrollable teleprompter)
 * 4. Audio visualizer with bars
 * 5. Recording indicator (red circle + "Recording")
 * 6. Control buttons (Pause | Record | Restart)
 *
 * Fetches selected script from Supabase and displays as teleprompter.
 * Records audio while user reads the script.
 *
 * State Variables (for web version reuse):
 * - scriptId: selected script ID from route params
 * - scriptData: { title, body, type } fetched from Supabase
 * - isRecording: boolean recording state
 * - isPaused: boolean pause state
 * - audioLevel: number 0-1 for visualizer
 * - showSettings: boolean settings modal visibility
 * - teleprompterSettings: { fontSize, scrollSpeed, autoScroll }
 * - isLoading: boolean while fetching script
 */
const TrainingScriptedScreen = ({ navigation, route }) => {
  // Route params
  const { scriptId, focusMode } = route?.params || {};

  // Script state
  const [scriptData, setScriptData] = useState(null);
  const [isLoadingScript, setIsLoadingScript] = useState(true);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Teleprompter settings state
  const [showSettings, setShowSettings] = useState(false);
  /** @type {number} fontSize - font size of script text (12-24) */
  const [fontSize, setFontSize] = useState(16);
  /** @type {number} scrollSpeed - auto-scroll speed (0 = off, 1-10 = speed) */
  const [scrollSpeed, setScrollSpeed] = useState(0);
  /** @type {boolean} autoScroll - enable auto-scroll */
  const [autoScroll, setAutoScroll] = useState(false);

  // Scroll ref for teleprompter
  const scrollViewRef = React.useRef(null);
  const scrollAnimRef = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadScript = async () => {
      setIsLoadingScript(true);
      try {
        // TODO: Replace with Supabase query using scriptId.
        // Query: SELECT id, title, body, type FROM practice_scripts WHERE id = scriptId
        const mockScript = {
          id: scriptId,
          title: 'Graduation Draft 1',
          body: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).`,
          type: 'prewritten',
        };
        setScriptData(mockScript);
      } catch (error) {
        console.error('Failed to load script:', error);
      } finally {
        setIsLoadingScript(false);
      }
    };

    loadScript();
  }, [scriptId]);

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll && isRecording && !isPaused && scrollSpeed > 0) {
      const interval = setInterval(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollResponder?.scrollResponderScrollNativeHandleToKeyboard?.();
        }
      }, 1000 / (scrollSpeed * 2)); // Adjust speed
      return () => clearInterval(interval);
    }
  }, [autoScroll, isRecording, isPaused, scrollSpeed]);

  // Simulate audio level changes during recording
  useEffect(() => {
    if (isRecording && !isPaused) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 0.8 + 0.2);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isRecording, isPaused]);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Dashboard');
    }
  };

  const handleRecordPress = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // TODO: Upload audio to Supabase with scriptId + focusMode.
      console.info('Stop recording', { scriptId, focusMode });
    } else {
      // Start recording
      setIsRecording(true);
      setIsPaused(false);
      // TODO: Start audio recording.
      console.info('Start recording', { scriptId, focusMode });
    }
  };

  const handlePausePress = () => {
    if (isRecording) {
      setIsPaused(!isPaused);
      // TODO: Pause/resume audio recording on Supabase side.
      console.info('Pause toggled:', !isPaused);
    }
  };

  const handleRestartPress = () => {
    setIsRecording(false);
    setIsPaused(false);
    setAudioLevel(0);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
    // TODO: Reset audio and restart session.
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.black} />
        </TouchableOpacity>

        <Typography variant="bodySmall" color="textSecondary" style={styles.scriptTitle}>
          {scriptData?.title || 'Loading...'}
        </Typography>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleOpenSettings}
          activeOpacity={0.7}
        >
          <Ionicons name="settings" size={22} color={colors.black} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Title */}
        <Typography variant="h1" align="center" style={styles.title}>
          Training
        </Typography>

        {/* Teleprompter Script Area */}
        {isLoadingScript ? (
          <View style={styles.loadingWrap}>
            <Typography variant="body" color="textSecondary">
              Loading script...
            </Typography>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.teleprompter}
            contentContainerStyle={styles.teleprompterContent}
            showsVerticalScrollIndicator={false}
          >
            <Typography
              variant="body"
              color="textSecondary"
              style={[styles.scriptBody, { fontSize }]}
            >
              {scriptData?.body}
            </Typography>
          </ScrollView>
        )}

        {/* Audio Visualizer */}
        <View style={styles.visualizerContainer}>
          <AudioLevelIndicator
            level={audioLevel}
            isActive={isRecording && !isPaused}
            barCount={7}
            width={200}
            height={60}
          />
        </View>

        {/* Recording Indicator */}
        <View style={styles.recordingIndicator}>
          {isRecording && (
            <>
              <View style={styles.recordingDot} />
              <Typography variant="bodySmall" weight="medium" style={styles.recordingText}>
                Recording
              </Typography>
            </>
          )}
          {isPaused && isRecording && (
            <Typography variant="bodySmall" weight="medium" color="warning" style={styles.pausedText}>
              Paused
            </Typography>
          )}
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handlePausePress}
            disabled={!isRecording}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPaused ? 'play' : 'pause'}
              size={24}
              color={isRecording ? colors.black : colors.textMuted}
            />
            <Typography
              variant="caption"
              color={isRecording ? 'textPrimary' : 'textMuted'}
              align="center"
              style={styles.controlLabel}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Typography>
          </TouchableOpacity>

          {/* Record Button */}
          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordButtonActive]}
            onPress={handleRecordPress}
            activeOpacity={0.8}
          >
            <View style={styles.recordButtonInner}>
              <View
                style={[
                  styles.recordButtonDot,
                  isRecording && styles.recordButtonDotActive,
                ]}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleRestartPress}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={24} color={colors.black} />
            <Typography variant="caption" color="textPrimary" align="center" style={styles.controlLabel}>
              Restart
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        transparent
        animationType="slide"
        onRequestClose={handleCloseSettings}
      >
        <View style={styles.settingsOverlay}>
          <View style={styles.settingsPanel}>
            {/* Header */}
            <View style={styles.settingsHeader}>
              <Typography variant="h4">Teleprompter Settings</Typography>
              <TouchableOpacity onPress={handleCloseSettings}>
                <Ionicons name="close" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>

            {/* Font Size */}
            <View style={styles.settingsSection}>
              <Typography variant="body" weight="bold" style={styles.settingLabel}>
                Font Size: {fontSize}
              </Typography>
              <View style={styles.sliderRow}>
                <TouchableOpacity
                  onPress={() => setFontSize(Math.max(12, fontSize - 2))}
                  style={styles.sliderButton}
                >
                  <Text style={styles.sliderButtonText}>−</Text>
                </TouchableOpacity>
                <View style={styles.sliderTrack}>
                  <View
                    style={[
                      styles.sliderFill,
                      { width: `${((fontSize - 12) / 12) * 100}%` },
                    ]}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setFontSize(Math.min(24, fontSize + 2))}
                  style={styles.sliderButton}
                >
                  <Text style={styles.sliderButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Auto Scroll */}
            <View style={styles.settingsSection}>
              <Typography variant="body" weight="bold" style={styles.settingLabel}>
                Auto Scroll
              </Typography>
              <TouchableOpacity
                style={[styles.toggleButton, autoScroll && styles.toggleButtonActive]}
                onPress={() => setAutoScroll(!autoScroll)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.toggleDot,
                    autoScroll && styles.toggleDotActive,
                  ]}
                />
              </TouchableOpacity>
            </View>

            {/* Scroll Speed */}
            {autoScroll && (
              <View style={styles.settingsSection}>
                <Typography variant="body" weight="bold" style={styles.settingLabel}>
                  Scroll Speed: {scrollSpeed}
                </Typography>
                <View style={styles.sliderRow}>
                  <TouchableOpacity
                    onPress={() => setScrollSpeed(Math.max(0, scrollSpeed - 1))}
                    style={styles.sliderButton}
                  >
                    <Text style={styles.sliderButtonText}>−</Text>
                  </TouchableOpacity>
                  <View style={styles.sliderTrack}>
                    <View
                      style={[
                        styles.sliderFill,
                        { width: `${(scrollSpeed / 10) * 100}%` },
                      ]}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => setScrollSpeed(Math.min(10, scrollSpeed + 1))}
                    style={styles.sliderButton}
                  >
                    <Text style={styles.sliderButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Close Button */}
            <PrimaryButton
              title="Done"
              onPress={handleCloseSettings}
              variant="primary"
              size="large"
              style={styles.doneButton}
            />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scriptTitle: {
    flex: 1,
    textAlign: 'center',
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  title: {
    marginBottom: spacing.md,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teleprompter: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  teleprompterContent: {
    padding: spacing.md,
  },
  scriptBody: {
    lineHeight: 24,
    textAlign: 'left',
  },
  visualizerContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error,
  },
  recordingText: {
    color: colors.error,
  },
  pausedText: {
    color: colors.warning,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: spacing.md,
  },
  controlButton: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  controlLabel: {
    marginTop: spacing.xs,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    borderWidth: 4,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonActive: {
    borderColor: colors.error,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  recordButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
  },
  recordButtonDotActive: {
    backgroundColor: colors.error,
  },

  // Settings Modal
  settingsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  settingsPanel: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    maxHeight: '80%',
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  settingsSection: {
    marginBottom: spacing.lg,
  },
  settingLabel: {
    marginBottom: spacing.sm,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sliderButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray200,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  toggleButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gray200,
    padding: 2,
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
  },
  toggleDotActive: {
    alignSelf: 'flex-end',
  },
  doneButton: {
    backgroundColor: colors.primary,
    marginTop: spacing.md,
  },
});

export default TrainingScriptedScreen;
