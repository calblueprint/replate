import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
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
        <Animated.View
          entering={FadeInUp.duration(400).springify().damping(16)}
          style={styles.profileHeader}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitial()}</Text>
          </View>
          <Text style={styles.nameDisplay}>
            {driver?.first_name} {driver?.last_name}
          </Text>
        </Animated.View>

        {/* White card with form fields */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(400).springify().damping(16)}
          style={styles.formCard}
        >
          {/* Name Field */}
          <Animated.View
            entering={FadeInDown.delay(250).duration(300)}
            style={styles.fieldContainer}
          >
            <Text style={styles.fieldLabel}>Name</Text>
            <View style={styles.nameRow}>
              <View style={styles.nameFieldBox}>
                <Text style={styles.fieldText}>{driver?.first_name || ''}</Text>
              </View>
              <View style={styles.nameFieldBox}>
                <Text style={styles.fieldText}>{driver?.last_name || ''}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Email Field */}
          <Animated.View
            entering={FadeInDown.delay(350).duration(300)}
            style={styles.fieldContainer}
          >
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.fieldBox}>
              <Text style={styles.fieldText}>{driver?.email || ''}</Text>
            </View>
          </Animated.View>

          {/* Phone Field */}
          <Animated.View
            entering={FadeInDown.delay(450).duration(300)}
            style={styles.fieldContainer}
          >
            <Text style={styles.fieldLabel}>Phone</Text>
            <View style={styles.fieldBox}>
              <Text style={styles.fieldText}>{driver?.phone || ''}</Text>
            </View>
          </Animated.View>

          {/* NPO Field */}
          <Animated.View
            entering={FadeInDown.delay(550).duration(300)}
            style={styles.fieldContainerLast}
          >
            <Text style={styles.fieldLabel}>NPO</Text>
            <View style={styles.fieldBox} />
            <Text style={styles.npoText}>{partnerName}</Text>
          </Animated.View>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View entering={FadeInDown.delay(650).duration(400)}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
