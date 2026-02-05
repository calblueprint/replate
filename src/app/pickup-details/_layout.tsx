import { TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PickupDetailsLayout() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Navigate to available pickups tab if can't go back
      router.replace('/(tabs)/available-pick-ups');
    }
  };

  return (
    <Stack
      screenOptions={{
        headerTitle: 'Pickup',
        headerLeft: () => (
          <TouchableOpacity
            onPress={handleBack}
            style={{
              marginLeft: 16,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#F3F4F6',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="chevron-back" size={20} color="#000" />
          </TouchableOpacity>
        ),
        headerBackVisible: false, // Hide the default back button
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontFamily: 'LatoBold',
          fontSize: 18,
          color: '#000',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
