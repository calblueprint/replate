import React from 'react';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import homeIcon from 'assets/home.png';
import profileIcon from 'assets/profile.png';
import tasksIcon from 'assets/tasks.png';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 12,
          position: 'absolute',
          shadowOpacity: 0.08,
          shadowRadius: 10,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom - 10, 10), // Ensure minimum padding
          height: 84,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },
        tabBarActiveTintColor: '#06B97C',
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Lato',
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
              style={{
                width: 25,
                height: 25,
                tintColor: color,
              }}
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
              style={{
                width: 25,
                height: 25,
                tintColor: color,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my-account"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Image
              source={profileIcon}
              style={{
                width: 40,
                height: 40,
                tintColor: color,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
