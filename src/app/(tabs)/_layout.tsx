import React from 'react';
import { Dimensions, Image } from 'react-native';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import homeIcon from 'assets/home.png';
import profileIcon from 'assets/profile.png';
import tasksIcon from 'assets/tasks.png';

const { width: screenWidth } = Dimensions.get('window');

export default function TabLayout() {
  const translateX = useSharedValue(0);
  const insets = useSafeAreaInsets();

  useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-screenWidth * 0.3, 0, screenWidth * 0.3],
      [0.7, 1, 0.7],
    );

    const scale = interpolate(
      translateX.value,
      [-screenWidth * 0.3, 0, screenWidth * 0.3],
      [0.95, 1, 0.95],
    );

    return {
      transform: [{ translateX: translateX.value }, { scale }],
      opacity,
    };
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 12,
          shadowOpacity: 0.08,
          shadowRadius: 10,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom - 10, 10), // Ensure minimum padding
          minHeight: 65,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        },
        tabBarActiveTintColor: '#06B97C',
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Lato',
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
                width: 27,
                height: 27,
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
