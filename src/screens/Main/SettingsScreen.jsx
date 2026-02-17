import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import PrimaryButton from '../../components/common/PrimaryButton';
import Dropdown from '../../components/common/Dropdown';
import { useAuth } from '../../hooks/useAuth';
import { useSessions } from '../../hooks/useSessions';
import { STORAGE_KEYS } from '../../utils/constants';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * Settings screen for managing app preferences and account settings.
 * 
 * Screen Variables (for web version reuse):
 * 
 * State Variables:
 * - microphoneSource: selected microphone input ('default' | 'bluetooth' | 'external')
 * - cameraSource: selected camera ('front' | 'back')
 * 
 * From Hooks:
 * - logout: function from useAuth to clear session
 * - reset: function from useSessions to clear session data
 * 
 * Dropdown Options:
 * - microphoneOptions: array of {label, value} for microphone selection
 * - cameraOptions: array of {label, value} for camera selection
 * 
 * Handlers:
 * - handleGoBack: navigate back to previous screen
 * - handleMicrophoneChange: update microphone source setting
 * - handleCameraChange: update camera source setting
 * - handleTestAudioVideo: open test modal for testing hardware
 * - handleClearCache: clear app local cache
 * - handleLogout: logout user and clear all data
 */
const SettingsScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const { reset: resetSessions } = useSessions();

  // Hardware settings state
  const [microphoneSource, setMicrophoneSource] = useState('default');
  const [cameraSource, setCameraSource] = useState('front');

  // Dropdown options
  const microphoneOptions = [
    { label: 'Default - Built-in Microphone', value: 'default' },
    { label: 'Bluetooth Microphone', value: 'bluetooth' },
    { label: 'External Microphone', value: 'external' },
  ];

  const cameraOptions = [
    { label: 'Front Camera', value: 'front' },
    { label: 'Back Camera', value: 'back' },
  ];

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Dashboard');
    }
  };

  const handleMicrophoneChange = async (value) => {
    setMicrophoneSource(value);
    // Save to AsyncStorage for persistence
    try {
      await AsyncStorage.setItem('microphone_source', value);
    } catch (error) {
      console.error('Failed to save microphone setting:', error);
    }
  };

  const handleCameraChange = async (value) => {
    setCameraSource(value);
    // Save to AsyncStorage for persistence
    try {
      await AsyncStorage.setItem('camera_source', value);
    } catch (error) {
      console.error('Failed to save camera setting:', error);
    }
  };

  const handleTestAudioVideo = () => {
    // Open test modal/screen
    Alert.alert(
      'Test Audio / Video',
      'This will test your microphone and camera settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Test Now', onPress: () => console.log('Testing hardware...') },
      ]
    );
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Local Cache',
      'This will clear all cached data. Your account and settings will remain intact.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear specific cache keys - preserve auth and settings
              const keysToPreserve = [
                STORAGE_KEYS.AUTH_TOKEN,
                STORAGE_KEYS.USER_DATA,
                'microphone_source',
                'camera_source',
              ];

              const allKeys = await AsyncStorage.getAllKeys();
              const keysToRemove = allKeys.filter(
                (key) => !keysToPreserve.includes(key)
              );

              if (keysToRemove.length > 0) {
                await AsyncStorage.multiRemove(keysToRemove);
              }

              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              console.error('Failed to clear cache:', error);
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.black} />
          </TouchableOpacity>
          <Typography variant="h3">Settings</Typography>
          <View style={styles.headerSpacer} />
        </View>

        {/* Hardware Section */}
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            HARDWARE
          </Typography>

          <View style={styles.settingGroup}>
            <Typography
              variant="caption"
              color="textSecondary"
              weight="medium"
              style={styles.settingLabel}
            >
              MICROPHONE SOURCE
            </Typography>
            <Dropdown
              value={microphoneSource}
              options={microphoneOptions}
              onSelect={handleMicrophoneChange}
            />
          </View>

          <View style={styles.settingGroup}>
            <Typography
              variant="caption"
              color="textSecondary"
              weight="medium"
              style={styles.settingLabel}
            >
              CAMERA SOURCE
            </Typography>
            <Dropdown
              value={cameraSource}
              options={cameraOptions}
              onSelect={handleCameraChange}
            />
          </View>

          <PrimaryButton
            title="TEST AUDIO / VIDEO"
            onPress={handleTestAudioVideo}
            variant="outline"
            style={styles.testButton}
          />
        </View>

        {/* Storage Section */}
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            STORAGE
          </Typography>

          <TouchableOpacity
            style={styles.cacheButton}
            onPress={handleClearCache}
            activeOpacity={0.7}
          >
            <Typography variant="body" color="white" weight="medium">
              Clear Local Cache
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Typography variant="body" color="white" weight="bold">
              Log out
            </Typography>
          </TouchableOpacity>
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
    padding: spacing.sm,
    paddingBottom: 100, // room for floating nav
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  settingGroup: {
    marginBottom: spacing.sm,
  },
  settingLabel: {
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
  },
  testButton: {
    marginTop: spacing.sm,
  },
  cacheButton: {
    backgroundColor: '#666666',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoutButton: {
    backgroundColor: '#ff0019',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.ms,
  },
});

export default SettingsScreen;
