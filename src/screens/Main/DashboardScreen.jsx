import React, { useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import PrimaryButton from '../../components/common/PrimaryButton';
import BrandLogo from '../../components/common/BrandLogo';
import { useAuth } from '../../hooks/useAuth';
import { useSessions } from '../../hooks/useSessions';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { sessions, isLoading, fetchSessions } = useSessions();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleRefresh = () => {
    fetchSessions(1, true);
  };

  const handleStartPractice = () => {
    navigation.navigate('Practice');
  };

  const handleViewHistory = () => {
    navigation.navigate('History');
  };

  // Derived UI values for reuse in web + mobile.
  const displayName = user?.nickname || user?.name || 'Speaker';
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 18) return 'Good afternoon,';
    return 'Good evening,';
  }, []);

  // Stats placeholders (replace with Supabase data later).
  const todayCount = sessions.length || 4;
  const averageScore = 84;
  const streakCount = 3;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.contentWrap}>
          <View style={styles.topRow}>
            <BrandLogo />
            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
              <Ionicons name="person" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <Typography variant="body" color="textSecondary" weight="medium">
              {greeting}
            </Typography>
            <Typography variant="h1" style={styles.nameText}>
              {displayName}
            </Typography>
          </View>

          <View style={styles.heroCard}>
            <Typography variant="h2" color="textInverse" style={styles.heroTitle}>
              Ready to speak?
            </Typography>
            <Typography variant="bodySmall" color="textInverse" style={styles.heroSubtitle}>
              Ready when you are.
            </Typography>

            <PrimaryButton
              title="Start Practice"
              onPress={handleStartPractice}
              style={styles.practiceButton}
              textStyle={styles.practiceButtonText}
            />

            <Typography variant="bodySmall" color="textInverse" align="center" style={styles.heroOr}>
              or
            </Typography>

            <PrimaryButton
              title="Start Training"
              onPress={handleViewHistory}
              style={styles.trainingButton}
              textStyle={styles.trainingButtonText}
            />
          </View>

          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Typography variant="h3" align="center">
                {String(todayCount).padStart(2, '0')}
              </Typography>
              <Typography variant="caption" color="textSecondary" align="center">
                TODAY
              </Typography>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Typography variant="h3" align="center">
                {averageScore}
              </Typography>
              <Typography variant="caption" color="textSecondary" align="center">
                AVG SCORE
              </Typography>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Typography variant="h3" align="center">
                {String(streakCount).padStart(2, '0')}
              </Typography>
              <Typography variant="caption" color="textSecondary" align="center">
                STREAK
              </Typography>
            </View>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.infoCard}>
              <Typography variant="caption" color="textSecondary" style={styles.cardLabel}>
                MOTIVATION
              </Typography>
              <Typography variant="bodySmall" style={styles.cardBody}>
                "Courage is what it takes to stand up and speak."
              </Typography>
              <Typography variant="bodySmall" color="textSecondary">
                - Winston Churchill
              </Typography>
            </View>

            <View style={styles.infoCard}>
              <Typography variant="caption" color="textSecondary" style={styles.cardLabel}>
                TIP OF THE DAY
              </Typography>
              <Typography variant="bodySmall" style={styles.cardBody}>
                Start with a hook
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Open with a surprising fact, question, or story to grab attention in the first 30 seconds.
              </Typography>
            </View>
          </View>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  contentWrap: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.lg,
  },
  nameText: {
    marginTop: spacing.xs,
  },
  heroCard: {
    backgroundColor: colors.black,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  heroTitle: {
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    marginBottom: spacing.md,
  },
  practiceButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.white,
  },
  practiceButtonText: {
    color: colors.textPrimary,
  },
  heroOr: {
    marginVertical: spacing.sm,
  },
  trainingButton: {
    backgroundColor: colors.primary,
  },
  trainingButtonText: {
    color: colors.textPrimary,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.primary,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  infoCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  cardLabel: {
    marginBottom: spacing.sm,
    letterSpacing: 0.6,
  },
  cardBody: {
    marginBottom: spacing.sm,
  },
});

export default DashboardScreen;
