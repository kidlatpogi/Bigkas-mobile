import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import Card from '../../components/common/Card';
import TimeRangeSelector from '../../components/common/TimeRangeSelector';
import ProgressChart from '../../components/charts/ProgressChart';
import SessionScoreCard from '../../components/common/SessionScoreCard';
import { useSessions } from '../../hooks/useSessions';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * Progress tracking screen showing performance trends and recent sessions.
 * 
 * Screen Variables (for web version reuse):
 * 
 * State Variables:
 * - timeRange: selected time period ('week' | 'month' | 'year')
 * 
 * From Hooks:
 * - sessions: array of session objects from SessionContext
 * - isLoading: boolean loading state
 * - fetchSessions: function to load sessions
 * 
 * Derived Variables:
 * - performancePercentage: overall performance score (0-100)
 * - improvementPercentage: improvement from previous period
 * - betterThanLastWeek: percentage comparison to last week
 * - averageScore: average score across all sessions
 * - chartData: transformed data for ProgressChart component
 * - recentSessions: filtered sessions for display (max 5)
 * 
 * Chart Data Structure:
 * - chartData: Array<{label: string, value: number}>
 *   - label: day abbreviation (Mon, Tue, etc.)
 *   - value: performance metric for that day
 */
const ProgressScreen = ({ navigation }) => {
  const { sessions, isLoading, fetchSessions } = useSessions();
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Calculate performance metrics
  const performancePercentage = useMemo(() => {
    if (!sessions || sessions.length === 0) return 0;
    const total = sessions.reduce((sum, s) => sum + (s.score || 0), 0);
    return Math.round((total / sessions.length) * 100);
  }, [sessions]);

  const improvementPercentage = 12; // Placeholder - will calculate from historical data

  const betterThanLastWeek = 12; // Placeholder - will calculate from week-over-week data

  const averageScore = useMemo(() => {
    if (!sessions || sessions.length === 0) return 0;
    const total = sessions.reduce((sum, s) => sum + (s.score || 0) * 100, 0);
    return Math.round(total / sessions.length);
  }, [sessions]);

  // Generate chart data based on time range
  const chartData = useMemo(() => {
    if (timeRange === 'week') {
      // Mock data for weekly view - replace with actual session data aggregation
      return [
        { label: 'Mon', value: 72 },
        { label: 'Tue', value: 78 },
        { label: 'Wed', value: 75 },
        { label: 'Thu', value: 82 },
        { label: 'Fri', value: 85 },
        { label: 'Sat', value: 83 },
        { label: 'Sun', value: 88 },
      ];
    } else if (timeRange === 'month') {
      // Mock data for monthly view
      return [
        { label: 'Wk1', value: 70 },
        { label: 'Wk2', value: 75 },
        { label: 'Wk3', value: 80 },
        { label: 'Wk4', value: 88 },
      ];
    } else {
      // Mock data for yearly view
      return [
        { label: 'Jan', value: 65 },
        { label: 'Feb', value: 70 },
        { label: 'Mar', value: 72 },
        { label: 'Apr', value: 75 },
        { label: 'May', value: 78 },
        { label: 'Jun', value: 80 },
        { label: 'Jul', value: 82 },
        { label: 'Aug', value: 85 },
        { label: 'Sep', value: 83 },
        { label: 'Oct', value: 86 },
        { label: 'Nov', value: 88 },
        { label: 'Dec', value: 90 },
      ];
    }
  }, [timeRange]);

  // Get recent sessions (max 5) with formatted data
  const recentSessions = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      // Mock data for display
      return [
        {
          id: '1',
          title: 'Impromptu Speech #10',
          subtitle: 'Oct 23 • 4 mins',
          score: 92,
        },
        {
          id: '2',
          title: 'Impromptu Speech #10',
          subtitle: 'Oct 23 • 4 mins',
          score: 65,
        },
        {
          id: '3',
          title: 'Impromptu Speech #10',
          subtitle: 'Oct 23 • 4 mins',
          score: 60,
        },
        {
          id: '4',
          title: 'Impromptu Speech #10',
          subtitle: 'Oct 23 • 4 mins',
          score: 42,
        },
        {
          id: '5',
          title: 'Impromptu Speech #10',
          subtitle: 'Oct 23 • 4 mins',
          score: 83,
        },
      ];
    }

    return sessions.slice(0, 5).map((session) => ({
      id: session.id,
      title: session.targetText || 'Practice Session',
      subtitle: `${new Date(session.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} • ${session.duration || 0} mins`,
      score: Math.round((session.score || 0) * 100),
    }));
  }, [sessions]);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Dashboard');
    }
  };

  const handleSessionPress = (sessionId) => {
    navigation.navigate('SessionDetail', { sessionId });
  };

  const handleViewAll = () => {
    navigation.navigate('AllSessions');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Header - Fixed, doesn't scroll */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.black} />
          </TouchableOpacity>
          <Typography variant="h3">Progress</Typography>
          <View style={styles.headerSpacer} />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

        {/* Performance Trend Card */}
        <Card style={styles.trendCard}>
          <Typography
            variant="caption"
            color="textSecondary"
            weight="medium"
            style={styles.sectionLabel}
          >
            PERFORMANCE TREND
          </Typography>

          <View style={styles.performanceRow}>
            <Typography variant="display" style={styles.performanceText}>
              {performancePercentage}%
            </Typography>
            <View style={styles.improvementBadge}>
              <Ionicons name="arrow-up" size={14} color={colors.success} />
              <Typography variant="bodySmall" color="success" weight="bold">
                {improvementPercentage}%
              </Typography>
            </View>
          </View>

          <View style={styles.chartHeader}>
            <Typography variant="body" weight="medium">
              Daily Progress
            </Typography>
            <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} />
          </View>

          <ProgressChart data={chartData} />
        </Card>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Typography variant="h2" color="primary" align="center">
              {betterThanLastWeek}%
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              align="center"
              style={styles.statLabel}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              BETTER THAN LAST WEEK
            </Typography>
          </Card>

          <Card style={styles.statCard}>
            <Typography variant="h2" color="secondary" align="center">
              {averageScore}
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              align="center"
              style={styles.statLabel}
            >
              AVG SCORE
            </Typography>
          </Card>
        </View>

        {/* Recent Sessions */}
        <View style={styles.sessionsHeader}>
          <Typography variant="body" weight="bold">
            RECENT SESSIONS
          </Typography>
          <TouchableOpacity onPress={handleViewAll} activeOpacity={0.7}>
            <Typography variant="bodySmall" color="secondary" weight="medium">
              VIEW ALL
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.sessionsList}>
          {recentSessions.map((session) => (
            <SessionScoreCard
              key={session.id}
              title={session.title}
              subtitle={session.subtitle}
              score={session.score}
              onPress={() => handleSessionPress(session.id)}
            />
          ))}
        </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    paddingBottom: 100, // room for floating nav
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
  trendCard: {
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  performanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  performanceText: {
    marginRight: spacing.sm,
  },
  improvementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    marginTop: spacing.xs,
    letterSpacing: 0.5,
  },
  sessionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sessionsList: {
    marginBottom: spacing.xl,
  },
});

export default ProgressScreen;
