import React from 'react';
import { Dimensions, Image } from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs, usePathname, useRouter } from 'expo-router';
import homeIcon from 'assets/home.png';
import profileIcon from 'assets/profile.png';
import tasksIcon from 'assets/tasks.png';

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.2; // Swipe 20% of screen width to trigger

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
    const index = tabs.findIndex(tab =>
      currentPath.includes(tab.split('/').pop()),
    );
    return index >= 0 ? index : 0;
  };

  const navigateToTab = (index: number) => {
    if (index >= 0 && index < tabs.length) {
      router.replace(tabs[index]);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleSwipe = (event: {
    nativeEvent: { state: number; translationX: number; velocityX: number };
  }) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;
      const currentIndex = getCurrentTabIndex();

      // Check if swipe is strong enough (considering both distance and velocity)
      const shouldSwipe =
        Math.abs(translationX) > SWIPE_THRESHOLD || Math.abs(velocityX) > 800;

      if (shouldSwipe) {
        if (translationX < 0 && currentIndex < tabs.length - 1) {
          // Swipe left - go to next tab
          runOnJS(navigateToTab)(currentIndex + 1);
        } else if (translationX > 0 && currentIndex > 0) {
          // Swipe right - go to previous tab
          runOnJS(navigateToTab)(currentIndex - 1);
        }
      }

      // Reset the position with a spring animation
      translateX.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
    } else if (event.nativeEvent.state === State.ACTIVE) {
      // Update position during swipe
      translateX.value = event.nativeEvent.translationX * 0.3; // Add some resistance
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler
        onHandlerStateChange={handleSwipe}
        onGestureEvent={handleSwipe}
        activeOffsetX={[-10, 10]} // Require 10px movement to activate
      >
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
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
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}
