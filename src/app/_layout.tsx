import { Stack } from 'expo-router';
import { AuthProvider } from '../utils/AuthContext';

function StackLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}

export default StackLayout;
