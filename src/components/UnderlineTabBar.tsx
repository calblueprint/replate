import React, { useCallback, useEffect } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text } from 'react-native';
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
  const tabLayouts = useSharedValue<
    Record<string, { x: number; width: number }>
  >({});
  const underlineX = useSharedValue(0);
  const underlineWidth = useSharedValue(0);

  const handleLayout = useCallback(
    (key: string) => (e: LayoutChangeEvent) => {
      const { x, width } = e.nativeEvent.layout;
      tabLayouts.value = { ...tabLayouts.value, [key]: { x, width } };

      if (key === activeKey) {
        underlineX.value = withSpring(x, SPRING_CONFIG);
        underlineWidth.value = withSpring(width, SPRING_CONFIG);
      }
    },
    [activeKey, tabLayouts, underlineX, underlineWidth],
  );

  useEffect(() => {
    const layout = tabLayouts.value[activeKey];
    if (layout) {
      underlineX.value = withSpring(layout.x, SPRING_CONFIG);
      underlineWidth.value = withSpring(layout.width, SPRING_CONFIG);
    }
  }, [activeKey, tabLayouts, underlineX, underlineWidth]);

  const underlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: underlineX.value }],
    width: underlineWidth.value,
  }));

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      {tabs.map(tab => {
        const isActive = tab.key === activeKey;
        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onLayout={handleLayout(tab.key)}
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
      <Animated.View style={[styles.underline, underlineStyle]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 35,
    position: 'relative',
    justifyContent: 'space-between',
  },
  tab: {
    paddingVertical: 10,
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    backgroundColor: Colors.primaryGreen,
    borderRadius: 1,
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
