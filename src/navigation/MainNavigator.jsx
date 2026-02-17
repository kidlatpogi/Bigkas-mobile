import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SessionDetailScreen from '../screens/Session/SessionDetailScreen';
import SessionResultScreen from '../screens/Session/SessionResultScreen';
import EditProfileScreen from '../screens/Main/EditProfileScreen';
import PracticeScreen from '../screens/Main/PracticeScreen';
import GenerateScriptScreen from '../screens/Main/GenerateScriptScreen';
import TrainingSetupScreen from '../screens/Main/TrainingSetupScreen';
import HistoryScreen from '../screens/Main/HistoryScreen';
import AllSessionsScreen from '../screens/Main/AllSessionsScreen';
import ScriptEditorScreen from '../screens/Main/ScriptEditorScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator();

/**
 * MainNavigator
 *
 * Stack navigator wrapping the BottomTabNavigator.
 * Screens pushed on top of the tab bar (Practice, History,
 * SessionDetail, SessionResult, EditProfile) live here.
 *
 * @component
 */
const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="Practice" component={PracticeScreen} />
      <Stack.Screen name="GenerateScript" component={GenerateScriptScreen} />
      <Stack.Screen name="TrainingSetup" component={TrainingSetupScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="AllSessions" component={AllSessionsScreen} />
      <Stack.Screen name="ScriptEditor" component={ScriptEditorScreen} />
      <Stack.Screen
        name="SessionDetail"
        component={SessionDetailScreen}
        options={{
          headerShown: true,
          headerTitle: 'Session Details',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="SessionResult"
        component={SessionResultScreen}
        options={{
          headerShown: true,
          headerTitle: 'Results',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
