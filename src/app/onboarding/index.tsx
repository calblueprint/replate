import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { router } from 'expo-router';
import colors from '@/styles/colors';
import { styles } from '@/styles/pages/onboarding-styles';
import { useAuth } from '@/utils/AuthContext';
import { useProfile } from '@/utils/ProfileContext';
import { ApiError } from '~/api/apiUtils';
import { getPartners, updateDriverPartner } from '~/api/config';

export default function OnboardingFlow() {
  type PartnerTuple = [number, string];
  type PickerItem = { label: string; value: number };

  const { driver } = useAuth();
  const { refreshProfile } = useProfile();
  const [partners, setPartners] = useState<PartnerTuple[]>([]);
  const [selectedNPOId, setSelectedNPOId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PickerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const disabled = selectedNPOId == null || isUpdating;

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const partnersList = await getPartners();

        const safePartners: PartnerTuple[] = Array.isArray(partnersList)
          ? (partnersList as unknown[]).filter((x): x is PartnerTuple => {
              return (
                Array.isArray(x) &&
                typeof x[0] === 'number' &&
                typeof x[1] === 'string'
              );
            })
          : [];

        setPartners(safePartners);
      } catch (err) {
        const errorMessage =
          err instanceof ApiError ? err.message : 'Failed to load partners';
        setError(errorMessage);
        setPartners([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setItems(partners.map(([id, name]) => ({ label: name, value: id })));
  }, [partners]);

  const handleUpdatePress = async () => {
    if (!driver || selectedNPOId == null) return;

    try {
      setIsUpdating(true);
      const updated = await updateDriverPartner(driver.id, selectedNPOId);
      if (!updated) return; // stay on page if it failed
      await refreshProfile(driver.id);
      router.replace('/(tabs)/my-tasks');
    } finally {
      setIsUpdating(false);
    }
  };

  // Show loading state while fetching partners
  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primaryGreen} />
        <Text style={{ marginTop: 12, color: '#6b7280' }}>
          Loading partners...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Welcome!</Text>
          <Text style={styles.welcomeSubtitle}>Please enter your details</Text>
        </View>

        <Text style={styles.title}>Which NPO are you partnered with?</Text>

        {error && (
          <View
            style={{
              backgroundColor: '#fee2e2',
              padding: 12,
              marginBottom: 16,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#991b1b', textAlign: 'center' }}>
              {error}
            </Text>
          </View>
        )}

        <DropDownPicker
          open={open}
          value={selectedNPOId}
          items={items}
          setOpen={setOpen}
          setValue={cb => setSelectedNPOId(cb(selectedNPOId))}
          setItems={setItems}
          placeholder="Select NPO Recipient"
          style={[styles.dropdownStyle, open && styles.dropdownOpenStyle]}
          placeholderStyle={styles.placeholderStyle}
          dropDownContainerStyle={styles.dropdownListStyle}
          listItemContainerStyle={styles.itemContainerStyle}
          selectedItemContainerStyle={styles.selectedItemContainer}
          showTickIcon={false}
          textStyle={styles.textStyle}
          zIndex={1000}
        />
      </View>

      <Pressable
        style={[
          styles.buttonBase,
          disabled ? styles.buttonDisabled : styles.buttonEnabled,
        ]}
        disabled={disabled}
        onPress={() => void handleUpdatePress()}
      >
        {isUpdating ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Finish</Text>
        )}
      </Pressable>
    </View>
  );
}
