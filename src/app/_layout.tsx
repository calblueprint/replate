import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="pickup-details" options={{ headerShown: false }} />
        <Stack.Screen name="my-tasks" options={{ headerShown: false }} />
        <Stack.Screen
          name="donation-details/[id]"
          options={{ headerShown: false }}
        />
      </Stack>
      <Toast />
    </SafeAreaProvider>
  );
}
