import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../utils/AuthContext';

export default function DashboardPage() {
  const { driver, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Dashboard</Text>

        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          Welcome, {driver?.first_name}!
        </Text>

        <Text style={{ fontSize: 14, marginBottom: 20 }}>
          Email: {driver?.email}
        </Text>

        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: '#ff4444',
            padding: 15,
            borderRadius: 5,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
