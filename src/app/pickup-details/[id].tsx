import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function PickupDetails() {
  const { id } = useLocalSearchParams<{ id: string,  }>();
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text testID="details-id">Details for pickup: {id}</Text>
    </View>
  );
}