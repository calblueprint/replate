import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MyAccountScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Account</Text>
      <Text style={styles.subtitle}>
        This is a temporary placeholder screen for the navigation bar.
      </Text>
    </View>
  );
};

export default MyAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6B7280',
  },
});
