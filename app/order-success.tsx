import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { AquaButton, EmptyState, OutlineButton } from '@/components/Ui';
import { peso } from '@/store/format';
import { useShop } from '@/store/shop';
import { COLORS, FONTS, RADIUS } from '@/store/theme';

export default function OrderSuccess() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { orders } = useShop();
  const order = typeof id === 'string' ? orders.find((o) => o.id === id) : undefined;

  if (!order) {
    return (
      <Screen>
        <View style={{ paddingTop: 8 }}>
          <EmptyState
            icon="package-variant"
            title="Order not found"
            message="It may have been cleared."
            actionLabel="Continue Shopping"
            onAction={() => router.replace('/(tabs)' as never)}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ paddingTop: 32, paddingBottom: 16, gap: 12, alignItems: 'center' }}>
        <View style={styles.circle}>
          <MaterialCommunityIcons name="check" size={48} color={COLORS.navy} />
        </View>
        <Text style={styles.title}>Order Successful</Text>
        <Text style={styles.sub}>Thank you for shopping with us.</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Order Number</Text>
            <Text style={styles.value}>{order.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{new Date(order.date).toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment</Text>
            <Text style={styles.value}>{order.payment}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Items</Text>
            <Text style={styles.value}>{order.items.reduce((n, i) => n + i.qty, 0)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Final Total</Text>
            <Text style={styles.total}>{peso(order.total)}</Text>
          </View>
        </View>
        <View style={{ width: '100%', maxWidth: 520, alignSelf: 'center', gap: 12, marginTop: 8 }}>
          <AquaButton label="Continue Shopping" onPress={() => router.replace('/(tabs)' as never)} />
          <OutlineButton label="View Orders" onPress={() => router.replace('/orders' as never)} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.aqua,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.navy,
  },
  sub: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.muted,
  },
  card: {
    backgroundColor: COLORS.light,
    borderRadius: RADIUS.lg,
    padding: 16,
    gap: 10,
    width: '100%',
    maxWidth: 520,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.navy,
  },
  value: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.navy,
    textAlign: 'right',
    flex: 1,
  },
  totalLabel: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.navy,
  },
  total: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.navy,
  },
});
