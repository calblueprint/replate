import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/styles/colors';

function CustomHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/my-tasks');
    }
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[100],
      }}
    >
      <View
        style={{
          height: 56,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <Pressable
          onPress={handleBack}
          style={{ padding: 4, marginRight: 8 }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color={colors.neutral[700]} />
        </Pressable>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontFamily: 'Lato-Bold',
            fontSize: 18,
            color: colors.neutral[800],
            marginRight: 36,
          }}
        >
          Enter Donation
        </Text>
      </View>
    </View>
  );
}

export default function DonationDetailsLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <CustomHeader />,
      }}
    >
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
