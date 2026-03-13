import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import colors from '@/styles/colors';
import { useAuth } from '../utils/AuthContext';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={colors.primary[400]} />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/my-tasks" />;
  }

  return <Redirect href="/landing" />;
}
