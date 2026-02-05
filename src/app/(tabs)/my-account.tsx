import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { myAccountStyles } from '../../styles/tabs/my-account-styles';
import { useAuth } from '../../utils/AuthContext';
import { useProfile } from '../../utils/ProfileContext';

export default function MyAccountPage() {
  const { driver, logout } = useAuth();
  const { profile } = useProfile();

  const handleLogout = () => {
    logout();
    router.replace('/landing');
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
        <View style={myAccountStyles.fieldContainerLast}>
          <Text style={myAccountStyles.fieldLabel}>NPO</Text>
          <View style={myAccountStyles.fieldBox}>
            <Text style={myAccountStyles.fieldTextDark}>
              {profile?.partner_id}
            </Text>
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
