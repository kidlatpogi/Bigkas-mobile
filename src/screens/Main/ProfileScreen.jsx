import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '../../components/common/Typography';
import Card from '../../components/common/Card';
import PrimaryButton from '../../components/common/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';
import { useSessions } from '../../hooks/useSessions';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, isLoading } = useAuth();
  const { reset: resetSessions } = useSessions();

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            resetSessions();
            await logout();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Typography variant="h1" color="white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Typography>
          </View>
          <Typography variant="h3" style={styles.userName}>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="body" color="textSecondary">
            {user?.email || 'user@example.com'}
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
        <Card style={styles.settingsCard}>
          <Typography variant="h4" style={styles.cardTitle}>
            Settings
          </Typography>

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
    backgroundColor: colors.border,
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
