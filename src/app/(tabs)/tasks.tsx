import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TasksPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text
          style={{ fontSize: 24, fontFamily: 'Lato_700Bold', marginBottom: 10 }}
        >
          Tasks
        </Text>
        <Text
          style={{ fontSize: 16, fontFamily: 'Lato_400Regular', color: '#666' }}
        >
          Your tasks will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
}
