import { Stack } from 'expo-router';

export default function DonationDetailsLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
