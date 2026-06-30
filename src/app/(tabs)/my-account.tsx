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
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitial()}</Text>
          </View>
          <Text style={styles.nameDisplay}>
            {driver?.first_name} {driver?.last_name}
          </Text>
        </View>

        {/* White card with fields + logout */}
        <View style={styles.formCard}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Name</Text>
            <Text style={[styles.fieldText, styles.fieldTextCapitalize]}>
              {driver?.first_name} {driver?.last_name}
            </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={styles.fieldText}>{driver?.email || ''}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Phone</Text>
            <Text style={styles.fieldText}>{driver?.phone || ''}</Text>
          </View>

          <View style={styles.fieldContainerLast}>
            <Text style={styles.fieldLabel}>NPO</Text>
            <Text style={styles.fieldText}>{partnerName}</Text>
          </View>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
