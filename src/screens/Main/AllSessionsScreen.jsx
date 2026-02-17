import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import FilterTabs from '../../components/common/FilterTabs';
import SessionScoreCard from '../../components/common/SessionScoreCard';
import { useSessions } from '../../hooks/useSessions';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * All Sessions screen showing complete list of practice sessions with filters.
 * 
 * State Variables:
 * - filterType: selected filter ('all' | 'today' | 'thisWeek' | 'thisMonth')
 * 
 * From Hooks:
 * - sessions: array of session objects from SessionContext
 * 
 * Filter Options:
 * - ALL: Show all sessions
 * - TODAY: Sessions recorded today
 * - THIS WEEK: Sessions from last 7 days
 * - THIS MONTH: Sessions from last 30 days
 */
const AllSessionsScreen = ({ navigation }) => {
  const { sessions } = useSessions();
  const [filterType, setFilterType] = useState('all');

  // Filter tabs configuration
  const filterTabs = useMemo(
    () => [
      { value: 'all', label: 'ALL' },
      { value: 'today', label: 'TODAY' },
      { value: 'thisWeek', label: 'THIS WEEK' },
      { value: 'thisMonth', label: 'THIS MONTH' },
    ],
    []
  );

  // Mock data for display - replace with actual filtered sessions
  const allSessionsMock = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return [
      {
        id: '1',
        title: 'Impromptu Speech #10',
        subtitle: 'Oct 23 • 4 mins',
        score: 42,
        date: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000), // Today
      },
      {
        id: '2',
        title: 'Impromptu Speech #10',
        subtitle: 'Oct 23 • 4 mins',
        score: 92,
        date: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000), // Today
      },
      {
        id: '3',
        title: 'Impromptu Speech #10',
        subtitle: 'Oct 23 • 4 mins',
        score: 65,
        date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000), // Yesterday
      },
      {
        id: '4',
        title: 'Impromptu Speech #10',
        subtitle: 'Oct 23 • 4 mins',
        score: 42,
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        id: '5',
        title: 'Impromptu Speech #10',
        subtitle: 'Oct 23 • 4 mins',
        score: 92,
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        id: '6',
        title: 'Impromptu Speech #10',
        subtitle: 'Oct 23 • 4 mins',
        score: 65,
        date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        id: '7',
        title: 'Impromptu Speech #10',
        subtitle: 'Oct 23 • 4 mins',
        score: 92,
        date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        id: '8',
        title: 'Impromptu Speech #10',
        subtitle: 'Oct 23 • 4 mins',
        score: 65,
        date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
      {
        id: '9',
        title: 'Impromptu Speech #10',
        subtitle: 'Oct 23 • 4 mins',
        score: 42,
        date: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      },
      {
        id: '10',
        title: 'Impromptu Speech #10',
        subtitle: 'Oct 23 • 4 mins',
        score: 92,
        date: new Date(today.getTime() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
      },
    ];
  }, []);

  // Filter sessions based on selected filter
  const filteredSessions = useMemo(() => {
    if (filterType === 'all') {
      return allSessionsMock;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000); // Last 7 days including today
    const thirtyDaysAgo = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000); // Last 30 days including today

    return allSessionsMock.filter((session) => {
      const sessionDate = new Date(session.date.getFullYear(), session.date.getMonth(), session.date.getDate());

      if (filterType === 'today') {
        return sessionDate.getTime() === today.getTime();
      }

      if (filterType === 'thisWeek') {
        return sessionDate.getTime() >= sevenDaysAgo.getTime() && sessionDate.getTime() <= today.getTime();
      }

      if (filterType === 'thisMonth') {
        return sessionDate.getTime() >= thirtyDaysAgo.getTime() && sessionDate.getTime() <= today.getTime();
      }

      return false;
    });
  }, [filterType, allSessionsMock]);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleSessionPress = (sessionId) => {
    navigation.navigate('SessionDetail', { sessionId });
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
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
          <Typography variant="h3">All Sessions</Typography>
          <View style={styles.headerSpacer} />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <FilterTabs
            tabs={filterTabs}
            selected={filterType}
            onSelect={handleFilterChange}
          />
        </View>

        {/* Scrollable Sessions List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredSessions.length === 0 ? (
            <View style={styles.emptyState}>
              <Typography variant="body" color="textSecondary" align="center">
                No sessions found
              </Typography>
            </View>
          ) : (
            filteredSessions.map((session) => (
              <SessionScoreCard
                key={session.id}
                title={session.title}
                subtitle={session.subtitle}
                score={session.score}
                onPress={() => handleSessionPress(session.id)}
              />
            ))
          )}
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
  filterContainer: {
    marginBottom: spacing.md,
    marginHorizontal: -spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    paddingBottom: 100, // room for floating nav
  },
  emptyState: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
});

export default AllSessionsScreen;
