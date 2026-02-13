import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
// Landing page image
import REPLATE_IMAGE from '../../../assets/replate-logo.png';
import colors from '../../styles/colors';
import { typography } from '../../styles/typography';

export default function LandingPage() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.content,
          {
            paddingTop: Math.max(insets.top + 20, 40),
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
      >
        {/* Top Section - Image */}
        <View style={styles.topSection}>
          <View style={styles.imageContainer}>
            <Image
              source={REPLATE_IMAGE}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Middle Section - Text */}
        <View style={styles.middleSection}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.subtitle}>Let's sign you into your account.</Text>
        </View>

        {/* Bottom Section - Buttons */}
        <View style={styles.buttonContainer}>
          {/* LOGIN Button - Outlined */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.replace('/auth/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>

          {/* SIGNUP Button - Filled */}
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => router.replace('/auth/signup')}
            activeOpacity={0.8}
          >
            <Text style={styles.signupButtonText}>SIGNUP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 56,
  },
  imageContainer: {
    width: 100,
    aspectRatio: 848 / 818,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  middleSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  welcomeText: {
    ...typography.h2,
    fontSize: 30,
    textAlign: 'center',
    color: colors.black,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Lato',
    textAlign: 'center',
    color: colors.gray,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  loginButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.jasmine,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    minHeight: 50,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'LatoBold',
    color: colors.jasmine,
    lineHeight: 30,
  },
  signupButton: {
    width: '100%',
    backgroundColor: colors.jasmine,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  signupButtonText: {
    fontSize: 16,
    fontFamily: 'LatoBold',
    color: colors.white,
    lineHeight: 30,
  },
});
