import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: "Today's Tasks",
        headerStyle: { backgroundColor: '#DCDCDC' },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: '700',
        },
        contentStyle: { backgroundColor: '#DCDCDC' },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="pickup-details" options={{ headerShown: false }} />
    </Stack>
  );
}