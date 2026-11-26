import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import REPLATE_LOGO from '../../assets/replate-logo.png';
import { authStyles } from '../styles/authStyles';
import BackButton from './BackButton';

interface AuthScreenLayoutProps {
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  children?: React.ReactNode;
}

export default function AuthScreenLayout({
  title,
  subtitle,
  showBackButton = true,
  children,
}: AuthScreenLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView
        contentContainerStyle={[
          authStyles.scrollViewContent,
          { paddingBottom: Math.max(insets.bottom + 40, 60) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
        keyboardDismissMode="interactive"
        contentInsetAdjustmentBehavior="automatic"
        style={authStyles.scrollViewFlex}
      >
        <View style={authStyles.formCard}>
          {showBackButton && <BackButton />}
          <View style={authStyles.logoContainer}>
            <Image source={REPLATE_LOGO} style={authStyles.logoImage} />
          </View>
          <Text style={authStyles.titleCentered}>{title}</Text>
          <Text style={authStyles.subtitleCentered}>{subtitle}</Text>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
