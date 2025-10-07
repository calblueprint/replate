import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './auth/login/page';
import SignupPage from './auth/signup/page';

const Stack = createNativeStackNavigator();

// Temporary replacement for "index" screen
function IndexScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello 👋 This is your Index screen</Text>
    </View>
  );
}

function StackLayout() {
  return (
    <SafeAreaProvider>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Signup" component={SignupPage} />
        <Stack.Screen name="Index" component={IndexScreen} />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}

export default StackLayout;
