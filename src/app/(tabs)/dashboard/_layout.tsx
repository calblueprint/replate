import { Stack } from 'expo-router';

function DashboardLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default DashboardLayout;
