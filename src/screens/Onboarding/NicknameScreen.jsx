import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '../../components/common/Typography';
import PrimaryButton from '../../components/common/PrimaryButton';
import TextField from '../../components/common/TextField';
import BrandLogo from '../../components/common/BrandLogo';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

/**
 * First-login nickname screen for personalized greetings.
 */
const NicknameScreen = () => {
  const { updateNickname, isLoading } = useAuth();

  // Nickname input state for reuse in web onboarding.
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleContinue = async () => {
    setError('');
    const result = await updateNickname(nickname);
    if (!result.success) {
      setError(result.error || 'Please enter a nickname');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.contentWrap}>
            <BrandLogo style={styles.logo} />

            <Typography variant="h1" style={styles.title}>
              Add your
              {'\n'}nickname
            </Typography>
            <Typography variant="body" color="textSecondary" weight="medium" style={styles.subtitle}>
              This will be shown on your dashboard.
            </Typography>

            <TextField
              label="Nickname"
              placeholder="Mr. Suave"
              value={nickname}
              onChangeText={setNickname}
              error={error}
              autoCapitalize="words"
            />

            <PrimaryButton
              title="Continue"
              onPress={handleContinue}
              loading={isLoading}
              variant="primary"
              size="large"
              style={styles.continueButton}
              textStyle={styles.continueButtonText}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  contentWrap: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  logo: {
    marginBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.xl,
  },
  continueButton: {
    backgroundColor: colors.primary,
    marginTop: spacing.md,
  },
  continueButtonText: {
    color: colors.textPrimary,
  },
});

export default NicknameScreen;
