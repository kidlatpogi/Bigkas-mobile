import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import Card from '../../components/common/Card';
import PrimaryButton from '../../components/common/PrimaryButton';
import AudioRecordButton from '../../components/audio/AudioRecordButton';
import AudioLevelIndicator from '../../components/audio/AudioLevelIndicator';
import { useSessions } from '../../hooks/useSessions';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

const PracticeScreen = ({ navigation }) => {
  const { practiceWords, fetchPracticeWords, uploadAudio, isLoading } = useSessions();

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    fetchPracticeWords();
  }, [fetchPracticeWords]);

  const currentWord = practiceWords[currentWordIndex] || {
    text: 'Kumusta',
    translation: 'Hello / How are you?',
    difficulty: 'easy',
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleRecordPress = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setIsProcessing(true);

      // TODO: Implement actual audio recording stop and upload
      // Simulating processing delay
      setTimeout(() => {
        setIsProcessing(false);
        // Navigate to results or show feedback
        navigation.navigate('SessionResult', {
          word: currentWord.text,
          score: 0.85, // Placeholder score
        });
      }, 2000);
    } else {
      // Start recording
      setIsRecording(true);
      // TODO: Implement actual audio recording start
      
      // Simulate audio level changes for visualization
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 0.8 + 0.2);
      }, 100);

      // Store interval for cleanup
      setTimeout(() => clearInterval(interval), 60000);
    }
  };

  const handleSkip = () => {
    if (currentWordIndex < practiceWords.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
    } else {
      setCurrentWordIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex((prev) => prev - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.black} />
          </TouchableOpacity>
          <Typography variant="h3" align="center">
            Practice
          </Typography>
          <View style={styles.headerSpacer} />
        </View>

        <Typography variant="bodySmall" color="textSecondary" align="center">
          Speak the word clearly
        </Typography>

        {/* Word Card */}
        <Card style={styles.wordCard}>
          <Typography variant="caption" color="textSecondary" align="center">
            {currentWord.difficulty?.toUpperCase() || 'BEGINNER'}
          </Typography>
          <Typography variant="h1" align="center" style={styles.wordText}>
            {currentWord.text}
          </Typography>
          <Typography variant="body" color="textSecondary" align="center">
            {currentWord.translation}
          </Typography>
        </Card>

        {/* Audio Visualizer */}
        <View style={styles.visualizerContainer}>
          <AudioLevelIndicator
            level={audioLevel}
            isActive={isRecording}
            barCount={7}
            width={200}
            height={60}
          />
        </View>

        {/* Recording Status */}
        <View style={styles.statusContainer}>
          <Typography
            variant="body"
            color={isRecording ? 'error' : 'textSecondary'}
            align="center"
          >
            {isRecording
              ? 'Recording...'
              : isProcessing
              ? 'Processing...'
              : 'Tap to record'}
          </Typography>
        </View>

        {/* Record Button */}
        <View style={styles.recordContainer}>
          <AudioRecordButton
            isRecording={isRecording}
            isProcessing={isProcessing}
            onPress={handleRecordPress}
            size={100}
          />
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navButtons}>
          <PrimaryButton
            title="Previous"
            onPress={handlePrevious}
            variant="outline"
            size="small"
            disabled={currentWordIndex === 0}
            style={styles.navButton}
          />
          <PrimaryButton
            title="Skip"
            onPress={handleSkip}
            variant="secondary"
            size="small"
            style={styles.navButton}
          />
        </View>

        {/* Progress */}
        <View style={styles.progress}>
          <Typography variant="caption" color="textSecondary" align="center">
            Word {currentWordIndex + 1} of {practiceWords.length || 1}
          </Typography>
        </View>
      </ScrollView>
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
    padding: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  wordCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  wordText: {
    marginVertical: spacing.sm,
  },
  visualizerContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusContainer: {
    marginBottom: spacing.sm,
  },
  recordContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  navButton: {
    marginHorizontal: spacing.sm,
    minWidth: 100,
  },
  progress: {
    marginTop: spacing.md,
  },
});

export default PracticeScreen;
