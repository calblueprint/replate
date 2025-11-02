import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#006970',
        tabBarInactiveTintColor: '#c0c5c2',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          shadowColor: 'rgba(0, 0, 0, 0.07)',
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 30,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          height: Platform.OS === 'ios' ? 84 : 60,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Lato_400Regular',
          fontSize: 8,
          letterSpacing: 0.16,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'MyTasks',
          tabBarIcon: ({ color }) => (
            <Ionicons name="clipboard-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-account/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
