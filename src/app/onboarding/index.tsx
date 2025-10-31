import React, { useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function OnboardingFlow() {
  const MOCK_NPOS = [
    { id: 1, name: 'Replate' },
    { id: 2, name: 'Adopt an Inmate' },
    { id: 3, name: 'Amigos De Los Rios' },
    { id: 4, name: 'Rose Academies' },
    { id: 5, name: 'EcoVet' },
  ];

  const [open, setOpen] = useState(false);
  const [selectedNPOId, setSelectedNPOId] = useState(null);
  const [items, setItems] = useState(
    MOCK_NPOS.map(npo => ({ label: npo.name, value: npo.id })),
  );

  return (
    <View style={{ marginTop: 50 }}>
      <Text>Which NPO are you partnered with?</Text>

      <DropDownPicker
        open={open}
        value={selectedNPOId}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedNPOId}
        setItems={setItems}
        placeholder="Select an NPO"
      />

      <Button
        title="Finish"
        disabled={selectedNPOId === null}
        onPress={() => Alert.alert('Your NPO selection has been saved.')}
      />
    </View>
  );
}
