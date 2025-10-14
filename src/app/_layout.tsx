// import { Text, View } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// const Stack = createNativeStackNavigator();

// // Temporary replacement for "index" screen
// function IndexScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Hello 👋 This is your Index screen</Text>
//     </View>
//   );
// }

// function StackLayout() {
//   return (
//     <SafeAreaProvider>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Index" component={IndexScreen} />
//       </Stack.Navigator>
//     </SafeAreaProvider>
//   );
// }

// export default StackLayout;

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: "Today's Tasks",
        headerStyle: { backgroundColor: '#DCDCDC' },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: '700',
        },
        contentStyle: { backgroundColor: '#DCDCDC' },
      }}
    >
      <Stack.Screen name="pickup-details" options={{ headerShown: false }} />
    </Stack>
  );
}
