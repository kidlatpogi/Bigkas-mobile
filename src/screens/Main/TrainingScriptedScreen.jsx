import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Text,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, Camera } from 'expo-camera';
import { Audio } from 'expo-audio';
import Typography from '../../components/common/Typography';
import PrimaryButton from '../../components/common/PrimaryButton';
import AudioLevelIndicator from '../../components/audio/AudioLevelIndicator';
import BackButton from '../../components/common/BackButton';
import { fetchScriptById } from '../../api/scriptsApi';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

const { width: screenWidth } = Dimensions.get('window');

/**
 * TrainingScriptedScreen — Live training/teleprompter with script reading.
 *
 * Layout (top -> bottom):
 * 1. Header: back button | script title | settings icon
 * 2. Camera feed (user's face) below header with reduced opacity
 * 3. "Training" title
 * 4. Script text (scrollable teleprompter) with WPM highlighting
 * 5. Audio waveform visualizer
 * 6. Recording indicator (red circle + "Recording")
 * 7. Control buttons (Pause | Record | Restart)
 *
 * Features:
 * - Real-time camera feed showing user's face
 * - Live microphone audio capture with enhanced waveform
 * - 3-2-1 countdown before auto-starting recording
 * - WPM (Words Per Minute) highlighting on script
 * - Teleprompter settings: font size, auto-scroll, WPM
 *
 * State Variables (for web version reuse):
 * - scriptId: selected script ID from route params
 * - scriptData: { title, body, type } fetched from Supabase
 * - isRecording: boolean recording state
 * - isPaused: boolean pause state
 * - audioLevel: number 0-1 for visualizer
 * - showSettings: boolean settings modal visibility
 * - teleprompterSettings: { fontSize, scrollSpeed, autoScroll, wpm }
 * - showCountdown: boolean countdown modal visibility
 * - countdownValue: number 3-0 countdown display
 * - cameraUri: string camera photo URI
 * - cameraPermission: boolean camera access granted
 * - highlightedWordIndex: number current highlighted word position
 * - recordingDuration: number elapsed seconds
 */
const TrainingScriptedScreen = ({ navigation, route }) => {
  // Route params
  const { scriptId, focusMode, autoStart, entryPoint, scriptType, freeSpeechTopic, freeSpeechContext } = route?.params || {};
  const isFreeMode = focusMode === 'free';
  const resultMode = entryPoint === 'practice' ? 'practice' : 'training';

  // Script state
  const [scriptData, setScriptData] = useState(null);
  const [isLoadingScript, setIsLoadingScript] = useState(true);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Countdown state
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);

  // Camera state
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [cameraUri, setCameraUri] = useState(null);

  // Teleprompter settings state
  const [showSettings, setShowSettings] = useState(false);
  /** @type {number} fontSize - font size of script text (12-24) */
  const [fontSize, setFontSize] = useState(16);
  /** @type {number} scrollSpeed - auto-scroll speed (0 = off, 1-10 = speed) */
  const [scrollSpeed, setScrollSpeed] = useState(0);
  /** @type {boolean} autoScroll - enable auto-scroll */
  const [autoScroll, setAutoScroll] = useState(false);
  /** @type {number} wpm - words per minute for highlighting (60-200) */
  const [wpm, setWpm] = useState(120);

  // WPM highlighting state
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(0);

  // Memoize words array so it doesn't re-split on every render
  const scriptWords = useMemo(() => {
    if (!scriptData?.body) return [];
    return scriptData.body.split(/\s+/);
  }, [scriptData]);

  // Audio effect refs
  const audioLevelRefs = useRef([]);
  const recordingTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const hasAutoStartedRef = useRef(false);

  // Scroll ref for teleprompter
  const scrollViewRef = React.useRef(null);
  const scrollAnimRef = React.useRef(new Animated.Value(0)).current;

  // Request camera permission on mount
  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
      setHasCamera(status === 'granted');
    };
    requestCameraPermission();
  }, []);

  // Load script on mount
  useEffect(() => {
    if (isFreeMode) {
      setScriptData(null);
      setIsLoadingScript(false);
      return;
    }
    const loadScript = async () => {
      setIsLoadingScript(true);
      try {
        // Fetch real script from Supabase
        const result = await fetchScriptById(scriptId);
        if (result.success && result.script) {
          setScriptData({
            id: result.script.id,
            title: result.script.title,
            body: result.script.content,
            type: result.script.type,
          });
        } else {
          console.error('Failed to load script:', result.error);
          // Fallback placeholder
          setScriptData({
            id: scriptId,
            title: 'Script',
            body: 'Failed to load script content. Please go back and try again.',
            type: scriptType || 'prewritten',
          });
        }
      } catch (error) {
        console.error('Failed to load script:', error);
        setScriptData({
          id: scriptId,
          title: 'Script',
          body: 'Failed to load script content. Please go back and try again.',
          type: scriptType || 'prewritten',
        });
      } finally {
        setIsLoadingScript(false);
      }
    };

    loadScript();
  }, [scriptId, isFreeMode]);

  // Countdown timer effect
  useEffect(() => {
    if (showCountdown && countdownValue > 0) {
      countdownTimerRef.current = setTimeout(() => {
        setCountdownValue(countdownValue - 1);
      }, 1000);
    } else if (showCountdown && countdownValue === 0) {
      // Auto-start recording
      setShowCountdown(false);
      setCountdownValue(3);
      setTimeout(() => {
        handleStartRecordingAuto();
      }, 500);
    }
    return () => clearTimeout(countdownTimerRef.current);
  }, [showCountdown, countdownValue]);

  // Auto-start countdown when arriving from a start action
  useEffect(() => {
    if (!autoStart) return;
    if (hasAutoStartedRef.current) return;
    if (isRecording || showCountdown || (!isFreeMode && isLoadingScript)) return;
    hasAutoStartedRef.current = true;
    handleStartCountdown();
  }, [autoStart, isRecording, showCountdown, isLoadingScript, isFreeMode]);

  // Recording duration timer effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordingTimerRef.current);
    }
    return () => clearInterval(recordingTimerRef.current);
  }, [isRecording, isPaused]);

  // Simulate real microphone audio level with more natural fluctuation
  useEffect(() => {
    if (isRecording && !isPaused) {
      const interval = setInterval(() => {
        // Simulate realistic audio level with peaks and valleys
        const baseLevel = Math.random() * 0.4 + 0.1;
        const peak = Math.sin(Date.now() / 500) * 0.3;
        const level = Math.max(0, Math.min(1, baseLevel + peak));
        setAudioLevel(level);

        // Store audio levels for waveform history
        audioLevelRefs.current.push(level);
        if (audioLevelRefs.current.length > 50) {
          audioLevelRefs.current.shift();
        }
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
      audioLevelRefs.current = [];
    }
  }, [isRecording, isPaused]);

  // WPM highlighting effect - update highlighted word based on WPM and recording time
  useEffect(() => {
    if (isRecording && !isPaused && scriptWords.length > 0) {
      const wordsPerSecond = wpm / 60;
      const wordsElapsed = Math.floor(recordingDuration * wordsPerSecond);
      setHighlightedWordIndex(Math.min(wordsElapsed, scriptWords.length - 1));
    }
  }, [recordingDuration, wpm, isRecording, isPaused, scriptWords]);

  const handleGoBack = () => {
    if (isRecording) {
      if (!isPaused) {
        setIsPaused(true);
      }
      Alert.alert(
        'Session paused',
        'Your session is paused. Do you want to exit and lose this recording?',
        [
          { text: 'Stay', style: 'cancel' },
          {
            text: 'Exit',
            style: 'destructive',
            onPress: () => {
              setIsRecording(false);
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('MainTabs', { screen: 'Dashboard' });
              }
            },
          },
        ]
      );
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Dashboard' });
    }
  };

  const handleCaptureCameraPhoto = async () => {
    if (cameraRef && hasCamera) {
      try {
        const photo = await cameraRef.takePictureAsync({ quality: 0.6 });
        setCameraUri(photo.uri);
      } catch (error) {
        console.error('Camera capture error:', error);
      }
    }
  };

  const handleStartCountdown = () => {
    setShowCountdown(true);
    setCountdownValue(3);
  };

  const handleStartRecordingAuto = async () => {
    try {
      // TODO: Start real audio recording using expo-audio
      // const { recording } = await Audio.createRecordingAsync({
      //   isMeteringEnabled: true,
      //   android: { extension: '.m4a', outputFormat: 2, audioEncoder: 1 },
      //   ios: { extension: '.caf', outputFormat: Audio.RecordingPresets.HIGH_QUALITY.ios.outputFormat },
      // });
      // await recording.startAsync();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingDuration(0);
      setHighlightedWordIndex(0);
      console.info('Start recording with microphone', { scriptId, focusMode });
    } catch (error) {
      console.error('Recording error:', error);
    }
  };

  const handleRecordPress = () => {
    if (isRecording) {
      if (!isPaused) {
        setIsPaused(true);
      }
      Alert.alert(
        'Stop recording?',
        'Your session will end and your results will be generated.',
        [
          { text: 'Continue', style: 'cancel', onPress: () => setIsPaused(false) },
          {
            text: 'Stop',
            style: 'destructive',
            onPress: () => {
              // Stop recording
              setIsRecording(false);
              setIsPaused(false);
              // TODO: Upload audio to Supabase with scriptId + focusMode.
              console.info('Stop recording', { scriptId, focusMode, duration: recordingDuration });
              navigation.navigate('SessionResult', {
                confidenceScore: 72,
                summary: 'Great effort! You\'re consistently improving your delivery.',
                pitchStability: 'GOOD',
                paceWpm: 145,
                paceRating: 'NEEDS WORK',
                resultMode,
                freeSpeechTopic: freeSpeechTopic || freeSpeechContext || null,
                trainingParams: {
                  scriptId,
                  focusMode,
                  scriptType,
                  autoStart: true,
                  entryPoint,
                  freeSpeechTopic,
                  freeSpeechContext,
                },
              });
            },
          },
        ]
      );
    } else {
      // Start countdown
      handleStartCountdown();
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
    setRecordingDuration(0);
    setHighlightedWordIndex(0);
    audioLevelRefs.current = [];
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

  // Format duration as MM:SS
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get highlighted script text with per-word coloring based on WPM
  const getHighlightedScript = () => {
    if (!scriptData) return '';
    const words = scriptData.body.split(/\s+/);
    return words
      .map((word, idx) => {
        if (idx < highlightedWordIndex) {
          return `${word} `; // Already spoken
        } else if (idx === highlightedWordIndex && isRecording && !isPaused) {
          return `${word} `; // Currently speaking (will be highlighted in jsx)
        }
        return `${word} `;
      })
      .join('')
      .trim();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleGoBack} />

        <Typography variant="bodySmall" color="textSecondary" style={styles.scriptTitle}>
          {isFreeMode
            ? (freeSpeechTopic ? `Free Speech: ${freeSpeechTopic}` : 'Free Speech')
            : scriptData?.title || 'Loading...'}
        </Typography>

        {!isFreeMode && (
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleOpenSettings}
            activeOpacity={0.7}
          >
            <Ionicons name="settings" size={22} color={colors.black} />
          </TouchableOpacity>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Title */}
        <Typography variant="h1" align="center" style={styles.title}>
          Training
        </Typography>

        {/* Recording Timer */}
        {isRecording && (
          <Typography
            variant="bodySmall"
            color="textSecondary"
            align="center"
            style={styles.durationTimer}
          >
            {formatDuration(recordingDuration)}
          </Typography>
        )}

        {/* Teleprompter Script Area */}
        {isLoadingScript && !isFreeMode ? (
          <View style={styles.loadingWrap}>
            <Typography variant="body" color="textSecondary">
              Loading script...
            </Typography>
          </View>
        ) : (
          <View style={styles.teleprompterCameraWrap}>
            {/* Camera Feed as background */}
            {hasCamera && cameraPermission && (
              <View
                style={[
                  styles.cameraContainer,
                  isFreeMode && styles.cameraContainerFull,
                ]}
              >
                <CameraView
                  ref={setCameraRef}
                  style={styles.cameraFeed}
                  facing="front"
                />
              </View>
            )}

            {/* Teleprompter text overlay on top of camera */}
            {!isFreeMode && (
              <ScrollView
                ref={scrollViewRef}
                style={styles.teleprompter}
                contentContainerStyle={styles.teleprompterContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={[styles.scriptBody, { fontSize, lineHeight: fontSize * 1.8 }]}>
                  {scriptWords.map((word, idx) => (
                    <Text
                      key={`${idx}-${word}`}
                      style={[
                        styles.scriptWord,
                        { fontSize, lineHeight: fontSize * 1.8 },
                        isRecording && !isPaused && idx < highlightedWordIndex && styles.scriptWordPassed,
                        isRecording && !isPaused && idx === highlightedWordIndex && styles.scriptWordCurrent,
                        isRecording && !isPaused && idx > highlightedWordIndex && styles.scriptWordFuture,
                        !isRecording && styles.scriptWordFuture,
                      ]}
                    >
                      {word}{' '}
                    </Text>
                  ))}
                </Text>
              </ScrollView>
            )}
          </View>
        )}

        {/* Enhanced Audio Waveform Visualizer */}
        <View style={styles.waveformContainer}>
          <View style={styles.waveform}>
            {audioLevelRefs.current.map((level, idx) => (
              <View
                key={idx}
                style={[
                  styles.waveformBar,
                  {
                    height: Math.max(8, level * 50),
                    opacity: 0.6 + level * 0.4,
                  },
                ]}
              />
            ))}
          </View>
          {isRecording && !isPaused && (
            <View
              style={[
                styles.waveformPeak,
                { height: Math.max(12, audioLevel * 60) },
              ]}
            />
          )}
        </View>

        {/* Recording Indicator */}
        <View style={styles.recordingIndicator}>
          {isRecording && (
            <>
              <Animated.View
                style={[
                  styles.recordingDot,
                  {
                    opacity: new Animated.Value(1),
                  },
                ]}
              />
              <Typography variant="bodySmall" weight="medium" style={styles.recordingText}>
                {isPaused ? 'Paused' : 'Recording'}
              </Typography>
            </>
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

      {/* Countdown Modal */}
      <Modal
        visible={showCountdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCountdown(false)}
      >
        <View style={styles.countdownOverlay}>
          <View style={styles.countdownBox}>
            {countdownValue > 0 ? (
              <>
                <Typography
                  variant="display"
                  align="center"
                  style={styles.countdownNumber}
                >
                  {countdownValue}
                </Typography>
                <Typography
                  variant="h4"
                  align="center"
                  color="textSecondary"
                  style={styles.countdownText}
                >
                  Get Ready
                </Typography>
              </>
            ) : (
              <Typography
                variant="h1"
                align="center"
                color="textPrimary"
                style={styles.startText}
              >
                Start!
              </Typography>
            )}
          </View>
        </View>
      </Modal>

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

            {/* Words Per Minute (WPM) */}
            <View style={styles.settingsSection}>
              <Typography variant="body" weight="bold" style={styles.settingLabel}>
                Words Per Minute: {wpm}
              </Typography>
              <View style={styles.sliderRow}>
                <TouchableOpacity
                  onPress={() => setWpm(Math.max(60, wpm - 10))}
                  style={styles.sliderButton}
                >
                  <Text style={styles.sliderButtonText}>−</Text>
                </TouchableOpacity>
                <View style={styles.sliderTrack}>
                  <View
                    style={[
                      styles.sliderFill,
                      { width: `${((wpm - 60) / 140) * 100}%` },
                    ]}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setWpm(Math.min(200, wpm + 10))}
                  style={styles.sliderButton}
                >
                  <Text style={styles.sliderButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <Typography
                variant="caption"
                color="textSecondary"
                style={styles.wpmHint}
              >
                Adjust based on your speaking pace (60–200 WPM)
              </Typography>
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

  // Camera styles — absolute background behind teleprompter
  cameraContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.45,
  },
  cameraContainerFull: {
    opacity: 1,
  },
  cameraFeed: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  title: {
    marginBottom: spacing.md,
  },
  durationTimer: {
    marginBottom: spacing.sm,
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teleprompterCameraWrap: {
    flex: 1,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  teleprompter: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    zIndex: 2,
  },
  teleprompterContent: {
    padding: spacing.md,
  },
  scriptBody: {
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  scriptWord: {
    textAlign: 'left',
    color: colors.textSecondary,
  },
  scriptWordPassed: {
    color: colors.textMuted,
  },
  scriptWordCurrent: {
    backgroundColor: colors.primary,
    color: colors.black,
    borderRadius: 2,
  },
  scriptWordFuture: {
    color: colors.textSecondary,
  },

  // Enhanced waveform visualization
  waveformContainer: {
    height: 80,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  waveformBar: {
    width: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  waveformPeak: {
    width: 8,
    backgroundColor: colors.error,
    borderRadius: 4,
    marginLeft: spacing.sm,
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

  // Countdown modal
  countdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  countdownBox: {
    alignItems: 'center',
    padding: spacing.xl,
    paddingVertical: spacing.xl,
    minWidth: 220,
  },
  countdownNumber: {
    fontSize: 120,
    lineHeight: 132,
    color: colors.primary,
    fontWeight: 'bold',
  },
  countdownText: {
    marginTop: spacing.md,
  },
  startText: {
    color: colors.success,
    fontSize: 64,
    lineHeight: 72,
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
  wpmHint: {
    marginTop: spacing.xs,
    fontStyle: 'italic',
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
