import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '../../components/common/Typography';
import Card from '../../components/common/Card';
import PrimaryButton from '../../components/common/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';
import { useSessions } from '../../hooks/useSessions';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

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

  // Calculate stats from sessions
  const totalSessions = sessions.length;
  const recentSessions = sessions.slice(0, 5);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <Typography variant="h2">
            Welcome, {user?.name || 'User'}!
          </Typography>
          <Typography variant="body" color="textSecondary">
            Ready to practice your pronunciation?
          </Typography>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Typography variant="h2" color="primary" align="center">
              {totalSessions}
            </Typography>
            <Typography variant="bodySmall" color="textSecondary" align="center">
              Total Sessions
            </Typography>
          </Card>
          <Card style={styles.statCard}>
            <Typography variant="h2" color="secondary" align="center">
              0
            </Typography>
            <Typography variant="bodySmall" color="textSecondary" align="center">
              Words Practiced
            </Typography>
          </Card>
        </View>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Typography variant="h4" style={styles.sectionTitle}>
            Quick Actions
          </Typography>
          <PrimaryButton
            title="Start Practice"
            onPress={handleStartPractice}
            style={styles.actionButton}
          />
          <PrimaryButton
            title="View History"
            onPress={handleViewHistory}
            variant="outline"
            style={styles.actionButton}
          />
        </Card>

        {/* Recent Sessions */}
        <View style={styles.section}>
          <Typography variant="h4" style={styles.sectionTitle}>
            Recent Sessions
          </Typography>
          {recentSessions.length === 0 ? (
            <Card>
              <Typography variant="body" color="textSecondary" align="center">
                No sessions yet. Start practicing!
              </Typography>
            </Card>
          ) : (
            recentSessions.map((session, index) => (
              <Card key={session.id || index} style={styles.sessionCard}>
                <Typography variant="bodySmall" weight="semibold">
                  {session.targetText || 'Practice Session'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {session.createdAt || 'Recently'}
                </Typography>
              </Card>
            ))
          )}
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
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    padding: spacing.md,
  },
  actionsCard: {
    marginBottom: spacing.lg,
  },
  actionButton: {
    marginTop: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  sessionCard: {
    marginBottom: spacing.sm,
  },
});

export default DashboardScreen;
