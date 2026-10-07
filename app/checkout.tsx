import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { JewelryImage } from '@/components/JewelryImage';
import { CTA, Screen } from '@/components/Screen';
import { PageHeader } from '@/components/SearchBar';
import { AquaButton, Chip, EmptyState, goBack } from '@/components/Ui';
import { DEMO_COUPON, DEMO_COUPON_PCT, PaymentMethod } from '@/store/data';
import { peso } from '@/store/format';
import { useShop } from '@/store/shop';
import { COLORS, FONTS, RADIUS } from '@/store/theme';

const PAYMENTS: PaymentMethod[] = ['Cash on Delivery', 'GCash', 'Card'];

export default function Checkout() {
  const { cart, getProduct, purchasable, settings, placeOrder } = useShop();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>('Cash on Delivery');
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState(false);
  const [couponMsg, setCouponMsg] = useState('');

  const detailed = cart
    .map((c) => ({ line: c, product: getProduct(c.productId) }))
    .filter((x) => x.product !== undefined);
  const valid = detailed.filter(({ product }) => purchasable(product!));
  const invalid = detailed.filter(({ product }) => !purchasable(product!));
  const sub = valid.reduce((s, { line, product }) => s + product!.price * line.qty, 0);
  const fee = valid.length ? settings.deliveryFee : 0;
  const couponDiscount = applied ? Math.round(sub * DEMO_COUPON_PCT) : 0;
  const autoDiscount = !applied ? Math.round((sub * Math.min(Math.max(settings.defaultDiscount, 0), 90)) / 100) : 0;
  const discount = couponDiscount + autoDiscount;
  const total = Math.max(0, sub + fee - discount);

  if (valid.length === 0) {
    return (
      <Screen>
        <View style={{ paddingTop: 8 }}>
          <PageHeader title="Checkout" onBack={() => goBack('/cart')} />
          <EmptyState
            icon="cart-outline"
            title="Nothing to check out"
            message="Your cart is empty."
            actionLabel="Back to Cart"
            onAction={() => router.replace('/cart' as never)}
          />
        </View>
      </Screen>
    );
  }

  const applyCoupon = () => {
    if (applied) {
      setCouponMsg('Coupon already applied.');
      return;
    }
    if (coupon.trim().toUpperCase() === DEMO_COUPON) {
      setApplied(true);
      setCouponMsg('DISCOUNT20 applied: 20% off subtotal.');
    } else {
      setCouponMsg('Invalid coupon code. Try DISCOUNT20.');
    }
  };

  const submit = () => {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter your name.');
      return;
    }
    if (!contact.trim()) {
      Alert.alert('Missing contact', 'Please enter your contact number.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Missing address', 'Please enter your delivery address.');
      return;
    }
    const order = placeOrder({
      customer: { name: name.trim(), contact: contact.trim(), address: address.trim() },
      payment,
      deliveryFee: fee,
      discount,
    });
    if (!order) {
      Alert.alert('Checkout failed', 'Some items are no longer available.');
      return;
    }
    router.replace({ pathname: '/order-success', params: { id: order.id } } as never);
  };

  return (
    <Screen>
      <View style={{ paddingTop: 8, paddingBottom: 16, gap: 16, width: '100%', maxWidth: 720, alignSelf: 'center' }}>
        <PageHeader title="Checkout" onBack={() => goBack('/cart')} />

        <View style={{ gap: 8 }}>
          <Text style={styles.h}>Customer</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Name" placeholderTextColor={COLORS.muted} style={styles.input} />
          <TextInput value={contact} onChangeText={setContact} placeholder="Contact Number" placeholderTextColor={COLORS.muted} keyboardType="phone-pad" style={styles.input} />
          <TextInput value={address} onChangeText={setAddress} placeholder="Address" placeholderTextColor={COLORS.muted} multiline style={[styles.input, { minHeight: 64, textAlignVertical: 'top' }]} />
        </View>

        <View style={{ gap: 8 }}>
          <Text style={styles.h}>Order ({valid.length})</Text>
          {valid.map(({ line, product }) => (
            <View key={`${line.productId}-${line.size}`} style={styles.line}>
              <View style={styles.thumb}>
                <JewelryImage uri={product!.image} imageStyle={{ width: 44, height: 44 }} tileStyle={{ width: 52, height: 52, borderRadius: RADIUS.md }} iconSize={22} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.lineName} numberOfLines={1}>{product!.name}</Text>
                <Text style={styles.lineSub}>Size {line.size} · Qty {line.qty}</Text>
              </View>
              <Text style={styles.linePrice}>{peso(product!.price * line.qty)}</Text>
            </View>
          ))}
          {invalid.map(({ line, product }) => (
            <View key={`out-${line.productId}-${line.size}`} style={[styles.line, styles.lineOut]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.lineName} numberOfLines={1}>{product!.name}</Text>
                <Text style={styles.lineOutText}>Out of Stock — removed from this order</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ gap: 8 }}>
          <Text style={styles.h}>Payment</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {PAYMENTS.map((p) => (
              <Chip key={p} label={p} active={payment === p} onPress={() => setPayment(p)} />
            ))}
          </View>
          <Text style={styles.note}>Demo only — no real payment is processed.</Text>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={styles.h}>Coupon</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput
              value={coupon}
              onChangeText={(t) => {
                setCoupon(t);
                setCouponMsg('');
              }}
              placeholder="Enter coupon code"
              placeholderTextColor={COLORS.muted}
              autoCapitalize="characters"
              autoCorrect={false}
              style={[styles.input, { flex: 1 }]}
            />
            <Pressable
              accessibilityRole="button"
              onPress={applyCoupon}
              style={({ pressed }) => [styles.apply, { opacity: pressed ? 0.6 : 1 }]}>
              <Text style={styles.applyText}>Apply</Text>
            </Pressable>
          </View>
          {couponMsg ? <Text style={[styles.note, applied && styles.ok]}>{couponMsg}</Text> : null}
          {!applied && autoDiscount > 0 ? (
            <Text style={[styles.note, styles.ok]}>Store discount ({settings.defaultDiscount}%) applied.</Text>
          ) : null}
        </View>

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
            <Text style={styles.tLabel}>Discount</Text>
            <Text style={styles.tValue}>-{peso(discount)}</Text>
          </View>
          <View style={styles.tRow}>
            <Text style={styles.tTotal}>Total</Text>
            <Text style={styles.tTotal}>{peso(total)}</Text>
          </View>
        </View>

        <View style={CTA}>
          <AquaButton label={`Place Order · ${peso(total)}`} onPress={submit} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  h: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.navy,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: RADIUS.md,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.navy,
    backgroundColor: COLORS.white,
  },
  line: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: RADIUS.md,
    padding: 8,
  },
  thumb: {
    backgroundColor: COLORS.light,
    borderRadius: RADIUS.md,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  lineName: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.navy,
  },
  lineSub: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.muted,
  },
  linePrice: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.navy,
  },
  lineOut: {
    opacity: 0.75,
  },
  lineOutText: {
    fontFamily: FONTS.semibold,
    fontSize: 13,
    color: COLORS.danger,
  },
  note: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.muted,
  },
  ok: {
    color: COLORS.success,
    fontFamily: FONTS.semibold,
  },
  apply: {
    backgroundColor: COLORS.aqua,
    borderRadius: RADIUS.md,
    paddingHorizontal: 20,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.navy,
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
