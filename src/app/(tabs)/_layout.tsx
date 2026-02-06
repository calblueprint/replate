import React, { useCallback } from 'react';
import { Dimensions, Image } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs, usePathname, useRouter } from 'expo-router';
import homeIcon from 'assets/home.png';
import profileIcon from 'assets/profile.png';
import tasksIcon from 'assets/tasks.png';

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.15; // Swipe 15% of screen width to trigger
const SWIPE_VELOCITY = 500; // Lower velocity threshold for easier swiping

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const translateX = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const tabs = [
    '/(tabs)/my-tasks',
    '/(tabs)/available-pick-ups',
    '/(tabs)/my-account',
  ];

  const getCurrentTabIndex = () => {
    const currentPath = pathname;
    const index = tabs.findIndex(tab => {
      const lastSegment = tab.split('/').pop();
      return lastSegment ? currentPath.includes(lastSegment) : false;
    });
    return index >= 0 ? index : 0;
  };

  const navigateToTab = (index: number) => {
    if (index >= 0 && index < tabs.length) {
      router.replace(tabs[index]);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
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

  const navigateToTabCallback = useCallback((index: number) => {
    navigateToTab(index);
  }, []);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-30, 30])
    .onStart(() => {
      'worklet';
    })
    .onUpdate(event => {
      'worklet';
      const currentIndex = getCurrentTabIndex();
      let translation = event.translationX;

      // Add resistance at edges
      if (
        (currentIndex === 0 && translation > 0) ||
        (currentIndex === tabs.length - 1 && translation < 0)
      ) {
        translation = translation * 0.2; // Strong resistance at boundaries
      }

      translateX.value = translation * 0.4; // Subtle movement during drag
    })
    .onEnd(event => {
      'worklet';
      const currentIndex = getCurrentTabIndex();

      // Check if swipe should trigger navigation
      const shouldSwipeLeft =
        event.translationX < -SWIPE_THRESHOLD ||
        event.velocityX < -SWIPE_VELOCITY;

      const shouldSwipeRight =
        event.translationX > SWIPE_THRESHOLD ||
        event.velocityX > SWIPE_VELOCITY;

      if (shouldSwipeLeft && currentIndex < tabs.length - 1) {
        // Navigate to next tab with smooth animation
        translateX.value = withTiming(-20, { duration: 50 }, finished => {
          if (finished) {
            translateX.value = withSpring(0, {
              damping: 18,
              stiffness: 280,
              mass: 0.4,
            });
          }
        });
        runOnJS(navigateToTabCallback)(currentIndex + 1);
      } else if (shouldSwipeRight && currentIndex > 0) {
        // Navigate to previous tab with smooth animation
        translateX.value = withTiming(20, { duration: 50 }, finished => {
          if (finished) {
            translateX.value = withSpring(0, {
              damping: 18,
              stiffness: 280,
              mass: 0.4,
            });
          }
        });
        runOnJS(navigateToTabCallback)(currentIndex - 1);
      } else {
        // Snap back with smooth spring
        translateX.value = withSpring(0, {
          damping: 18,
          stiffness: 280,
          mass: 0.4,
          velocity: event.velocityX,
        });
      }
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
