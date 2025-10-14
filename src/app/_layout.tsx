import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnbordingFlow from './onboarding/page';
import OnboardingFlow from './onboarding/page';

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
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
        <Stack.Screen name="Index" component={IndexScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingFlow} />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}

export default StackLayout;
