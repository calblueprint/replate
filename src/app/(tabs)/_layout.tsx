import React from 'react';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import homeIcon from 'assets/home.png';
import tasksIcon from 'assets/tasks.png';
import colors from '@/styles/colors';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0,
          elevation: 12,
          shadowOpacity: 0.08,
          shadowRadius: 10,
          shadowColor: colors.neutral[900],
          shadowOffset: { width: 0, height: -4 },
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom - 10, 10),
          minHeight: 65,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        },
        tabBarActiveTintColor: colors.primary[400],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Lato-Bold',
          marginTop: -2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="my-tasks"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Image
              source={homeIcon}
              className="w-6 h-6"
              style={{ tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="available-pick-ups"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => (
            <Image
              source={tasksIcon}
              className="w-6 h-6"
              style={{ tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => (
            <Ionicons name="time-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-account"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
