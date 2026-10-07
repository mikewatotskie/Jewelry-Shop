import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '@/store/theme';

const TABS = [
  { name: 'index', label: 'Home', icon: 'home', iconOutline: 'home-outline' },
  { name: 'search', label: 'Search', icon: 'search', iconOutline: 'search-outline' },
  { name: 'favorites', label: 'Favorites', icon: 'heart', iconOutline: 'heart-outline' },
  { name: 'profile', label: 'Profile', icon: 'person', iconOutline: 'person-outline' },
] as const;

function FigmaTabBar({ state, navigation }: { state: { index: number; routes: { key: string; name: string }[] }; navigation: { navigate: (name: string) => void } }) {
  const bar = state;
  const nav = navigation;
  return (
    <SafeAreaView edges={['bottom']} style={styles.wrap}>
      <View style={styles.bar}>
        {bar.routes.map((route, i) => {
          const tab = TABS.find((t) => t.name === route.name);
          if (!tab) return null;
          const focused = bar.index === i;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: focused }}
              onPress={() => nav.navigate(route.name)}
              style={({ pressed }) => [styles.item, { opacity: pressed ? 0.6 : 1 }]}>
              <View style={[styles.iconCircle, focused && styles.iconActive]}>
                <Ionicons
                  name={(focused ? tab.icon : tab.iconOutline) as never}
                  size={21}
                  color={COLORS.navy}
                />
              </View>
              <Text style={[styles.label, focused ? styles.labelActive : styles.labelIdle]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FigmaTabBar state={props.state as never} navigation={props.navigation as never} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  item: {
    flex: 1,
    maxWidth: 120,
    alignItems: 'center',
    gap: 4,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {
    backgroundColor: COLORS.aqua,
  },
  label: {
    fontSize: 14,
  },
  labelActive: {
    fontFamily: FONTS.semibold,
    color: COLORS.navy,
  },
  labelIdle: {
    fontFamily: FONTS.regular,
    color: COLORS.muted,
  },
});
