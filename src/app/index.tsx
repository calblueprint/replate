import { Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../utils/AuthContext';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking stored auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // If logged in, go to dashboard
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/my-tasks" />;
  }

  // If not logged in, show landing page
  return <Redirect href="/landing" />;
}
