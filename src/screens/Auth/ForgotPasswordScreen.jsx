import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import PrimaryButton from '../../components/common/PrimaryButton';
import BrandLogo from '../../components/common/BrandLogo';
import TextField from '../../components/common/TextField';
import BackButton from '../../components/common/BackButton';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';
import { isValidEmail } from '../../utils/validators';

const ForgotPasswordScreen = ({ navigation }) => {
  const { resetPassword, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    if (!email.trim()) {
      setValidationError('Email is required');
      return false;
    }
    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSendResetLink = async () => {
    clearError();
    setSuccessMessage('');

    if (!validate()) return;

    const result = await resetPassword(email.trim());

    if (result.success) {
      setSuccessMessage(
        'Password reset link sent! Check your email for instructions.',
      );
      setEmail('');
      // Auto-navigate after 3 seconds
      setTimeout(() => {
        navigation.navigate('Login');
      }, 3000);
    } else {
      Alert.alert(
        'Failed to Send Reset Link',
        result.error || 'Please try again',
      );
    }
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
            {/* Header */}
            <View style={styles.topBar}>
              <BackButton onPress={handleGoBack} />
              <View style={styles.logoContainer}>
                <BrandLogo style={styles.headerLogo} />
              </View>
              <View style={styles.spacer} />
            </View>
          <View style={styles.contentWrap}>

            <Typography variant="h1" style={styles.title}>
              Reset Password
            </Typography>
            <Typography
              variant="body"
              color="textSecondary"
              weight="medium"
              style={styles.subtitle}
            >
              Enter your email address and we'll send you a link to reset your
              password.
            </Typography>

            <View style={styles.form}>
              <TextField
                label="Email Address"
                placeholder="student@example.com"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (validationError) setValidationError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={validationError}
                editable={!isLoading}
              />

              {successMessage ? (
                <View style={styles.successContainer}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.success}
                    style={styles.successIcon}
                  />
                  <Typography
                    variant="bodySmall"
                    color="success"
                    style={styles.successText}
                  >
                    {successMessage}
                  </Typography>
                </View>
              ) : null}

              {error ? (
                <Typography
                  variant="bodySmall"
                  color="error"
                  align="center"
                  style={styles.errorText}
                >
                  {error}
                </Typography>
              ) : null}

              <PrimaryButton
                title="Send Reset Link"
                onPress={handleSendResetLink}
                loading={isLoading}
                variant="secondary"
                size="large"
                style={styles.button}
              />

              <View style={styles.footer}>
                <Typography variant="bodySmall" color="textSecondary">
                  Remember your password?{' '}
                </Typography>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Typography
                    variant="bodySmall"
                    color="primary"
                    weight="bold"
                  >
                    Log In
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },

  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerLogo: {
    fontSize: 18,
  },
  spacer: {
    width: 40,
  },
  title: {
    marginBottom: spacing.md,
    color: colors.black,
  },
  subtitle: {
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: spacing.lg,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: `${colors.success}15`,
    borderRadius: borderRadius.md,
  },
  successIcon: {
    marginRight: spacing.sm,
  },
  successText: {
    flex: 1,
    lineHeight: 18,
  },
  errorText: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
});

export default ForgotPasswordScreen;
