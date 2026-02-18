import React, { useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import Card from '../../components/common/Card';
import { useSessions } from '../../hooks/useSessions';
import BackButton from '../../components/common/BackButton';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';
import { formatDate, formatScore } from '../../utils/formatters';

const HistoryScreen = ({ navigation }) => {
  const {
    sessions,
    isLoading,
    fetchSessions,
    loadMoreSessions,
    pagination,
  } = useSessions();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleRefresh = useCallback(() => {
    fetchSessions(1, true);
  }, [fetchSessions]);

  const handleLoadMore = useCallback(() => {
    if (pagination.hasMore && !isLoading) {
      loadMoreSessions();
    }
  }, [pagination.hasMore, isLoading, loadMoreSessions]);

  const handleSessionPress = useCallback(
    (session) => {
      navigation.navigate('SessionDetail', { sessionId: session.id });
    },
    [navigation]
  );

  const renderSessionItem = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => handleSessionPress(item)}>
        <Card style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <Typography variant="body" weight="semibold" style={styles.sessionText}>
              {item.targetText || 'Practice Session'}
            </Typography>
            {item.score !== undefined && (
              <View style={styles.scoreBadge}>
                <Typography variant="bodySmall" color="white">
                  {formatScore(item.score)}
                </Typography>
              </View>
            )}
          </View>
          <View style={styles.sessionMeta}>
            <Typography variant="caption" color="textSecondary">
              {formatDate(item.createdAt, 'datetime')}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {item.duration ? `${item.duration}s` : ''}
            </Typography>
          </View>
        </Card>
      </TouchableOpacity>
    ),
    [handleSessionPress]
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Typography variant="h4" color="textSecondary" align="center">
        No Sessions Yet
      </Typography>
      <Typography variant="body" color="textMuted" align="center" style={styles.emptyText}>
        Start practicing to see your session history here!
      </Typography>
    </View>
  );

  const renderFooter = () => {
    if (!isLoading || sessions.length === 0) return null;
    return (
      <View style={styles.footer}>
        <Typography variant="bodySmall" color="textSecondary">
          Loading more...
        </Typography>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={handleGoBack} />
        <Typography variant="h3">History</Typography>
        <View style={styles.headerSpacer} />
        <Typography variant="bodySmall" color="textSecondary">
          {sessions.length} session{sessions.length !== 1 ? 's' : ''}
        </Typography>
      </View>

      <FlatList
        data={sessions}
        renderItem={renderSessionItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  headerSpacer: {
    width: 40,
  },
  listContent: {
    padding: spacing.sm,
    flexGrow: 1,
  },
  sessionCard: {
    marginBottom: spacing.sm,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sessionText: {
    flex: 1,
  },
  scoreBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginLeft: spacing.sm,
  },
  sessionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    marginTop: spacing.sm,
  },
  footer: {
    padding: spacing.md,
    alignItems: 'center',
  },
});

export default HistoryScreen;
