import React from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fmtTime } from '@/utils/dateHelpers';
import { MOCK_PICKUPS } from '../available-pick-ups'; // re-use your mock data
import { styles } from '../available-pick-ups/styles';

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.detailsSections}>
      <Text style={{ fontWeight: '700', marginBottom: 6 }}>{title}</Text>
      {children}
    </View>
  );
}

export default function PickupDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pickup = MOCK_PICKUPS.find(p => String(p.id) === String(id));

  if (!pickup) {
    return (
      <View style={styles.view}>
        <Text>Pickup not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.view}>
      <Section title="Pickup Location">
        <Text>{pickup.pickup_location}</Text>
      </Section>

      <Section title="Pickup ID">
        <Text>{pickup.id}</Text>
      </Section>

      <Section title="Time Window">
        <Text>
          {fmtTime(pickup.slot_start_time)} — {fmtTime(pickup.slot_end_time)}
        </Text>
      </Section>
    </View>
  );
}
