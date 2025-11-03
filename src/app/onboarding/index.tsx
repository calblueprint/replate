import React, { useEffect, useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getPartners } from '~/api/config';

export default function OnboardingFlow() {
  const [partners, setPartners] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedNPOId, setSelectedNPOId] = useState(null);
  const [items, setItems] = useState([{}]);

  useEffect(() => {
    (async () => {
      try {
        const partnersList = await getPartners();
        setPartners(partnersList);
      } catch (err) {
        console.error('Error fetching partners:', err);
      }
    })();
  }, []);

  useEffect(() => {
    setItems(partners.map(npo => ({ label: npo[1], value: npo[0] })));
  }, [partners]);

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
