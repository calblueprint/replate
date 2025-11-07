import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { router } from 'expo-router';
import { getPartners, updateDriverPartner } from '~/api/config';
import { styles } from './styles';

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
    <View style={styles.container}>
      <View>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Which NPO are you partnered with?</Text>

        <DropDownPicker
          open={open}
          value={selectedNPOId}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedNPOId}
          setItems={setItems}
          placeholder="Select an NPO"
          style={styles.dropdownStyle}
          placeholderStyle={styles.placeholderStyle}
          dropDownContainerStyle={styles.dropdownListStyle}
          zIndex={1000}
        />
      </View>
      <Pressable
        style={[
          styles.buttonBase,
          selectedNPOId === 0 ? styles.buttonDisabled : styles.buttonEnabled,
        ]}
        disabled={selectedNPOId === 0}
        onPress={handleUpdatePress()}
      >
        <Text style={styles.buttonText}>Finish</Text>
      </Pressable>
    </View>
  );
}
