import { Alert, Pressable, Text } from 'react-native';
import { Stack } from 'expo-router';
import { styles } from '../available-pick-ups/styles';

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
            <Text style={(styles.claimPickupText)}>Claim Pickup</Text>
          </Pressable>
        ),
      }}
    >
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
