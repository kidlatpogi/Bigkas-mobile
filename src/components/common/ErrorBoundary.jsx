import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from './Typography';
import PrimaryButton from './PrimaryButton';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

/**
 * ErrorBoundary Component
 * Catches errors in child components and displays a fallback UI
 * 
 * @component
 * @example
 * <ErrorBoundary>
 *   <MyScreen />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component {
  /**
   * @param {Object} props - Component props
   * @param {React.ReactNode} props.children - Child components
   */
  constructor(props) {
    super(props);
    /**
     * @type {Object} state - Component state
     * @property {boolean} hasError - Whether an error occurred
     * @property {Error|null} error - The error that occurred
     */
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  /**
   * Reset error state
   */
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.errorContent}>
            <Typography variant="h2" style={styles.title}>
              Oops!
            </Typography>
            <Typography 
              variant="body" 
              color="textSecondary"
              style={styles.message}
            >
              Something went wrong. Please try again.
            </Typography>
            {__DEV__ && (
              <Typography 
                variant="caption" 
                color="error"
                style={styles.errorDetails}
              >
                {this.state.error?.toString()}
              </Typography>
            )}
            <PrimaryButton
              title="Try Again"
              onPress={this.handleReset}
              style={styles.button}
            />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  errorContent: {
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing.md,
    color: colors.error,
  },
  message: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  errorDetails: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    maxWidth: 300,
  },
  button: {
    marginTop: spacing.md,
  },
});

export default ErrorBoundary;
