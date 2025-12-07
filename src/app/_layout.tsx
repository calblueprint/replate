import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { NavBar } from '../components/NavBar';

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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="pickup-details" />
        <Stack.Screen name="my-tasks" />
        <Stack.Screen name="donation-details/[id]" />
        <Stack.Screen name="my-account" />
        <Stack.Screen name="available-pick-ups" />
      </Stack>
      <NavBar />
      <Toast />
    </SafeAreaProvider>
  );
}
