import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '../../components/common/Typography';
import PrimaryButton from '../../components/common/PrimaryButton';
import BrandLogo from '../../components/common/BrandLogo';
import TextField from '../../components/common/TextField';
import PasswordField from '../../components/common/PasswordField';
import SocialButton from '../../components/common/SocialButton';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { isValidEmail } from '../../utils/validators';

const LoginScreen = ({ navigation }) => {
  const { login, isLoading, error, clearError } = useAuth();

  // Auth form state for reuse across platforms.
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

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset will be available soon.');
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
              Login
            </Typography>
            <Typography
              variant="body"
              color="textSecondary"
              weight="medium"
              style={styles.subtitle}
            >
              Continue your public speaking journey.
            </Typography>

            <View style={styles.form}>
              <TextField
                label="Email Address"
                placeholder="student@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={validationErrors.email}
              />

              <PasswordField
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                error={validationErrors.password}
              />

              <Typography
                variant="bodySmall"
                color="primary"
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
              >
                Forgot password?
              </Typography>

              {error ? (
                <Typography variant="bodySmall" color="error" align="center" style={styles.errorText}>
                  {error}
                </Typography>
              ) : null}

              <PrimaryButton
                title="Log In"
                onPress={handleLogin}
                loading={isLoading}
                variant="secondary"
                size="large"
                style={styles.loginButton}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Typography variant="bodySmall" color="textSecondary" style={styles.dividerText}>
                  or
                </Typography>
                <View style={styles.dividerLine} />
              </View>

              <SocialButton title="Log In with Google" onPress={() => {}} />
            </View>

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
                Create Account
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
  logo: {
    marginBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.xl,
  },
  form: {
    marginBottom: spacing.xl,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  errorText: {
    marginBottom: spacing.md,
  },
  loginButton: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.sm,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerLink: {
    fontWeight: '600',
  },
});

export default LoginScreen;
