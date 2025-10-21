import { Redirect, Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login/page" />
      <Stack.Screen name="auth/signup/page" />
    </Stack>
  );
}
