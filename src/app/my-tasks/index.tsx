import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

const MOCK_MY_PICKUPS = [
  {
    id: 1,
    pickup_location: 'BP House',
  },
  {
    id: 2,
    pickup_location: 'Tause',
  },
];

export default function MyTasksPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Welcome Back</Text>
      <Text style={styles.name}>Eric Evans</Text>
      <Text style={styles.subtitle}>
        You have {MOCK_MY_PICKUPS.length} pick up(s) in progress
      </Text>

      {MOCK_MY_PICKUPS.map(pickup => (
        <TouchableOpacity
          key={pickup.id}
          style={styles.card}
          onPress={() =>
            router.push(
              `/donation-details/${pickup.id}?location=${pickup.pickup_location}`,
            )
          }
        >
          <View>
            <Text style={styles.location}>{pickup.pickup_location}</Text>
          </View>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Enter Data</Text>
          </View>
        </TouchableOpacity>
      ))}

      <Text style={styles.upcoming}>Upcoming Pick-ups</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: 'white' },
  greeting: { fontSize: 16, color: '#444', marginTop: 12 },
  name: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#666', marginBottom: 16 },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  location: { fontWeight: '700', fontSize: 16, marginBottom: 4 },
  button: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  buttonText: { fontWeight: '500' },
  upcoming: { fontSize: 16, fontWeight: '600' },
});
