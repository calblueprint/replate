import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Stack } from 'expo-router';
import { AuthProvider } from '../utils/AuthContext';
import { NavBar } from '../components/NavBar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="pickup-details" />
            <Stack.Screen name="my-tasks" />
            <Stack.Screen name="donation-details/[id]" />
            <Stack.Screen name="my-account" />
            <Stack.Screen name="available-pick-ups" />
          </Stack>

          <NavBar />
          <Toast />
        </>
      </AuthProvider>
    </SafeAreaProvider>
  );
}