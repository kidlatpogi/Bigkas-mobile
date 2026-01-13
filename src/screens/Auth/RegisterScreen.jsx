import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '../../components/common/Typography';
import PrimaryButton from '../../components/common/PrimaryButton';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { isValidEmail, validatePassword, isNotEmpty } from '../../utils/validators';

const RegisterScreen = ({ navigation }) => {
  const { register, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
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

    if (!isNotEmpty(formData.name)) {
      errors.name = 'Name is required';
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
      name: formData.name.trim(),
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Typography variant="h1" align="center">
              Bigkas
            </Typography>
            <Typography variant="body" color="textSecondary" align="center">
              Create your account
            </Typography>
          </View>

          <Card style={styles.card}>
            <Typography variant="h3" style={styles.cardTitle}>
              Register
            </Typography>

            <View style={styles.inputContainer}>
              <Typography variant="bodySmall" style={styles.label}>
                Full Name
              </Typography>
              <TextInput
                style={[
                  styles.input,
                  validationErrors.name && styles.inputError,
                ]}
                placeholder="Enter your full name"
                placeholderTextColor={colors.gray400}
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                autoCapitalize="words"
              />
              {validationErrors.name && (
                <Typography variant="caption" color="error">
                  {validationErrors.name}
                </Typography>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Typography variant="bodySmall" style={styles.label}>
                Email
              </Typography>
              <TextInput
                style={[
                  styles.input,
                  validationErrors.email && styles.inputError,
                ]}
                placeholder="Enter your email"
                placeholderTextColor={colors.gray400}
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {validationErrors.email && (
                <Typography variant="caption" color="error">
                  {validationErrors.email}
                </Typography>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Typography variant="bodySmall" style={styles.label}>
                Password
              </Typography>
              <TextInput
                style={[
                  styles.input,
                  validationErrors.password && styles.inputError,
                ]}
                placeholder="Create a password"
                placeholderTextColor={colors.gray400}
                value={formData.password}
                onChangeText={(value) => updateField('password', value)}
                secureTextEntry
              />
              {validationErrors.password && (
                <Typography variant="caption" color="error">
                  {validationErrors.password}
                </Typography>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Typography variant="bodySmall" style={styles.label}>
                Confirm Password
              </Typography>
              <TextInput
                style={[
                  styles.input,
                  validationErrors.confirmPassword && styles.inputError,
                ]}
                placeholder="Confirm your password"
                placeholderTextColor={colors.gray400}
                value={formData.confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
                secureTextEntry
              />
              {validationErrors.confirmPassword && (
                <Typography variant="caption" color="error">
                  {validationErrors.confirmPassword}
                </Typography>
              )}
            </View>

            {error && (
              <Typography variant="bodySmall" color="error" align="center">
                {error}
              </Typography>
            )}

            <PrimaryButton
              title="Register"
              onPress={handleRegister}
              loading={isLoading}
              style={styles.registerButton}
            />

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
          </Card>
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
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  card: {
    padding: spacing.lg,
  },
  cardTitle: {
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.error,
  },
  registerButton: {
    marginTop: spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  loginLink: {
    fontWeight: '600',
  },
});

export default RegisterScreen;
