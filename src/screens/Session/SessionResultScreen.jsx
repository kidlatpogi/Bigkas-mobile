import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '../../components/common/Typography';
import Card from '../../components/common/Card';
import PrimaryButton from '../../components/common/PrimaryButton';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { formatScore } from '../../utils/formatters';

const SessionResultScreen = ({ route, navigation }) => {
  const { word, score, feedback } = route.params || {};

  const getScoreColor = () => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };

  const getScoreMessage = () => {
    if (score >= 0.9) return 'Excellent! Perfect pronunciation!';
    if (score >= 0.8) return 'Great job! Very good pronunciation!';
    if (score >= 0.7) return 'Good effort! Keep practicing!';
    if (score >= 0.6) return 'Not bad! Try again for better results.';
    return 'Keep practicing! You\'ll improve with time.';
  };

  const handleTryAgain = () => {
    navigation.goBack();
  };

  const handleNextWord = () => {
    navigation.navigate('Practice');
  };

  const handleViewHistory = () => {
    navigation.navigate('History');
  };

  const handleGoToDashboard = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h3" align="center">
            Results
          </Typography>
        </View>

        {/* Score Card */}
        <Card style={styles.scoreCard}>
          <Typography variant="caption" color="textSecondary" align="center">
            Your Score
          </Typography>
          <Typography
            variant="display"
            color={getScoreColor()}
            align="center"
            style={styles.scoreText}
          >
            {formatScore(score || 0)}
          </Typography>
          <Typography variant="body" color="textSecondary" align="center">
            {getScoreMessage()}
          </Typography>
        </Card>

        {/* Word Card */}
        <Card style={styles.wordCard}>
          <Typography variant="caption" color="textSecondary" align="center">
            Word Practiced
          </Typography>
          <Typography variant="h2" align="center" style={styles.wordText}>
            {word || 'N/A'}
          </Typography>
        </Card>

        {/* Feedback Card */}
        {feedback && (
          <Card style={styles.feedbackCard}>
            <Typography variant="h4" style={styles.cardTitle}>
              Pronunciation Tips
            </Typography>
            <Typography variant="body" color="textSecondary">
              {feedback}
            </Typography>
          </Card>
        )}

        {/* Score Breakdown (Placeholder) */}
        <Card style={styles.breakdownCard}>
          <Typography variant="h4" style={styles.cardTitle}>
            Score Breakdown
          </Typography>
          
          <View style={styles.breakdownRow}>
            <Typography variant="body">Accuracy</Typography>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${(score || 0) * 100}%` }]} />
            </View>
            <Typography variant="bodySmall">{formatScore(score || 0)}</Typography>
          </View>

          <View style={styles.breakdownRow}>
            <Typography variant="body">Fluency</Typography>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${((score || 0) * 0.9) * 100}%` }]} />
            </View>
            <Typography variant="bodySmall">{formatScore((score || 0) * 0.9)}</Typography>
          </View>

          <View style={styles.breakdownRow}>
            <Typography variant="body">Clarity</Typography>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${((score || 0) * 0.95) * 100}%` }]} />
            </View>
            <Typography variant="bodySmall">{formatScore((score || 0) * 0.95)}</Typography>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <PrimaryButton
            title="Try Again"
            onPress={handleTryAgain}
            style={styles.actionButton}
          />
          <PrimaryButton
            title="Next Word"
            onPress={handleNextWord}
            variant="secondary"
            style={styles.actionButton}
          />
          <PrimaryButton
            title="View History"
            onPress={handleViewHistory}
            variant="outline"
            style={styles.actionButton}
          />
          <PrimaryButton
            title="Go to Dashboard"
            onPress={handleGoToDashboard}
            variant="outline"
            style={styles.actionButton}
          />
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
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  scoreCard: {
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  scoreText: {
    marginVertical: spacing.md,
  },
  wordCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  wordText: {
    marginTop: spacing.sm,
  },
  feedbackCard: {
    marginBottom: spacing.md,
  },
  breakdownCard: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: 4,
    marginHorizontal: spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  actionButtons: {
    marginTop: spacing.lg,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
});

export default SessionResultScreen;
