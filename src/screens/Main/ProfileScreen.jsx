import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import Card from '../../components/common/Card';
import PrimaryButton from '../../components/common/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';
import { useSessions } from '../../hooks/useSessions';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

/**
 * ProfileScreen Component
 * Displays user profile information and profile-related actions
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object
 * @returns {React.ReactNode} Profile screen UI
 * 
 * @description
 * Features:
 * - Displays user avatar with initials
 * - Shows user name and email
 * - Displays statistics (sessions, words practiced, average score)
 * - Settings options (notifications, language, audio quality)
 * - About section with app information  * - Logout functionality
 * 
 * @example
 * <ProfileScreen navigation={navigation} />
 */
const ProfileScreen = ({ navigation }) => {
  // Get user data and auth functions with fallback values
  const { user, logout, isLoading, error } = useAuth();
  const { reset: resetSessions } = useSessions();

  // Safe getters for user data
  const userInitial = user?.name?.charAt(0)?.toUpperCase() ?? 'U';
  const userName = user?.name ?? 'User';
  const userEmail = user?.email ?? 'user@example.com';

  /**
   * Navigate to EditProfile screen
   */
  const handleEditProfile = useCallback(() => {
    try {
      navigation.navigate('EditProfile');
    } catch (err) {
      console.error('Navigation error:', err);
      Alert.alert('Error', 'Failed to navigate to edit profile');
    }
  }, [navigation]);

  /**
   * Navigate to Settings screen
   */
  const handleOpenSettings = useCallback(() => {
    try {
      navigation.navigate('Settings');
    } catch (err) {
      console.error('Navigation error:', err);
      Alert.alert('Error', 'Failed to navigate to settings');
    }
  }, [navigation]);

  /**
   * Handle logout with confirmation and session reset
   */
  const handleLogout = useCallback(async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              resetSessions();
              await logout();
            } catch (err) {
              console.error('Logout error:', err);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [logout, resetSessions]);

  // Show error if auth error exists
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Typography variant="h3" color="error">
            Error Loading Profile
          </Typography>
          <Typography variant="body" color="textSecondary" style={styles.errorMessage}>
            {error}
          </Typography>
          <PrimaryButton
            title="Retry"
            onPress={() => {}}
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Typography variant="h1" color="white">
              {userInitial}
            </Typography>
          </View>
          <Typography variant="h3" style={styles.userName}>
            {userName}
          </Typography>
          <Typography variant="body" color="textSecondary">
            {userEmail}
          </Typography>
          <PrimaryButton
            title="Edit Profile"
            onPress={handleEditProfile}
            variant="outline"
            size="small"
            style={styles.editButton}
          />
        </View>

        {/* Stats Card */}
        <Card style={styles.statsCard}>
          <Typography variant="h4" style={styles.cardTitle}>
            Your Progress
          </Typography>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Typography variant="h3" color="primary">
                0
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Total Sessions
              </Typography>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Typography variant="h3" color="secondary">
                0
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Words Practiced
              </Typography>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Typography variant="h3" color="primary">
                0%
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Avg. Score
              </Typography>
            </View>
          </View>
        </Card>

        {/* Settings */}
        <TouchableOpacity onPress={handleOpenSettings} activeOpacity={0.7}>
          <Card style={styles.settingsCard}>
            <View style={styles.settingsHeader}>
              <Typography variant="h4" style={styles.cardTitle}>
                Settings
              </Typography>
              <Ionicons name="chevron-forward" size={20} color={colors.black} />
            </View>

            <View style={styles.settingItem}>
              <Typography variant="body">Notifications</Typography>
              <Typography variant="bodySmall" color="textSecondary">
                Enabled
              </Typography>
            </View>

            <View style={styles.settingItem}>
              <Typography variant="body">Language</Typography>
              <Typography variant="bodySmall" color="textSecondary">
                Filipino (Tagalog)
              </Typography>
            </View>

            <View style={styles.settingItem}>
              <Typography variant="body">Audio Quality</Typography>
              <Typography variant="bodySmall" color="textSecondary">
                High
              </Typography>
            </View>
          </Card>
        </TouchableOpacity>

        {/* About */}
        <Card style={styles.aboutCard}>
          <Typography variant="h4" style={styles.cardTitle}>
            About
          </Typography>
          <Typography variant="bodySmall" color="textSecondary">
            Bigkas - Filipino Pronunciation Practice App
          </Typography>
          <Typography variant="caption" color="textMuted" style={styles.version}>
            Version 1.0.0
          </Typography>
        </Card>

        {/* Logout Button */}
        <PrimaryButton
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          loading={isLoading}
          style={styles.logoutButton}
        />
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
    paddingBottom: 100, // room for floating nav
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  errorMessage: {
    marginVertical: spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  userName: {
    marginBottom: spacing.xs,
  },
  editButton: {
    marginTop: spacing.md,
  },
  statsCard: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.primary,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsCard: {
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  aboutCard: {
    marginBottom: spacing.lg,
  },
  version: {
    marginTop: spacing.sm,
  },
  logoutButton: {
    marginTop: spacing.md,
  },
});

export default ProfileScreen;
