import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/Main/DashboardScreen';
import ScriptsScreen from '../screens/Main/ScriptsScreen';
import ProgressScreen from '../screens/Main/ProgressScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';
import SettingsScreen from '../screens/Main/SettingsScreen';
import { colors } from '../styles/colors';

const Tab = createBottomTabNavigator();

/**
 * Tab icon configuration — maps route names to Ionicons glyph names.
 *
 * Order (left → right, matching the Figma design):
 *  Scripts · Progress · Home (Dashboard) · Profile · Settings
 *
 * @type {Record<string, { focused: string, outline: string }>}
 */
const TAB_ICONS = {
  Scripts:   { focused: 'document-text',       outline: 'document-text-outline' },
  Progress:  { focused: 'stats-chart',         outline: 'stats-chart-outline' },
  Dashboard: { focused: 'home',                outline: 'home-outline' },
  Profile:   { focused: 'person',              outline: 'person-outline' },
  Settings:  { focused: 'settings',            outline: 'settings-outline' },
};

/**
 * BottomTabNavigator
 *
 * Floating bottom tab bar matching the Figma design:
 *  | Scripts | Progress | Home | Profile | Settings |
 *
 * - Icons only (no labels)
 * - Center "Home" icon is visually larger
 * - Floating bar: rounded corners, horizontal margin, elevated shadow
 * - Active colour: #010101 (black)
 * - Inactive colour: rgba(1,1,1,0.45) (textMuted)
 * - Tab bar background: #FFFFFF
 *
 * @component
 */
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.focused : icons.outline;
          const iconColor = focused ? colors.black : colors.textMuted;

          // Center Home tab gets a slightly larger icon
          if (route.name === 'Dashboard') {
            return (
              <View style={styles.centerIcon}>
                <Ionicons name={iconName} size={28} color={iconColor} />
              </View>
            );
          }

          return <Ionicons name={iconName} size={24} color={iconColor} />;
        },
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      })}
    >
      <Tab.Screen name="Scripts" component={ScriptsScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 16 : 24,
    left: 60,
    right: 60,
    height: 64,
    backgroundColor: colors.white,
    borderRadius: 32,
    borderTopWidth: 0,
    paddingBottom: 0,
    paddingTop: 0,
    marginRight: 10,
    marginLeft: 10,
    // Shadow (iOS)
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    // Shadow (Android)
    elevation: 20,
  },
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  centerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomTabNavigator;
