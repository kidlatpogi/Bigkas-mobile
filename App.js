import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { SessionProvider } from './src/context/SessionContext';

export default function App() {
  return (
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
  );
}
