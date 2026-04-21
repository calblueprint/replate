import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import Colors from '@/styles/colors';

interface Tab {
  key: string;
  label: string;
}

interface UnderlineTabBarProps {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
}

export default function UnderlineTabBar({
  tabs,
  activeKey,
  onChange,
}: UnderlineTabBarProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {tabs.map(tab => {
        const isActive = tab.key === activeKey;
        return (
          <Pressable
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onChange(tab.key)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Animated.Text
              style={[
                styles.tabLabel,
                isActive ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              {tab.label}
            </Animated.Text>
          </Pressable>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 35,
    marginBottom: 16,
    borderRadius: 8,
    gap: 32,
  },
  tab: {
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primaryGreen,
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: 'Lato',
    lineHeight: 20,
  },
  tabLabelActive: {
    color: Colors.secondaryGreen,
    fontFamily: 'LatoBold',
  },
  tabLabelInactive: {
    color: Colors.black,
  },
});
