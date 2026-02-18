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
import PasswordField from '../../components/common/PasswordField';
import BackButton from '../../components/common/BackButton';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';
import { isValidEmail, validatePassword, isNotEmpty } from '../../utils/validators';

const RegisterScreen = ({ navigation }) => {
  const { register, isLoading, error, clearError, resendVerificationEmail } = useAuth();

  // Form fields for cross-platform reuse (web + mobile).
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user types
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!isNotEmpty(formData.firstName)) {
      errors.firstName = 'First name is required';
    }

    if (!isNotEmpty(formData.lastName)) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    clearError();

    if (!validate()) return;

    const result = await register({
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
      email: formData.email.trim(),
      password: formData.password,
    });

    if (result.success) {
      setRegistrationSuccess(true);
    } else {
      Alert.alert('Registration Failed', result.error || 'Please try again');
    }
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleResendVerificationEmail = async () => {
    setResendLoading(true);
    const result = await resendVerificationEmail(formData.email.trim());
    setResendLoading(false);

    if (result.success) {
      Alert.alert(
        'Verification Email Sent',
        'Check your email for the verification link. It may take a few minutes.',
      );
    } else {
      Alert.alert(
        'Failed to Resend',
        result.error || 'Please try again later',
      );
    }
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  if (registrationSuccess) {
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
            <View style={styles.contentWrap}>
              <View style={styles.topBar}>
                <View style={styles.spacer} />
                <View style={styles.logoContainer}>
                  <BrandLogo style={styles.headerLogo} />
                </View>
                <View style={styles.spacer} />
              </View>

              <View style={styles.successContainer}>
                <Ionicons
                  name="checkmark-circle"
                  size={80}
                  color={colors.success}
                  style={styles.successIcon}
                />

                <Typography variant="h2" style={styles.successTitle}>
                  Verification Email Sent!
                </Typography>

                <Typography
                  variant="body"
                  color="textSecondary"
                  weight="medium"
                  align="center"
                  style={styles.successMessage}
                >
                  We've sent a verification link to
                </Typography>

                <View style={styles.emailBox}>
                  <Typography
                    variant="body"
                    color="primary"
                    weight="bold"
                    align="center"
                  >
                    {formData.email}
                  </Typography>
                </View>

                <Typography
                  variant="bodySmall"
                  color="textSecondary"
                  align="center"
                  style={styles.instructionText}
                >
                  Please click the link in the email to verify your account. It
                  may take a few minutes to arrive.
                </Typography>

                <PrimaryButton
                  title="Go to Login"
                  onPress={handleLoginPress}
                  variant="secondary"
                  size="large"
                  style={styles.successButton}
                />

                <View style={styles.resendContainer}>
                  <Typography
                    variant="bodySmall"
                    color="textSecondary"
                    align="center"
                  >
                    Didn't receive the email?
                  </Typography>
                  <PrimaryButton
                    title="Resend Verification Email"
                    onPress={handleResendVerificationEmail}
                    loading={resendLoading}
                    variant="text"
                    size="small"
                    style={styles.resendButton}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.contentWrap}>
            <View style={styles.topBar}>
              <BackButton onPress={handleGoBack} />
              <View style={styles.logoContainer}>
                <BrandLogo style={styles.headerLogo} />
              </View>
              <View style={styles.spacer} />
            </View>

            <Typography variant="h1" style={styles.title}>
              Create
              {'\n'}Account
            </Typography>
            <Typography
              variant="body"
              color="textSecondary"
              weight="medium"
              style={styles.subtitle}
            >
              Start Tracking your speaking practice with AI analysis.
            </Typography>

            <View style={styles.form}>
              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <TextField
                    label="First Name"
                    placeholder="Juan"
                    value={formData.firstName}
                    onChangeText={(value) => updateField('firstName', value)}
                    autoCapitalize="words"
                    error={validationErrors.firstName}
                  />
                </View>
                <View style={styles.rowItem}>
                  <TextField
                    label="Last Name"
                    placeholder="Dela Cruz"
                    value={formData.lastName}
                    onChangeText={(value) => updateField('lastName', value)}
                    autoCapitalize="words"
                    error={validationErrors.lastName}
                  />
                </View>
              </View>

              <TextField
                label="Email Address"
                placeholder="juan@student.edu.ph"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={validationErrors.email}
              />

              <PasswordField
                label="Password"
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(value) => updateField('password', value)}
                error={validationErrors.password}
              />

              <PasswordField
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
                error={validationErrors.confirmPassword}
              />

              {error ? (
                <Typography variant="bodySmall" color="error" align="center" style={styles.errorText}>
                  {error}
                </Typography>
              ) : null}

              <PrimaryButton
                title="Create Account"
                onPress={handleRegister}
                loading={isLoading}
                variant="primary"
                size="large"
                style={styles.registerButton}
                textStyle={styles.registerButtonText}
              />
            </View>

            <View style={styles.loginContainer}>
              <Typography variant="bodySmall" color="textSecondary">
                Already have an account?{' '}
              </Typography>
              <Typography
                variant="bodySmall"
                color="primary"
                onPress={handleLoginPress}
                style={styles.loginLink}
              >
                Login
              </Typography>
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
    marginBottom: spacing.lg,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  spacer: {
    width: 40,
  },
  headerLogo: {
    marginBottom: 0,
  },
  logo: {
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.lg,
  },
  form: {
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  rowItem: {
    width: '48%',
  },
  errorText: {
    marginBottom: spacing.md,
  },
  registerButton: {
    width: '100%',
    backgroundColor: colors.primary,
  },
  registerButtonText: {
    color: colors.textPrimary,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginLink: {
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    marginBottom: spacing.lg,
  },
  successTitle: {
    marginBottom: spacing.md,
    color: colors.black,
    textAlign: 'center',
  },
  successMessage: {
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  emailBox: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  instructionText: {
    marginBottom: spacing.xl,
    lineHeight: 18,
  },
  successButton: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendButton: {
    marginTop: spacing.sm,
    paddingHorizontal: 0,
  },
});

export default RegisterScreen;
