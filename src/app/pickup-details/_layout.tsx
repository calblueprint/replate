import { Alert, Pressable, Text } from 'react-native';
import { Stack } from 'expo-router';

export default function PickupDetailsLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Pickup Details',
        headerRight: () => (
          <Pressable
            onPress={() =>
              Alert.alert('Claim Pickup', 'Pretend we claimed it 🤓🍻')
            }
            style={{ paddingHorizontal: 8, paddingVertical: 6 }}
          >
            <Text style={{ fontWeight: '600' }}>Claim Pickup</Text>
          </Pressable>
        ),
      }}
    >
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
