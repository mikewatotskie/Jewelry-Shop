import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { JewelryImage } from '@/components/JewelryImage';
import { CTA, Narrow, Screen } from '@/components/Screen';
import { PageHeader } from '@/components/SearchBar';
import { AquaButton, EmptyState, OutlineButton, QtyStepper, goBack } from '@/components/Ui';
import { peso } from '@/store/format';
import { useShop } from '@/store/shop';
import { COLORS, FONTS, RADIUS } from '@/store/theme';

export default function Cart() {
  const { cart, getProduct, purchasable, updateQty, removeFromCart, clearCart, settings } = useShop();
  const detailed = cart
    .map((c) => ({ line: c, product: getProduct(c.productId) }))
    .filter((x) => x.product !== undefined);
  const valid = detailed.filter(({ product }) => purchasable(product!));
  const invalid = detailed.filter(({ product }) => !purchasable(product!));
  const sub = valid.reduce((s, { line, product }) => s + product!.price * line.qty, 0);
  const fee = valid.length ? settings.deliveryFee : 0;
  const total = sub + fee;

  return (
    <Screen>
      <View style={{ paddingTop: 8, paddingBottom: 16, gap: 16 }}>
        <PageHeader title="My Cart" onBack={() => goBack('/(tabs)')} />
        {detailed.length === 0 ? (
          <EmptyState
            icon="cart-outline"
            title="Your cart is empty"
            message="Add some beautiful jewelry to get started."
            actionLabel="Browse Jewelry"
            onAction={() => router.push('/trending' as never)}
          />
        ) : (
          <>
            <Narrow>
              {detailed.map(({ line, product }) => {
                const ok = purchasable(product!);
                return (
                <View key={`${line.productId}-${line.size}`} style={[styles.item, !ok && styles.itemDisabled]}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push({ pathname: '/product/[id]', params: { id: product!.id } } as never)}
                    style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
                    <View style={styles.thumb}>
                      <JewelryImage uri={product!.image} imageStyle={{ width: 60, height: 60 }} tileStyle={{ width: 72, height: 72, borderRadius: RADIUS.md }} iconSize={28} />
                    </View>
                  </Pressable>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.name} numberOfLines={1}>{product!.name}</Text>
                    <Text style={styles.size}>Size: {line.size}</Text>
                    <Text style={styles.price}>{peso(product!.price)}</Text>
                    {!ok ? <Text style={styles.unavail}>Out of Stock — unavailable at checkout</Text> : null}
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 8 }}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${product!.name}`}
                      onPress={() =>
                        Alert.alert('Remove item', `Remove ${product!.name} from cart?`, [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(line.productId, line.size) },
                        ])
                      }
                      hitSlop={8}
                      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                      <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
                    </Pressable>
                    {ok ? (
                    <QtyStepper
                      small
                      qty={line.qty}
                      onMinus={() => updateQty(line.productId, line.size, -1)}
                      onPlus={() => updateQty(line.productId, line.size, 1)}
                    />
                    ) : null}
                  </View>
                </View>
                );
              })}
            </Narrow>

            <Narrow>
            <View style={styles.totals}>
              <View style={styles.tRow}>
                <Text style={styles.tLabel}>Subtotal</Text>
                <Text style={styles.tValue}>{peso(sub)}</Text>
              </View>
              <View style={styles.tRow}>
                <Text style={styles.tLabel}>Delivery Fee</Text>
                <Text style={styles.tValue}>{peso(fee)}</Text>
              </View>
              <View style={styles.tRow}>
                <Text style={styles.tTotal}>Total</Text>
                <Text style={styles.tTotal}>{peso(total)}</Text>
              </View>
            </View>
            </Narrow>

            {valid.length > 0 ? (
            <View style={CTA}>
            <AquaButton label="Proceed to Checkout" onPress={() => router.push('/checkout' as never)} />
            </View>
            ) : (
              <Text style={styles.unavailCenter}>All items in your cart are currently out of stock.</Text>
            )}
            <View style={{ alignSelf: 'flex-start' }}>
              <OutlineButton
                label="Clear Cart"
                onPress={() =>
                  Alert.alert('Clear cart?', 'Remove all items from your cart?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Clear', style: 'destructive', onPress: clearCart },
                  ])
                }
              />
            </View>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: RADIUS.lg,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  itemDisabled: {
    opacity: 0.75,
  },
  thumb: {
    backgroundColor: COLORS.light,
    borderRadius: RADIUS.md,
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  name: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.navy,
  },
  size: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.muted,
  },
  price: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.navy,
  },
  unavail: {
    fontFamily: FONTS.semibold,
    fontSize: 12,
    color: COLORS.danger,
  },
  unavailCenter: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.danger,
    textAlign: 'center',
  },
  totals: {
    backgroundColor: COLORS.light,
    borderRadius: RADIUS.lg,
    padding: 16,
    gap: 8,
  },
  tRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tLabel: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.navy,
  },
  tValue: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.navy,
  },
  tTotal: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.navy,
  },
});
