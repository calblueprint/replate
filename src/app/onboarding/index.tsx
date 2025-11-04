import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getPartners, updateDriverPartner } from '~/api/config';

export default function OnboardingFlow() {
  const [partners, setPartners] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedNPOId, setSelectedNPOId] = useState(0);
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

  const handleUpdatePress = () => async () => {
    await updateDriverPartner(selectedNPOId);
  };

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
        disabled={selectedNPOId === 0}
        onPress={handleUpdatePress()}
      />
    </View>
  );
}
