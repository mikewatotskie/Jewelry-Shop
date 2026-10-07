import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useShop } from '@/store/shop';
import { COLORS, FONTS, RADIUS } from '@/store/theme';

export function CartButton() {
  const { cartCount } = useShop();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open cart, ${cartCount} items`}
      onPress={() => router.push('/cart' as never)}
      style={({ pressed }) => ({
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.light,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.6 : 1,
      })}>
      <Ionicons name="cart-outline" size={22} color={COLORS.navy} />
      {cartCount > 0 ? (
        <View
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            minWidth: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: COLORS.aqua,
            borderWidth: 1,
            borderColor: COLORS.navy,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 4,
          }}>
          <Text style={{ fontFamily: FONTS.bold, fontSize: 11, color: COLORS.navy }}>{cartCount}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export function AquaButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.aqua, { opacity: pressed || disabled ? 0.6 : 1 }]}>
      <Text style={styles.aquaText}>{label}</Text>
    </Pressable>
  );
}

export function OutlineButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.outline, { opacity: pressed ? 0.6 : 1 }]}>
      <Text style={styles.outlineText}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  active,
  onPress,
  wide,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  wide?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: active ? COLORS.aqua : COLORS.light, opacity: pressed ? 0.6 : 1 },
        wide ? { paddingHorizontal: 20 } : null,
      ]}>
      <Text style={[styles.chipText, { fontFamily: active ? FONTS.bold : FONTS.medium }]}>{label}</Text>
    </Pressable>
  );
}

export function SectionHeader({ title, actionLabel = 'See All', onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} hitSlop={8} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Rating({ value }: { value: number }) {
  const v = Number.isFinite(value) ? value : 0;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <MaterialCommunityIcons name="star" size={16} color={COLORS.navy} />
      <Text style={{ fontFamily: FONTS.semibold, fontSize: 14, color: COLORS.navy }}>{v.toFixed(1)}</Text>
    </View>
  );
}

export function QtyStepper({
  qty,
  onMinus,
  onPlus,
  small,
}: {
  qty: number;
  onMinus: () => void;
  onPlus: () => void;
  small?: boolean;
}) {
  const s = small ? 28 : 32;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        onPress={onMinus}
        style={({ pressed }) => [styles.step, { width: s, height: s, borderRadius: s / 2, opacity: pressed ? 0.6 : 1 }]}>
        <Ionicons name="remove" size={16} color={COLORS.navy} />
      </Pressable>
      <Text style={styles.qty}>{qty}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        onPress={onPlus}
        style={({ pressed }) => [styles.step, { width: s, height: s, borderRadius: s / 2, opacity: pressed ? 0.6 : 1 }]}>
        <Ionicons name="add" size={16} color={COLORS.navy} />
      </Pressable>
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyCircle}>
        <MaterialCommunityIcons name={icon as never} size={36} color={COLORS.navy} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMsg}>{message}</Text>
      {actionLabel && onAction ? (
        <View style={{ marginTop: 4, alignSelf: 'center', minWidth: 180 }}>
          <AquaButton label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

export function goBack(fallback = '/') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback as never);
}

const styles = StyleSheet.create({
  aqua: {
    backgroundColor: COLORS.aqua,
    borderRadius: RADIUS.lg,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  aquaText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.navy,
  },
  outline: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.navy,
    borderRadius: RADIUS.lg,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  outlineText: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.navy,
  },
  chip: {
    height: 36,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.navy,
  },
  section: {
    flexDirection: 'row',
    height: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.navy,
  },
  sectionAction: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.muted,
  },
  step: {
    backgroundColor: COLORS.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.navy,
    minWidth: 24,
    textAlign: 'center',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
    width: '100%',
  },
  emptyCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.navy,
  },
  emptyMsg: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
    maxWidth: 280,
  },
});
