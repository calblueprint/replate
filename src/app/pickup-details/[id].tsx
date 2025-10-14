import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MOCK_PICKUPS } from "../available-pick-ups"; // re-use your mock data

function fmtTime(iso: string) {
  return new Date(iso)
    .toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    .toLowerCase();
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        backgroundColor: "#f7f7f7",
      }}
    >
      <Text style={{ fontWeight: "700", marginBottom: 6 }}>{title}</Text>
      {children}
    </View>
  );
}

export default function PickupDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pickup = MOCK_PICKUPS.find((p) => String(p.id) === String(id));

  if (!pickup) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text>Pickup not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
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