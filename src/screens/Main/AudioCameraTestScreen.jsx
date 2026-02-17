import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, Camera } from 'expo-camera';
import { Audio } from 'expo-audio';
import Typography from '../../components/common/Typography';
import AudioLevelIndicator from '../../components/audio/AudioLevelIndicator';
import PrimaryButton from '../../components/common/PrimaryButton';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * AudioCameraTestScreen
 *
 * Hardware test screen accessible from Settings → "Test Audio / Video".
 * Allows users to preview their camera feed and test microphone input
 * with a real-time audio level visualizer.
 *
 * Route: AudioCameraTest (MainNavigator stack)
 *
 * State Variables:
 * - cameraPermission: boolean - whether camera permission is granted
 * - audioPermission: boolean - whether microphone permission is granted
 * - facing: 'front' | 'back' - active camera direction
 * - isMicTesting: boolean - whether microphone test is active
 * - audioLevel: number (0-1) - current simulated mic level
 * - cameraReady: boolean - whether the camera has finished initialising
 *
 * Handlers:
 * - handleGoBack: navigates back to Settings
 * - handleFlipCamera: toggles between front and back camera
 * - handleToggleMicTest: starts/stops microphone level monitoring
 */
const AudioCameraTestScreen = ({ navigation }) => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);
  const [facing, setFacing] = useState('front');
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);

  const micIntervalRef = useRef(null);

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      const camStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(camStatus.status === 'granted');

      const micStatus = await Camera.requestMicrophonePermissionsAsync();
      setAudioPermission(micStatus.status === 'granted');
    })();

    return () => {
      if (micIntervalRef.current) {
        clearInterval(micIntervalRef.current);
      }
    };
  }, []);

  const handleGoBack = () => {
    // Stop mic test before leaving
    if (micIntervalRef.current) {
      clearInterval(micIntervalRef.current);
    }
    navigation.goBack();
  };

  const handleFlipCamera = () => {
    setFacing((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  const handleToggleMicTest = useCallback(() => {
    if (isMicTesting) {
      // Stop
      if (micIntervalRef.current) {
        clearInterval(micIntervalRef.current);
        micIntervalRef.current = null;
      }
      setAudioLevel(0);
      setIsMicTesting(false);
    } else {
      // Start — simulate audio level fluctuation (matches TrainingScriptedScreen pattern)
      setIsMicTesting(true);
      micIntervalRef.current = setInterval(() => {
        setAudioLevel((prev) => {
          const delta = (Math.random() - 0.45) * 0.35;
          return Math.max(0.05, Math.min(0.95, prev + delta));
        });
      }, 120);
    }
  }, [isMicTesting]);

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Typography variant="h3">Test Audio / Video</Typography>
        <View style={styles.headerSpacer} />
      </View>

      {/* Camera Preview */}
      <View style={styles.cameraSection}>
        <Typography
          variant="caption"
          color="textSecondary"
          weight="medium"
          style={styles.sectionLabel}
        >
          CAMERA PREVIEW
        </Typography>

        <View style={styles.cameraContainer}>
          {cameraPermission ? (
            <CameraView
              style={styles.camera}
              facing={facing}
              onCameraReady={() => setCameraReady(true)}
            />
          ) : (
            <View style={styles.permissionPlaceholder}>
              <Ionicons
                name="videocam-off-outline"
                size={48}
                color={colors.textSecondary}
              />
              <Typography
                variant="bodySmall"
                color="textSecondary"
                align="center"
                style={{ marginTop: spacing.sm }}
              >
                Camera permission not granted
              </Typography>
            </View>
          )}

          {/* Flip camera button overlay */}
          {cameraPermission && (
            <TouchableOpacity
              style={styles.flipButton}
              onPress={handleFlipCamera}
              activeOpacity={0.7}
            >
              <Ionicons name="camera-reverse-outline" size={22} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>

        {/* Camera status */}
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: cameraPermission && cameraReady ? colors.success : colors.error },
            ]}
          />
          <Typography variant="caption" color="textSecondary">
            {cameraPermission
              ? cameraReady
                ? `${facing === 'front' ? 'Front' : 'Back'} camera active`
                : 'Initialising camera…'
              : 'Camera unavailable'}
          </Typography>
        </View>
      </View>

      {/* Microphone Test */}
      <View style={styles.micSection}>
        <Typography
          variant="caption"
          color="textSecondary"
          weight="medium"
          style={styles.sectionLabel}
        >
          MICROPHONE TEST
        </Typography>

        <View style={styles.micCard}>
          {/* Audio level visualiser */}
          <View style={styles.visualizerWrapper}>
            <AudioLevelIndicator
              level={audioLevel}
              isActive={isMicTesting}
              barCount={20}
              width={280}
              height={60}
              color={colors.primary}
            />
          </View>

          {/* Mic status */}
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: !audioPermission
                    ? colors.error
                    : isMicTesting
                    ? colors.success
                    : colors.warning,
                },
              ]}
            />
            <Typography variant="caption" color="textSecondary">
              {!audioPermission
                ? 'Microphone permission not granted'
                : isMicTesting
                ? 'Listening… speak into your microphone'
                : 'Tap the button below to test'}
            </Typography>
          </View>

          {/* Toggle button */}
          <PrimaryButton
            title={isMicTesting ? 'Stop Mic Test' : 'Start Mic Test'}
            onPress={handleToggleMicTest}
            variant={isMicTesting ? 'outline' : 'primary'}
            style={styles.micButton}
            disabled={!audioPermission}
          />
        </View>
      </View>

      {/* Done button */}
      <View style={styles.doneWrapper}>
        <PrimaryButton
          title="Done"
          onPress={handleGoBack}
          variant="secondary"
          style={styles.doneButton}
        />
      </View>
    </SafeAreaView>
  );
};

// ----------------------------------------------------------------
// Styles
// ----------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
  },

  /* Camera */
  cameraSection: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  cameraContainer: {
    width: '100%',
    height: 220,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.black,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  permissionPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipButton: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },

  /* Microphone */
  micSection: {
    marginBottom: spacing.md,
  },
  micCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  visualizerWrapper: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  micButton: {
    marginTop: spacing.sm,
  },

  /* Done */
  doneWrapper: {
    marginTop: 'auto',
    paddingBottom: spacing.lg,
  },
  doneButton: {
    width: '100%',
  },
});

export default AudioCameraTestScreen;
