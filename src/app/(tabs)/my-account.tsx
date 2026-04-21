import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getPartners } from '../../../api/config';
import { myAccountStyles as styles } from '../../styles/tabs/my-account-styles';
import { useAuth } from '../../utils/AuthContext';
import { useProfile } from '../../utils/ProfileContext';

export default function MyAccountPage() {
  const { driver, logout } = useAuth();
  const { profile } = useProfile();
  const [partners, setPartners] = useState<[number, string][]>([]);

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

  const getInitial = () => {
    if (driver?.first_name) {
      return driver.first_name[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header with avatar + name */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitial()}</Text>
          </View>
          <Text style={styles.nameDisplay}>
            {driver?.first_name} {driver?.last_name}
          </Text>
        </View>

        {/* White card with form fields */}
        <View style={styles.formCard}>
          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Name</Text>
            <View style={styles.nameRow}>
              <View style={styles.nameFieldBox}>
                <Text style={styles.fieldText}>{driver?.first_name || ''}</Text>
              </View>
              <View style={styles.nameFieldBox}>
                <Text style={styles.fieldText}>{driver?.last_name || ''}</Text>
              </View>
            </View>
          </View>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.fieldBox}>
              <Text style={styles.fieldText}>{driver?.email || ''}</Text>
            </View>
          </View>

          {/* Phone Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Phone</Text>
            <View style={styles.fieldBox}>
              <Text style={styles.fieldText}>{driver?.phone || ''}</Text>
            </View>
          </View>

          {/* NPO Field */}
          <View style={styles.fieldContainerLast}>
            <Text style={styles.fieldLabel}>NPO</Text>
            <View style={styles.fieldBox} />
            <Text style={styles.npoText}>{partnerName}</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
