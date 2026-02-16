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
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';
import { isValidEmail, validatePassword, isNotEmpty } from '../../utils/validators';

const RegisterScreen = ({ navigation }) => {
  const { register, isLoading, error, clearError } = useAuth();

  // Form fields for cross-platform reuse (web + mobile).
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

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

    if (!result.success) {
      Alert.alert('Registration Failed', result.error || 'Please try again');
    }
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.contentWrap}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name="arrow-back" size={18} color={colors.textPrimary} />
            </TouchableOpacity>

            <BrandLogo style={styles.logo} />

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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logo: {
    alignSelf: 'center',
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
});

export default RegisterScreen;
