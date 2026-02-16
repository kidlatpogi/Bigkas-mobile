import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SessionDetailScreen from '../screens/Session/SessionDetailScreen';
import SessionResultScreen from '../screens/Session/SessionResultScreen';
import EditProfileScreen from '../screens/Main/EditProfileScreen';
import BottomTabNavigator from './BottomTabNavigator';
const Stack = createNativeStackNavigator();

// Main Navigator (includes tabs + session screens)
const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
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
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
