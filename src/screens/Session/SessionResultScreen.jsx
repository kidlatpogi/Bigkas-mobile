import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import Card from '../../components/common/Card';
import PrimaryButton from '../../components/common/PrimaryButton';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

const SessionResultScreen = ({ route, navigation }) => {
  const {
    confidenceScore = 72,
    summary = "Great effort! You're consistently improving your delivery.",
    pitchStability = 'GOOD',
    paceWpm = 145,
    paceRating = 'NEEDS WORK',
  } = route.params || {};

  const waveBars = [
    10, 18, 14, 22, 12, 20, 16, 26, 14, 20, 12, 24, 16, 22, 12, 18,
  ];

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Dashboard');
    }
  };

  const handlePracticeAgain = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('TrainingSetup');
    }
  };

  const handleCancel = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={colors.black} />
          </TouchableOpacity>
        </View>

        <Typography variant="h1" align="center" style={styles.title}>
          Analysis
          {'\n'}Result
        </Typography>

        <View style={styles.scoreBlock}>
          <View style={styles.scoreRow}>
            <Typography variant="display" style={styles.scoreValue}>
              {confidenceScore}
            </Typography>
            <Typography variant="body" color="textSecondary" style={styles.scoreSuffix}>
              /100
            </Typography>
          </View>
          <Typography variant="caption" color="textSecondary" align="center">
            VOCAL CONFIDENCE SCORE
          </Typography>
          <Typography variant="body" color="textSecondary" align="center" style={styles.summaryText}>
            {summary}
          </Typography>
        </View>

        <Card style={styles.analysisCard}>
          <View style={styles.cardHeaderRow}>
            <Typography variant="bodySmall" weight="bold" style={styles.cardTitle}>
              PITCH STABILITY
            </Typography>
            <View style={[styles.badge, styles.badgeGood]}>
              <Typography variant="caption" style={styles.badgeText}>{pitchStability}</Typography>
            </View>
          </View>
          <View style={styles.waveformRow}>
            {waveBars.map((height, idx) => (
              <View key={`bar-${idx}`} style={[styles.waveBar, { height }]} />
            ))}
          </View>
          <Typography variant="caption" color="textSecondary">
            Steady tone maintained throughout
          </Typography>
        </Card>

        <Card style={styles.analysisCard}>
          <View style={styles.cardHeaderRow}>
            <Typography variant="bodySmall" weight="bold" style={styles.cardTitle}>
              SPEAKING PACE
            </Typography>
            <View style={[styles.badge, styles.badgeWarn]}>
              <Typography variant="caption" style={styles.badgeText}>{paceRating}</Typography>
            </View>
          </View>
          <View style={styles.paceRow}>
            <Typography variant="h2" style={styles.paceValue}>{paceWpm}</Typography>
            <Typography variant="caption" color="textSecondary" style={styles.paceUnit}>WPM</Typography>
          </View>
          <View style={styles.paceTrack}>
            <View style={[styles.paceFill, { width: '72%' }]} />
          </View>
          <Typography variant="caption" color="textSecondary">
            Slightly faster than recommended 120-130 wpm.
          </Typography>
        </Card>

        <TouchableOpacity style={styles.detailLink} activeOpacity={0.7}>
          <Typography variant="bodySmall" color="textSecondary">View Detailed Feedback</Typography>
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        <PrimaryButton title="Practice Again" onPress={handlePracticeAgain} style={styles.primaryButton} />
        <PrimaryButton title="Cancel" onPress={handleCancel} variant="outline" style={styles.secondaryButton} />
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
  backButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: spacing.md,
  },
  scoreBlock: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: '700',
    color: colors.black,
  },
  scoreSuffix: {
    marginLeft: spacing.xs,
  },
  summaryText: {
    marginTop: spacing.sm,
  },
  analysisCard: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    letterSpacing: 0.4,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeGood: {
    backgroundColor: 'rgba(251, 175, 0, 0.15)',
  },
  badgeWarn: {
    backgroundColor: 'rgba(251, 175, 0, 0.08)',
  },
  badgeText: {
    color: colors.black,
    fontWeight: '700',
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    marginBottom: spacing.sm,
  },
  waveBar: {
    width: 3,
    backgroundColor: colors.black,
    borderRadius: 2,
  },
  paceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  paceValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
  },
  paceUnit: {
    marginLeft: spacing.xs,
    marginBottom: 2,
  },
  paceTrack: {
    height: 6,
    backgroundColor: colors.background,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  paceFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  primaryButton: {
    marginBottom: spacing.sm,
  },
  secondaryButton: {
    marginBottom: spacing.sm,
  },
});

export default SessionResultScreen;
