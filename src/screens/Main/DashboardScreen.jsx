import React, { useEffect, useMemo, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
/** Width of each info card in the two-column row */
const CARD_GAP = spacing.md;
const CARD_WIDTH = (SCREEN_WIDTH - spacing.lg * 2 - CARD_GAP) / 2;

/* ------------------------------------------------------------------ */
/*  Daily content helpers                                              */
/* ------------------------------------------------------------------ */

/**
 * Fetches a daily motivational quote from the ZenQuotes API.
 * Falls back to a hardcoded quote on failure.
 *
 * API: https://zenquotes.io/api/today
 * Docs: https://docs.zenquotes.io
 *
 * @returns {Promise<{text: string, author: string}>}
 */
const fetchDailyQuote = async () => {
  try {
    const res = await fetch('https://zenquotes.io/api/today');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return { text: data[0].q, author: data[0].a };
    }
    throw new Error('Empty response');
  } catch {
    return {
      text: 'Courage is what it takes to stand up and speak.',
      author: 'Winston Churchill',
    };
  }
};

/**
 * Returns a daily speaking / presentation tip.
 * The tip rotates automatically every calendar day
 * using a deterministic index derived from today's date.
 *
 * Source: built-in curated list (no external API needed).
 *
 * @returns {{ title: string, body: string }}
 */
const getDailyTip = () => {
  const tips = [
    {
      title: 'Start with a hook',
      body: 'Open with a surprising fact, question, or story to grab attention in the first 30 seconds.',
    },
    {
      title: 'Pace yourself',
      body: 'Speak slowly and clearly. Pausing between key points gives listeners time to absorb your message.',
    },
    {
      title: 'Record yourself',
      body: 'Listening to recordings of your speech helps you catch filler words and improve cadence.',
    },
    {
      title: 'Practice tongue twisters',
      body: 'Start each session with a quick tongue twister to warm up your mouth muscles and improve clarity.',
    },
    {
      title: 'Focus on breathing',
      body: 'Deep diaphragmatic breathing before speaking reduces anxiety and gives your voice more power.',
    },
    {
      title: 'Use simple words',
      body: 'Clear communication comes from choosing everyday words over complicated vocabulary.',
    },
    {
      title: 'Make eye contact',
      body: 'Even when practicing alone, look into the camera or mirror to build the habit of engagement.',
    },
    {
      title: 'Emphasise key words',
      body: 'Stressing important words in a sentence adds variety and keeps your listener engaged.',
    },
    {
      title: 'Read aloud daily',
      body: 'Reading newspaper articles or books aloud for 10 minutes a day greatly improves fluency.',
    },
    {
      title: 'Smile while speaking',
      body: 'A natural smile changes the shape of your mouth and makes your pronunciation warmer and clearer.',
    },
  ];
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 86400000,
  );
  return tips[dayOfYear % tips.length];
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * DashboardScreen — main home screen.
 *
 * Layout (top → bottom):
 * 1. Brand logo + profile icon
 * 2. Greeting + user display name
 * 3. Hero card (black) with CTA buttons
 * 4. Stats row (Today · Avg Score · Streak)
 * 5. Two info cards (Motivation + Tip of the Day)
 *
 * @component
 * @param {{ navigation: object }} props
 */
const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { sessions, isLoading, fetchSessions } = useSessions();

  /* --------------- daily content state --------------- */
  const [quote, setQuote] = useState({
    text: 'Courage is what it takes to stand up and speak.',
    author: 'Winston Churchill',
  });
  const tip = useMemo(() => getDailyTip(), []);

  useEffect(() => {
    fetchDailyQuote().then(setQuote);
  }, []);

  /* --------------- sessions fetch --------------- */
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleRefresh = useCallback(() => {
    fetchSessions(1, true);
    fetchDailyQuote().then(setQuote);
  }, [fetchSessions]);

  /* --------------- navigation helpers --------------- */
  const handleStartPractice = useCallback(() => {
    navigation.navigate('Practice');
  }, [navigation]);

  const handleStartTraining = useCallback(() => {
    navigation.navigate('Practice');
  }, [navigation]);

  /* --------------- derived display values --------------- */
  /** @type {string} displayName — user nickname or name */
  const displayName = user?.nickname || user?.name || 'Speaker';

  /** @type {string} greeting — time-of-day greeting */
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning,';
    if (h < 18) return 'Good afternoon,';
    return 'Good evening,';
  }, []);

  /** @type {number} todayCount — sessions completed today */
  const todayCount = sessions?.length || 0;
  /** @type {number} averageScore — average pronunciation score */
  const averageScore = 84;
  /** @type {number} streakCount — consecutive practice days */
  const streakCount = 3;

  /* --------------- render --------------- */
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* -------- Top bar -------- */}
        <View style={styles.topRow}>
          <BrandLogo />
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.7}
          >
            <Ionicons name="person-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* -------- Greeting -------- */}
        <View style={styles.greetingWrap}>
          <Typography variant="body" color="primary" weight="medium" style={styles.greetingText}>
            {greeting}
          </Typography>
          <Typography variant="h1" style={styles.displayName}>
            {displayName}
          </Typography>
        </View>

        {/* -------- Hero card -------- */}
        <View style={styles.heroCard}>
          <Typography variant="h2" color="textInverse" weight="bold" style={styles.heroTitle}>
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

          <Typography
            variant="bodySmall"
            color="textInverse"
            align="center"
            style={styles.heroOr}
          >
            or
          </Typography>

          <PrimaryButton
            title="Start Training"
            onPress={handleStartTraining}
            style={styles.trainingButton}
            textStyle={styles.trainingButtonText}
          />
        </View>

        {/* -------- Stats row -------- */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Typography variant="h1" align="center" style={styles.statValue}>
              {String(todayCount).padStart(2, '0')}
            </Typography>
            <Typography variant="caption" color="textSecondary" align="center" style={styles.statLabel}>
              TODAY
            </Typography>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Typography variant="h1" align="center" style={styles.statValue}>
              {averageScore}
            </Typography>
            <Typography variant="caption" color="textSecondary" align="center" style={styles.statLabel}>
              AVG SCORE
            </Typography>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Typography variant="h1" align="center" style={styles.statValue}>
              {String(streakCount).padStart(2, '0')}
            </Typography>
            <Typography variant="caption" color="textSecondary" align="center" style={styles.statLabel}>
              STREAK
            </Typography>
          </View>
        </View>

        {/* -------- Info cards row -------- */}
        <View style={styles.cardRow}>
          {/* Motivation */}
          <View style={[styles.infoCard, { width: CARD_WIDTH }]}>
            <Typography
              variant="caption"
              color="textSecondary"
              style={styles.cardLabel}
            >
              MOTIVATION
            </Typography>
            <Typography variant="bodySmall" style={styles.quoteText}>
              &ldquo;{quote.text}&rdquo;
            </Typography>
            <Typography variant="bodySmall" color="textSecondary">
              - {quote.author}
            </Typography>
          </View>

          {/* Tip of the Day */}
          <View style={[styles.infoCard, { width: CARD_WIDTH }]}>
            <Typography
              variant="caption"
              color="textSecondary"
              style={styles.cardLabel}
            >
              TIP OF THE DAY
            </Typography>
            <Typography variant="bodySmall" weight="bold" style={styles.tipTitle}>
              {tip.title}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {tip.body}
            </Typography>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  /* Top bar */
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Greeting */
  greetingWrap: {
    marginBottom: spacing.lg,
  },
  greetingText: {
    fontStyle: 'italic',
  },
  displayName: {
    marginTop: 2,
  },

  /* Hero card */
  heroCard: {
    backgroundColor: colors.black,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  heroTitle: {
    marginBottom: 4,
  },
  heroSubtitle: {
    marginBottom: spacing.lg,
    opacity: 0.7,
  },
  practiceButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingVertical: 14,
  },
  practiceButtonText: {
    color: colors.black,
    fontWeight: '700',
  },
  heroOr: {
    marginVertical: spacing.sm,
    opacity: 0.6,
  },
  trainingButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: 14,
  },
  trainingButtonText: {
    color: colors.black,
    fontWeight: '700',
  },

  /* Stats row */
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    lineHeight: 38,
  },
  statLabel: {
    marginTop: 2,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontSize: 10,
  },
  statDivider: {
    width: 1.5,
    height: 40,
    backgroundColor: colors.primary,
  },

  /* Info cards row */
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLabel: {
    marginBottom: spacing.sm,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontSize: 10,
  },
  quoteText: {
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  tipTitle: {
    marginBottom: spacing.xs,
  },
});

export default DashboardScreen;
