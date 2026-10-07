import React from 'react';
import { ScrollView, StyleProp, useWindowDimensions, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, MAX_WEB_WIDTH, SIDE_PADDING } from '@/store/theme';

export function Narrow({ children, max = 720 }: { children: React.ReactNode; max?: number }) {
  return <View style={{ width: '100%', maxWidth: max, alignSelf: 'center', gap: 12 }}>{children}</View>;
}

export const CTA = { width: '100%', maxWidth: 520, alignSelf: 'center' } as const;

export function useColumns() {
  const { width } = useWindowDimensions();
  if (width >= 1024) return 4;
  if (width >= 700) return 3;
  return 2;
}

export function useCardWidth(cols?: number) {
  const { width } = useWindowDimensions();
  const c = cols ?? (width >= 1024 ? 4 : width >= 700 ? 3 : 2);
  const container = Math.min(width, MAX_WEB_WIDTH);
  return (container - SIDE_PADDING * 2 - (c - 1) * 16) / c;
}

export function Screen({
  children,
  scroll = true,
  style,
  contentStyle,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: COLORS.white }, style]} edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[{ flexGrow: 1, backgroundColor: COLORS.white }, contentStyle]}
          showsVerticalScrollIndicator={false}>
          <View style={{ width: '100%', maxWidth: MAX_WEB_WIDTH, alignSelf: 'center', paddingHorizontal: SIDE_PADDING }}>
            {children}
          </View>
        </ScrollView>
      ) : (
        <View style={[{ flex: 1, width: '100%', maxWidth: MAX_WEB_WIDTH, alignSelf: 'center', paddingHorizontal: SIDE_PADDING }, contentStyle]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}
