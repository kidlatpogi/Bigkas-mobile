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
const NicknameScreen = ({ navigation }) => {
  const { updateNickname, isLoading } = useAuth();

  // Nickname input state for reuse in web onboarding.
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    setError('');
    if (!nickname.trim()) {
      setError('Please enter a nickname');
      return;
    }

    setIsSubmitting(true);
    
    // Update nickname - this will trigger navigation automatically
    // Don't wait for the full operation to complete
    const result = await updateNickname(nickname);
    
    setIsSubmitting(false);
    
    if (!result.success) {
      setError('Failed to set nickname. Please try again.');
    }
    // On success, app will auto-navigate via AuthContext
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
              Add your nickname
            </Typography>
            <Typography variant="body" color="textSecondary" weight="medium" style={styles.subtitle}>
              This will be shown on your dashboard. You can change it later in settings.
            </Typography>

            <TextField
              label="Nickname"
              value={nickname}
              onChangeText={setNickname}
              error={error}
              autoCapitalize="words"
            />

            <PrimaryButton
              title="Continue"
              onPress={handleContinue}
              loading={isSubmitting || isLoading}
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
