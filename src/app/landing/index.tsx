import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
// Landing page image
import REPLATE_IMAGE from '../../../assets/replate-logo.png';
import colors from '../../styles/colors';
import { typography } from '../../styles/typography';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function LandingPage() {
  const insets = useSafeAreaInsets();

  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoPulse = useSharedValue(1);

  useEffect(() => {
    // fade in + spring scale from 0 -> overshoot -> settle at 1
    logoOpacity.value = withDelay(
      200,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) }),
    );
    logoScale.value = withDelay(
      200,
      withSpring(1, { damping: 8, stiffness: 120, mass: 0.8 }),
    );

    // subtle pulse after the entrance settles (~1s in)
    logoPulse.value = withDelay(
      1200,
      withRepeat(
        withSequence(
          withTiming(1.04, {
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value * logoPulse.value }],
  }));

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
        {/* Top Section - Logo */}
        <Animated.View style={[styles.topSection, logoAnimatedStyle]}>
          <View style={styles.imageContainer}>
            <Image
              source={REPLATE_IMAGE}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Middle Section - Text */}
        <View style={styles.middleSection}>
          <Animated.Text
            entering={FadeInUp.duration(500).delay(500)}
            style={styles.welcomeText}
          >
            Welcome!
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.duration(500).delay(650)}
            style={styles.subtitle}
          >
            Let's sign you into your account.
          </Animated.Text>
        </View>

        {/* Bottom Section - Buttons */}
        <View style={styles.buttonContainer}>
          <AnimatedTouchable
            entering={FadeInDown.duration(400).delay(900)}
            style={styles.loginButton}
            onPress={() => router.replace('/auth/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </AnimatedTouchable>

          <AnimatedTouchable
            entering={FadeInDown.duration(400).delay(1050)}
            style={styles.signupButton}
            onPress={() => router.replace('/auth/signup')}
            activeOpacity={0.8}
          >
            <Text style={styles.signupButtonText}>SIGNUP</Text>
          </AnimatedTouchable>
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
