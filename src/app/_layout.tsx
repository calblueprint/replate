//import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Stack } from 'expo-router';

//const Stack = createNativeStackNavigator();

// Temporary replacement for "index" screen
// function IndexScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Hello 👋 This is your Index screen</Text>
//     </View>
//   );
// }

function StackLayout() {
  return (
    <SafeAreaProvider>
      {/* <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Index" component={IndexScreen} />
      </Stack.Navigator> */}
      <Stack>
        <Stack.Screen
          name="my-tasks/page"
          options={{
            headerShown: true,
            headerTitle: '',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: '#fff' },
          }}
        />
        <Stack.Screen
          name="donation-details/[id]"
          options={{
            headerShown: true,
            headerTitle: 'Donation Details',
            headerStyle: { backgroundColor: '#f8f8f8' },
            headerTitleStyle: { fontSize: 22, fontWeight: '600' },
          }}
        />
      </Stack>
      <Toast />
    </SafeAreaProvider>
  );
}

export default StackLayout;
