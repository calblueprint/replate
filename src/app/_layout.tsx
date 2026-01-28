import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import { AuthProvider } from '../utils/AuthContext';
import { ProfileProvider } from '../utils/ProfileContext';

void SplashScreen.preventAutoHideAsync();

function StackLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
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
          <Stack.Screen name="my-tasks" />
          <Stack.Screen name="donation-details/[id]" />
          <Stack.Screen name="my-account" />
          <Stack.Screen name="available-pick-ups" />
        </Stack>
        <Toast />
      </ProfileProvider>
    </AuthProvider>
  );
}

export default function RootLayout() {
  /* eslint-disable @typescript-eslint/no-require-imports */
  const [fontsLoaded] = useFonts({
    Lato: require('../../assets/fonts/Lato/Lato-Regular.ttf'),
    LatoBold: require('../../assets/fonts/Lato/Lato-Bold.ttf'),
    LatoLight: require('../../assets/fonts/Lato/Lato-Light.ttf'),
  });
  /* eslint-enable @typescript-eslint/no-require-imports */

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StackLayout />
    </SafeAreaProvider>
  );
}
