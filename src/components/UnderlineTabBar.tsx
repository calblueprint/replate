import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
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

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 };

export default function UnderlineTabBar({
  tabs,
  activeKey,
  onChange,
}: UnderlineTabBarProps) {
  const containerWidth = useSharedValue(0);
  const tabCount = Math.max(tabs.length, 1);
  const activeIndex = Math.max(
    tabs.findIndex(tab => tab.key === activeKey),
    0,
  );

  const underlineStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(
          (containerWidth.value / tabCount) * activeIndex,
          SPRING_CONFIG,
        ),
      },
    ],
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={styles.container}
      onLayout={event => {
        containerWidth.value = event.nativeEvent.layout.width;
      }}
    >
      {tabs.map(tab => {
        const isActive = tab.key === activeKey;
        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onPress={() => onChange(tab.key)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text
              style={[
                styles.tabLabel,
                isActive ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}

      {/* Sliding underline */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.underline,
          { width: `${100 / tabCount}%` },
          underlineStyle,
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 35,
    position: 'relative',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  underline: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 2,
    backgroundColor: Colors.primaryGreen,
    borderRadius: 1,
  },
  tabLabel: {
    textAlign: 'center',
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
