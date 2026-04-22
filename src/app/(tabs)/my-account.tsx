import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { ApiError } from '../../../api/apiUtils';
import { getPartners, updateDriver } from '../../../api/config';
import { myAccountStyles } from '../../styles/tabs/my-account-styles';
import { useAuth } from '../../utils/AuthContext';
import { useProfile } from '../../utils/ProfileContext';

export default function MyAccountPage() {
  const { driver, logout } = useAuth();
  const { profile, setProfile, refreshProfile } = useProfile();
  const [partners, setPartners] = useState<[number, string][]>([]);
  const [savingReminders, setSavingReminders] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const list = await getPartners();
        setPartners(list as [number, string][]);
      } catch (e) {
        console.log('failed to load partners', e);
      }
    })();
  }, []);

  const partnerName =
    partners.find(([id]) => id === profile?.partner_id)?.[1] ?? '—';

  const handleLogout = () => {
    logout();
    router.replace('/landing');
  };

  const handlePickupRemindersChange = async (next: boolean) => {
    if (!driver?.id) {
      Alert.alert(
        'Account unavailable',
        'We could not verify your account. Please sign out and sign in again.',
      );
      return;
    }

    if (next) {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Notification access needed',
          'Pickup Reminders require notification access. Enable notifications in Settings to turn this on.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                void Linking.openSettings();
              },
            },
          ],
        );
        return;
      }
    }

    setSavingReminders(true);
    try {
      await updateDriver(driver.id, { notifications_enabled: next });
      if (profile) {
        setProfile({ ...profile, notifications_enabled: next });
      } else {
        await refreshProfile(driver.id);
      }
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Unable to update pickup reminders. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setSavingReminders(false);
    }
  };

  // Get initials for avatar
  const getInitials = () => {
    if (driver?.first_name && driver?.last_name) {
      return `${driver.first_name[0]}${driver.last_name[0]}`.toUpperCase();
    }
    if (driver?.first_name) {
      return driver.first_name[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <SafeAreaView style={myAccountStyles.container}>
      <ScrollView
        contentContainerStyle={myAccountStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Image/Avatar */}
        <View style={myAccountStyles.avatarContainer}>
          <View style={myAccountStyles.avatar}>
            <Text style={myAccountStyles.avatarText}>{getInitials()}</Text>
          </View>
        </View>

        {/* Name Display */}
        <Text style={myAccountStyles.nameDisplay}>
          {driver?.first_name} {driver?.last_name}
        </Text>

        {/* Name Field */}
        <View style={myAccountStyles.fieldContainer}>
          <Text style={myAccountStyles.fieldLabel}>Name</Text>
          <View style={myAccountStyles.nameRow}>
            <View style={myAccountStyles.nameFieldBox}>
              <Text style={myAccountStyles.fieldText}>
                {driver?.first_name || ''}
              </Text>
            </View>
            <View style={myAccountStyles.nameFieldBox}>
              <Text style={myAccountStyles.fieldText}>
                {driver?.last_name || ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Email Field */}
        <View style={myAccountStyles.fieldContainer}>
          <Text style={myAccountStyles.fieldLabel}>Email</Text>
          <View style={myAccountStyles.fieldBox}>
            <Text style={myAccountStyles.fieldText}>{driver?.email || ''}</Text>
          </View>
        </View>

        {/* Phone Field */}
        <View style={myAccountStyles.fieldContainer}>
          <Text style={myAccountStyles.fieldLabel}>Phone</Text>
          <View style={myAccountStyles.fieldBox}>
            <Text style={myAccountStyles.fieldText}>{driver?.phone || ''}</Text>
          </View>
        </View>

        {/* NPO Field */}
        <View style={myAccountStyles.fieldContainer}>
          <Text style={myAccountStyles.fieldLabel}>NPO</Text>
          <View style={myAccountStyles.fieldBox}>
            <Text style={myAccountStyles.fieldTextDark}>{partnerName}</Text>
          </View>
        </View>

        {/* Pickup Reminders */}
        <View style={myAccountStyles.fieldContainerLast}>
          <Text style={myAccountStyles.fieldLabel}>Pickup Reminders</Text>
          <View style={myAccountStyles.remindersRow}>
            <Text style={myAccountStyles.remindersDescription}>
              Get notified about upcoming pickups.
            </Text>
            <Switch
              value={profile?.notifications_enabled ?? false}
              onValueChange={handlePickupRemindersChange}
              disabled={savingReminders}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={myAccountStyles.logoutButton}
        >
          <Text style={myAccountStyles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
