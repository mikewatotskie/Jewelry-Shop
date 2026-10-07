import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { useShop } from '@/store/shop';
import { COLORS, FONTS, RADIUS } from '@/store/theme';

function MenuRow({
  icon,
  label,
  badge,
  onPress,
}: {
  icon: string;
  label: string;
  badge?: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIcon}>
          <Ionicons name={icon as never} size={20} color={COLORS.navy} />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {badge !== undefined && badge > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
        <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
      </View>
    </Pressable>
  );
}

export default function Profile() {
  const { settings, cartCount, favorites, orders } = useShop();

  return (
    <Screen>
      <View style={{ paddingTop: 8, paddingBottom: 16, gap: 16, width: '100%', maxWidth: 720, alignSelf: 'center' }}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={COLORS.navy} />
          </View>
          <View>
            <Text style={styles.name}>{settings.displayName || 'Guest'}</Text>
            <Text style={styles.sub}>Welcome to Jewelry Shop</Text>
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <MenuRow icon="cart-outline" label="My Cart" badge={cartCount} onPress={() => router.push('/cart' as never)} />
          <MenuRow icon="receipt-outline" label="My Orders" badge={orders.length} onPress={() => router.push('/orders' as never)} />
          <MenuRow icon="heart-outline" label="My Favorites" badge={favorites.length} onPress={() => router.push('/(tabs)/favorites' as never)} />
        </View>

        <Text style={styles.group}>Store</Text>
        <View style={{ gap: 8 }}>
          <MenuRow icon="diamond-outline" label="Product Management" onPress={() => router.push('/products-manage' as never)} />
          <MenuRow icon="cube-outline" label="Inventory" onPress={() => router.push('/inventory' as never)} />
          <MenuRow icon="bar-chart-outline" label="Reports" onPress={() => router.push('/reports' as never)} />
          <MenuRow icon="settings-outline" label="Settings" onPress={() => router.push('/settings' as never)} />
        </View>

        <MenuRow
          icon="log-out-outline"
          label="Logout"
          onPress={() => Alert.alert('Logout', 'This is a demo placeholder. Nothing to log out from.')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.navy,
  },
  card: {
    backgroundColor: COLORS.light,
    borderRadius: RADIUS.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.aqua,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.navy,
  },
  sub: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.muted,
  },
  group: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.navy,
  },
  row: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: RADIUS.lg,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.navy,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.aqua,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.navy,
  },
});
