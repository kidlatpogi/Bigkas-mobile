import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/Main/DashboardScreen';
import PracticeScreen from '../screens/Main/PracticeScreen';
import HistoryScreen from '../screens/Main/HistoryScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';
import SessionDetailScreen from '../screens/Session/SessionDetailScreen';
import SessionResultScreen from '../screens/Session/SessionResultScreen';

import { colors } from '../styles/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab Navigator for main screens
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Practice':
              iconName = focused ? 'mic' : 'mic-outline';
              break;
            case 'History':
              iconName = focused ? 'time' : 'time-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray400,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Practice"
        component={PracticeScreen}
        options={{ tabBarLabel: 'Practice' }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ tabBarLabel: 'History' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Main Navigator (includes tabs + session screens)
const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
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
    </Stack.Navigator>
  );
};

export default MainNavigator;
