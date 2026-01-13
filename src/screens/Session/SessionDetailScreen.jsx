import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '../../components/common/Typography';
import Card from '../../components/common/Card';
import PrimaryButton from '../../components/common/PrimaryButton';
import { useSessions } from '../../hooks/useSessions';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { formatDate, formatDuration, formatScore } from '../../utils/formatters';

const SessionDetailScreen = ({ route, navigation }) => {
  const { sessionId } = route.params || {};
  const { currentSession, fetchSessionById, isLoading, clearCurrentSession } = useSessions();

  useEffect(() => {
    if (sessionId) {
      fetchSessionById(sessionId);
    }

    return () => {
      clearCurrentSession();
    };
  }, [sessionId, fetchSessionById, clearCurrentSession]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePracticeAgain = () => {
    navigation.navigate('Practice');
  };

  if (isLoading || !currentSession) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Typography variant="body" color="textSecondary" style={styles.loadingText}>
            Loading session...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h3">Session Details</Typography>
          <Typography variant="bodySmall" color="textSecondary">
            {formatDate(currentSession.createdAt, 'datetime')}
          </Typography>
        </View>

        {/* Score Card */}
        <Card style={styles.scoreCard}>
          <Typography variant="caption" color="textSecondary" align="center">
            Overall Score
          </Typography>
          <Typography variant="display" color="primary" align="center">
            {formatScore(currentSession.score || 0)}
          </Typography>
        </Card>

        {/* Word/Phrase Card */}
        <Card style={styles.wordCard}>
          <Typography variant="caption" color="textSecondary">
            Practiced Text
          </Typography>
          <Typography variant="h4" style={styles.wordText}>
            {currentSession.targetText || 'N/A'}
          </Typography>
          {currentSession.translation && (
            <Typography variant="body" color="textSecondary">
              {currentSession.translation}
            </Typography>
          )}
        </Card>

        {/* Details Card */}
        <Card style={styles.detailsCard}>
          <Typography variant="h4" style={styles.cardTitle}>
            Session Info
          </Typography>

          <View style={styles.detailRow}>
            <Typography variant="body" color="textSecondary">
              Duration
            </Typography>
            <Typography variant="body">
              {formatDuration(currentSession.duration || 0)}
            </Typography>
          </View>

          <View style={styles.detailRow}>
            <Typography variant="body" color="textSecondary">
              Attempts
            </Typography>
            <Typography variant="body">
              {currentSession.attempts || 1}
            </Typography>
          </View>

          <View style={styles.detailRow}>
            <Typography variant="body" color="textSecondary">
              Difficulty
            </Typography>
            <Typography variant="body">
              {currentSession.difficulty || 'Standard'}
            </Typography>
          </View>
        </Card>

        {/* Feedback Card */}
        {currentSession.feedback && (
          <Card style={styles.feedbackCard}>
            <Typography variant="h4" style={styles.cardTitle}>
              Feedback
            </Typography>
            <Typography variant="body" color="textSecondary">
              {currentSession.feedback}
            </Typography>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <PrimaryButton
            title="Practice Again"
            onPress={handlePracticeAgain}
            style={styles.actionButton}
          />
          <PrimaryButton
            title="Go Back"
            onPress={handleGoBack}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
  },
  scrollContent: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  scoreCard: {
    padding: spacing.xl,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  wordCard: {
    marginBottom: spacing.md,
  },
  wordText: {
    marginVertical: spacing.sm,
  },
  detailsCard: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  feedbackCard: {
    marginBottom: spacing.md,
  },
  actionButtons: {
    marginTop: spacing.lg,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
});

export default SessionDetailScreen;
