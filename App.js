import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { SessionProvider } from './src/context/SessionContext';
import ErrorBoundary from './src/components/common/ErrorBoundary';

/**
 * Main App Component
 * Root component that sets up providers, fonts, and navigation
 * 
 * @component
 * @returns {React.ReactNode} The app with all providers and navigation
 */
export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider>
            <SessionProvider>
              <StatusBar style="auto" />
              <AppNavigator />
            </SessionProvider>
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
