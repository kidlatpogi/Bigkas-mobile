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
import { isValidEmail } from '../../utils/validators';

const LoginScreen = ({ navigation }) => {
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    clearError();

    if (!validate()) return;

    const result = await login(email.trim(), password);

    if (!result.success) {
      Alert.alert('Login Failed', result.error || 'Please check your credentials');
    }
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
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
              Improve your Filipino pronunciation
            </Typography>
          </View>

          <Card style={styles.card}>
            <Typography variant="h3" style={styles.cardTitle}>
              Welcome Back
            </Typography>

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
                value={email}
                onChangeText={setEmail}
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
                placeholder="Enter your password"
                placeholderTextColor={colors.gray400}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {validationErrors.password && (
                <Typography variant="caption" color="error">
                  {validationErrors.password}
                </Typography>
              )}
            </View>

            {error && (
              <Typography variant="bodySmall" color="error" align="center">
                {error}
              </Typography>
            )}

            <PrimaryButton
              title="Login"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.loginButton}
            />

            <View style={styles.registerContainer}>
              <Typography variant="bodySmall" color="textSecondary">
                Don't have an account?{' '}
              </Typography>
              <Typography
                variant="bodySmall"
                color="primary"
                onPress={handleRegisterPress}
                style={styles.registerLink}
              >
                Register
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
  loginButton: {
    marginTop: spacing.md,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  registerLink: {
    fontWeight: '600',
  },
});

export default LoginScreen;
