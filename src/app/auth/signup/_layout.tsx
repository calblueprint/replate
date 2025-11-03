import { Stack } from 'expo-router';

function SignupLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default SignupLayout;
