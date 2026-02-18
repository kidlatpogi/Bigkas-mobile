import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import PrimaryButton from '../../components/common/PrimaryButton';
import BackButton from '../../components/common/BackButton';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

const DetailedFeedbackScreen = ({ route, navigation }) => {
  const {
    resultMode = 'training',
    timelinePoints = [
      { time: '1:00', value: 32 },
      { time: '2:00', value: 62 },
      { time: '3:00', value: 38 },
      { time: '4:00', value: 52 },
    ],
    eyeContact = { score: 67, status: 'MAINTAINED', note: 'Focus needs more practice' },
    bodyGestures = { status: 'GOOD', note: 'Natural hand movements detected' },
    voice = { status: 'EXCELLENT', note: 'Pronunciation and diction are improving' },
    trainingParams,
    feedbackItems = [
      {
        title: 'Strong Eye Contact',
        time: '0:12',
        body: 'Excellent start. You maintained direct eye contact with the camera during your entire opening statement.',
        tone: 'primary',
      },
      {
        title: 'Confident Vocal Energy',
        time: '0:18',
        body: 'Great enthusiasm. You projected your voice clearly and kept your tone engaging throughout the key points.',
        tone: 'info',
      },
      {
        title: 'Clear Pace and Pauses',
        time: '0:24',
        body: 'You slowed down on important ideas and used brief pauses, which made your message easier to follow.',
        tone: 'warning',
      },
      {
        title: 'Effective Hand Gestures',
        time: '0:31',
        body: 'You used open palms while explaining core concept. This helped emphasize your points naturally.',
        tone: 'primary',
      },
    ],
  } = route.params || {};

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Dashboard' });
    }
  };

  const handlePracticeAgain = () => {
    if (resultMode === 'practice') {
      navigation.navigate('Practice');
      return;
    }
    if (trainingParams) {
      navigation.replace('TrainingScripted', trainingParams);
      return;
    }
    navigation.navigate('TrainingSetup');
  };

  const handleCancel = () => {
    navigation.navigate('MainTabs', { screen: 'Dashboard' });
  };

  const toneColor = (tone) => {
    if (tone === 'warning') return 'rgba(251, 175, 0, 0.7)';
    if (tone === 'info') return 'rgba(1, 1, 1, 0.2)';
    return 'rgba(251, 175, 0, 0.35)';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={handleGoBack} />
        </View>

        <Typography variant="h1" align="center" style={styles.title}>
          Detailed
          {'\n'}Feedback
        </Typography>

        <Typography variant="caption" color="textSecondary" style={styles.sectionEyebrow}>
          PERFORMANCE FLOW
        </Typography>
        <Typography variant="h4" style={styles.sectionTitle}>
          TIMELINE
        </Typography>

        <View style={styles.timelineCard}>
          <View style={styles.timelineGrid}>
            {timelinePoints.map((point, idx) => (
              <View key={`grid-${idx}`} style={styles.timelineColumn}>
                <View style={[styles.timelineBar, { height: 40 + point.value * 0.6 }]}>
                  <View style={styles.timelineSegmentPrimary} />
                  <View style={styles.timelineSegmentAccent} />
                  <View style={styles.timelineSegmentMuted} />
                </View>
              </View>
            ))}
          </View>
          <View style={styles.timelineLabels}>
            {timelinePoints.map((point) => (
              <Typography key={point.time} variant="caption" color="textSecondary">
                {point.time}
              </Typography>
            ))}
          </View>
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: 'rgba(251, 175, 0, 0.7)' }]} />
            <Typography variant="caption" color="textSecondary">EYECONTACT</Typography>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: 'rgba(1, 1, 1, 0.3)' }]} />
            <Typography variant="caption" color="textSecondary">BODY GESTURES</Typography>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: 'rgba(251, 175, 0, 0.4)' }]} />
            <Typography variant="caption" color="textSecondary">VOICE</Typography>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, styles.metricHalf]}
          >
            <Typography variant="caption" color="textSecondary">EYE CONTACT</Typography>
            <View style={styles.metricScoreRow}>
              <Typography variant="h2" style={styles.metricScore}>{eyeContact.score}%</Typography>
              <Typography variant="caption" color="textSecondary" style={styles.metricLabel}>{eyeContact.status}</Typography>
            </View>
            <Typography variant="caption" color="textSecondary">{eyeContact.note}</Typography>
          </View>

          <View style={[styles.metricCard, styles.metricHalf]}
          >
            <Typography variant="caption" color="textSecondary">BODY GESTURES</Typography>
            <View style={styles.metricScoreRow}>
              <Typography variant="h2" style={styles.metricScore}>{bodyGestures.status}</Typography>
            </View>
            <Typography variant="caption" color="textSecondary">{bodyGestures.note}</Typography>
          </View>
        </View>

        <View style={styles.metricCard}>
          <Typography variant="caption" color="textSecondary">VOICE</Typography>
          <View style={styles.metricScoreRow}>
            <Typography variant="h2" style={styles.metricScore}>{voice.status}</Typography>
          </View>
          <View style={styles.metricTrack}>
            <View style={styles.metricFill} />
          </View>
          <Typography variant="caption" color="textSecondary">{voice.note}</Typography>
        </View>

        <View style={styles.feedbackList}>
          {feedbackItems.map((item, idx) => (
            <View key={`feedback-${idx}`} style={[styles.feedbackCard, { borderColor: toneColor(item.tone) }]}> 
              <View style={styles.feedbackHeader}>
                <Typography variant="body" weight="bold">{item.title}</Typography>
                <Typography variant="bodySmall" color="textSecondary">{item.time}</Typography>
              </View>
              <Typography variant="bodySmall" color="textSecondary">{item.body}</Typography>
            </View>
          ))}
        </View>

        <PrimaryButton
          title={resultMode === 'training' ? 'Train Again' : 'Practice Again'}
          onPress={handlePracticeAgain}
          style={styles.primaryButton}
        />
        <PrimaryButton title="Go Home" onPress={handleCancel} variant="outline" style={styles.secondaryButton} />
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
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.sm,
  },

  title: {
    marginBottom: spacing.md,
  },
  sectionEyebrow: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  timelineCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  timelineGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minHeight: 160,
  },
  timelineColumn: {
    flex: 1,
    alignItems: 'center',
  },
  timelineBar: {
    width: 36,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: 'rgba(1, 1, 1, 0.05)',
    justifyContent: 'space-between',
  },
  timelineSegmentPrimary: {
    height: '35%',
    backgroundColor: 'rgba(251, 175, 0, 0.75)',
  },
  timelineSegmentAccent: {
    height: '30%',
    backgroundColor: 'rgba(1, 1, 1, 0.2)',
  },
  timelineSegmentMuted: {
    height: '35%',
    backgroundColor: 'rgba(251, 175, 0, 0.35)',
  },
  timelineLabels: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metricHalf: {
    flex: 1,
  },
  metricCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  metricScoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
    marginVertical: spacing.xs,
  },
  metricScore: {
    fontWeight: '700',
    color: colors.black,
  },
  metricLabel: {
    marginBottom: 2,
  },
  metricTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.gray200,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  metricFill: {
    width: '70%',
    height: '100%',
    backgroundColor: colors.primary,
  },
  feedbackList: {
    marginTop: spacing.md,
  },
  feedbackCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  primaryButton: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  secondaryButton: {
    marginBottom: spacing.sm,
  },
});

export default DetailedFeedbackScreen;
