import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
// NavBar removed - using tab navigation instead
import { AuthProvider } from '../utils/AuthContext';
import { ProfileProvider } from '../utils/ProfileContext';

void SplashScreen.preventAutoHideAsync();

function StackLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Lato: require('../../assets/fonts/Lato/Lato-Regular.ttf'),
    LatoBold: require('../../assets/fonts/Lato/Lato-Bold.ttf'),
    LatoLight: require('../../assets/fonts/Lato/Lato-Light.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <ProfileProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/signup" />
          <Stack.Screen name="auth/forgot-password" />
          <Stack.Screen name="auth/reset-password" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="pickup-details" />
          <Stack.Screen name="donation-details" />
          <Stack.Screen name="landing" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <Toast />
      </ProfileProvider>
    </AuthProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StackLayout />
    </SafeAreaProvider>
  );
}
