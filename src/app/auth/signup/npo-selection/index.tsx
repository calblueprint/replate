import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { router, useLocalSearchParams } from 'expo-router';
import { DriverSignupData } from '../../../../../api/config';
import Button from '../../../../components/Button/Button';
import { authStyles } from '../../../../styles/authStyles';
import { useAuth } from '../../../../utils/AuthContext';

const NPO_OPTIONS = [
  { id: 1, name: 'Denver Food Rescue (DFR)', icon: '🚚' },
  { id: 2, name: 'Rescuing Leftover Cuisine (RLC)', icon: '♻️' },
  { id: 3, name: 'Hollywood Food Coalition (HFC)', icon: '🏢' },
  { id: 4, name: 'Food Connect Group (FCG)', icon: '🏢' },
  { id: 5, name: 'Chicago Food Rescue (CFR)', icon: '🏢' },
];

export default function NpoSelectionPage() {
  const params = useLocalSearchParams<{ signupData: string }>();
  const { signup } = useAuth();
  const [selectedNPO, setSelectedNPO] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(dropdownAnim, {
      toValue: isDropdownOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isDropdownOpen]);

  const handleFinish = async () => {
    if (!selectedNPO || !params.signupData) return;

    try {
      setIsLoading(true);
      const signupData: DriverSignupData = JSON.parse(params.signupData);

      await signup(signupData);
      console.log('Driver created successfully');
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account created successfully!',
        position: 'top',
        visibilityTime: 3000,
      });
      setTimeout(() => {
        router.push('/(tabs)/dashboard');
      }, 500);
    } catch (error) {
      console.error('Signup error:', error);
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2:
          error instanceof Error
            ? error.message
            : 'Failed to create account. Please try again.',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectNPO = (npoName: string) => {
    setSelectedNPO(npoName);
    setIsDropdownOpen(false);
  };

  const dropdownHeight = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  const dropdownOpacity = dropdownAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.8, 1],
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={authStyles.container}>
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              padding: 24,
              paddingTop: 20,
              paddingBottom: 100,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View>
              {/* Back Button */}
              <TouchableOpacity
                onPress={() => router.back()}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    marginRight: 8,
                    transform: [{ rotate: '90deg' }],
                  }}
                >
                  ▼
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Lato_400Regular',
                    color: '#525454',
                  }}
                >
                  Back
                </Text>
              </TouchableOpacity>

              {/* Title */}
              <Text
                style={[
                  authStyles.title,
                  { fontSize: 16, marginBottom: 28, fontWeight: '500' },
                ]}
              >
                Which NPO are you partnered with?
              </Text>

              {/* Dropdown */}
              <View style={{ marginBottom: 24, zIndex: 1 }}>
                <TouchableOpacity
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={[
                    authStyles.inputWrapper,
                    {
                      borderColor: '#111111',
                      borderWidth: 1,
                      borderRadius: 10,
                      position: 'relative',
                    },
                  ]}
                >
                  <View style={[authStyles.inputInner, { paddingRight: 40 }]}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: 'Lato_400Regular',
                        color: selectedNPO ? '#000' : '#666',
                        textAlign: 'left',
                      }}
                    >
                      {selectedNPO || 'Select an NPO'}
                    </Text>
                  </View>
                  <View
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: [{ translateY: -8 }],
                    }}
                  >
                    <Text style={{ fontSize: 14, color: '#000' }}>
                      {isDropdownOpen ? '▲' : '▼'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Dropdown List with Animation */}
                <Animated.View
                  style={{
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: '#111111',
                    borderRadius: 10,
                    marginTop: 4,
                    overflow: 'hidden',
                    opacity: dropdownOpacity,
                    height: dropdownHeight,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <ScrollView
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                  >
                    {NPO_OPTIONS.map((npo, index) => (
                      <TouchableOpacity
                        key={npo.id}
                        onPress={() => handleSelectNPO(npo.name)}
                        style={{
                          padding: 16,
                          borderBottomWidth:
                            index < NPO_OPTIONS.length - 1 ? 1 : 0,
                          borderBottomColor: '#E5E5E5',
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor:
                            selectedNPO === npo.name ? '#f3f4f6' : '#fff',
                        }}
                      >
                        <Text style={{ marginRight: 12, fontSize: 20 }}>
                          {npo.icon}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'Lato_400Regular',
                            color: '#000',
                            flex: 1,
                          }}
                        >
                          {npo.name}
                        </Text>
                        {selectedNPO === npo.name && (
                          <Text style={{ color: '#007AFF', fontSize: 16 }}>
                            ✓
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </Animated.View>
              </View>
            </View>
          </ScrollView>

          {/* Finish Button - Fixed at Bottom */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 24,
              paddingBottom: 40,
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#E5E5E5',
            }}
          >
            <Button
              text={isLoading ? 'Creating Account...' : 'Finish'}
              disabled={!selectedNPO || isLoading}
              onPress={handleFinish}
            />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
