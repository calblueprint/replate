import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import homeIcon from 'assets/home.png';
import profileIcon from 'assets/profile.png';
import tasksIcon from 'assets/tasks.png';
import { containerStyles, iconStyles, textStyles } from './styles';

export function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname.startsWith('/donation-details')) {
    return null;
  }

  if (pathname.startsWith('/onboarding')) {
    return null;
  }

  if (pathname.startsWith('/landing')) {
    return null;
  }

  if (pathname.startsWith('/auth')) {
    return null;
  }

  const isActive = (route: string) => pathname.startsWith(route);

  return (
    <View style={containerStyles.wrapper}>
      <View style={containerStyles.card}>
        {/* Home -> My Tasks */}
        <TouchableOpacity
          style={containerStyles.item}
          onPress={() => router.push('/my-tasks')}
        >
          <Image
            source={homeIcon}
            style={[
              iconStyles.icon,
              isActive('/my-tasks')
                ? iconStyles.iconActive
                : iconStyles.iconInactive,
            ]}
            resizeMode="contain"
          />
          <Text
            style={[
              textStyles.label,
              isActive('/my-tasks') && textStyles.labelActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* Tasks -> Available Pick Ups */}
        <TouchableOpacity
          style={containerStyles.item}
          onPress={() => router.push('/available-pick-ups')}
        >
          <Image
            source={tasksIcon}
            style={[
              iconStyles.icon,
              isActive('/available-pick-ups')
                ? iconStyles.iconActive
                : iconStyles.iconInactive,
            ]}
            resizeMode="contain"
          />
          <Text
            style={[
              textStyles.label,
              isActive('/available-pick-ups') && textStyles.labelActive,
            ]}
          >
            Tasks
          </Text>
        </TouchableOpacity>

        {/* Profile -> My Account */}
        <TouchableOpacity
          style={containerStyles.item}
          onPress={() => router.push('/my-account')}
        >
          <Image
            source={profileIcon}
            style={[
              iconStyles.icon,
              isActive('/my-account')
                ? iconStyles.iconActive
                : iconStyles.iconInactive,
            ]}
            resizeMode="contain"
          />
          <Text
            style={[
              textStyles.label,
              isActive('/my-account') && textStyles.labelActive,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
