import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../../utils/AuthContext';

export default function MyAccountPage() {
  const { driver, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Image/Avatar */}
        <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 16 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: '#1d3557',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontFamily: 'Lato_700Bold',
                color: '#fff',
              }}
            >
              {getInitials()}
            </Text>
          </View>
        </View>

        {/* Name Display */}
        <Text
          style={{
            fontSize: 24,
            fontFamily: 'Lato_400Regular',
            textAlign: 'center',
            color: '#000',
            marginBottom: 32,
          }}
        >
          {driver?.first_name} {driver?.last_name}
        </Text>

        {/* Name Field */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Lato_700Bold',
              color: '#525454',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Name
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View
              style={{
                flex: 1,
                borderWidth: 0.7,
                borderColor: '#1d3557',
                borderRadius: 5,
                padding: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Lato_400Regular',
                  color: '#2c2c2c',
                }}
              >
                {driver?.first_name || ''}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                borderWidth: 0.7,
                borderColor: '#111111',
                borderRadius: 5,
                padding: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Lato_400Regular',
                  color: '#2c2c2c',
                }}
              >
                {driver?.last_name || ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Email Field */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Lato_700Bold',
              color: '#525454',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Email
          </Text>
          <View
            style={{
              borderWidth: 0.7,
              borderColor: '#111111',
              borderRadius: 5,
              padding: 12,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Lato_400Regular',
                color: '#2c2c2c',
              }}
            >
              {driver?.email || ''}
            </Text>
          </View>
        </View>

        {/* Phone Field */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Lato_700Bold',
              color: '#525454',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Phone
          </Text>
          <View
            style={{
              borderWidth: 0.7,
              borderColor: '#111111',
              borderRadius: 5,
              padding: 12,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Lato_400Regular',
                color: '#2c2c2c',
              }}
            >
              {driver?.phone || ''}
            </Text>
          </View>
        </View>

        {/* NPO Field */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Lato_700Bold',
              color: '#525454',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            NPO
          </Text>
          <View
            style={{
              borderWidth: 0.7,
              borderColor: '#111111',
              borderRadius: 5,
              padding: 12,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Lato_400Regular',
                color: '#131414',
              }}
            >
              Denver Food Rescue (DFR)
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: '#58ad85',
            padding: 13,
            borderRadius: 10,
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontFamily: 'Lato_700Bold',
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
