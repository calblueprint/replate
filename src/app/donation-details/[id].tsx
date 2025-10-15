import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function DonationDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text testID="details-id">Details for donation: {id}</Text>
    </View>
  );
}
