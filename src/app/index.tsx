import { Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../utils/AuthContext';
import { useProfile } from '../utils/ProfileContext';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  // Show loading while checking stored auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // If not logged in, show landing page
  if (!isAuthenticated) {
    return <Redirect href="/landing" />;
  }

  // Authenticated — wait for profile to finish loading before routing
  if (profileLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // If driver has no partner yet, send them through onboarding
  if (!profile?.partner_id) {
    return <Redirect href="/onboarding" />;
  }

  // Fully set up — go to dashboard
  return <Redirect href="/(tabs)/my-tasks" />;
}
