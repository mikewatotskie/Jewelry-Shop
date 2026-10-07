import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/SearchBar';
import { EmptyState, goBack } from '@/components/Ui';
import { ORDER_STATUSES, OrderStatus } from '@/store/data';
import { peso } from '@/store/format';
import { useShop } from '@/store/shop';
import { COLORS, FONTS, RADIUS } from '@/store/theme';

function statusColor(s: OrderStatus) {
  switch (s) {
    case 'Delivered':
      return COLORS.success;
    case 'Cancelled':
      return COLORS.danger;
    default:
      return COLORS.navy;
  }
}

export default function Orders() {
  const { orders, updateOrderStatus } = useShop();

  return (
    <Screen>
      <View style={{ paddingTop: 8, paddingBottom: 16, gap: 16 }}>
        <PageHeader title="Orders" onBack={() => goBack('/(tabs)')} />
        {orders.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title="No orders yet"
            message="Your completed orders will appear here."
            actionLabel="Start Shopping"
            onAction={() => router.push('/trending' as never)}
          />
        ) : (
          <View style={{ gap: 12, width: '100%', maxWidth: 720, alignSelf: 'center' }}>
            {orders.map((o) => (
              <View key={o.id} style={styles.card}>
                <View style={styles.head}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.id}>{o.id}</Text>
                    <Text style={styles.date}>
                      {new Date(o.date).toLocaleString()} · {o.items.reduce((n, i) => n + i.qty, 0)} items
                    </Text>
                  </View>
                  <View style={[styles.status, { borderColor: statusColor(o.status) }]}>
                    <Text style={[styles.statusText, { color: statusColor(o.status) }]}>{o.status}</Text>
                  </View>
                </View>
                <Text style={styles.items} numberOfLines={2}>
                  {o.items.map((i) => `${i.name} x${i.qty}`).join(' · ')}
                </Text>
                <View style={styles.head}>
                  <Text style={styles.total}>{peso(o.total)}</Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push({ pathname: '/order-success', params: { id: o.id } } as never)}
                    style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                    <Text style={styles.view}>View</Text>
                  </Pressable>
                </View>
                <View style={styles.statusRow}>
                  {ORDER_STATUSES.map((s) => (
                    <Pressable
                      key={s}
                      accessibilityRole="button"
                      accessibilityLabel={`Set status ${s}`}
                      onPress={() => updateOrderStatus(o.id, s)}
                      style={({ pressed }) => [
                        styles.sChip,
                        o.status === s && styles.sChipActive,
                        { opacity: pressed ? 0.6 : 1 },
                      ]}>
                      <Text style={[styles.sText, o.status === s && styles.sTextActive]}>{s}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: RADIUS.lg,
    padding: 14,
    gap: 8,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  id: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.navy,
  },
  date: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.muted,
  },
  status: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
  },
  items: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.muted,
  },
  total: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.navy,
  },
  view: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.navy,
    textDecorationLine: 'underline',
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sChip: {
    backgroundColor: COLORS.light,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sChipActive: {
    backgroundColor: COLORS.aqua,
  },
  sText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.navy,
  },
  sTextActive: {
    fontFamily: FONTS.bold,
  },
});
