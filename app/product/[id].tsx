import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { JewelryImage } from '@/components/JewelryImage';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/SearchBar';
import { AquaButton, EmptyState, OutlineButton, Rating, goBack } from '@/components/Ui';
import { peso } from '@/store/format';
import { useShop } from '@/store/shop';
import { COLORS, FONTS, RADIUS } from '@/store/theme';

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getProduct, isFavorite, toggleFavorite, addToCart, purchasable } = useShop();
  const { width } = useWindowDimensions();
  const wide = width >= 768;
  const product = typeof id === 'string' ? getProduct(id) : undefined;
  const [size, setSize] = useState<string | null>(null);

  useEffect(() => {
    setSize(null);
  }, [id]);

  if (!product) {
    return (
      <Screen>
        <View style={{ paddingTop: 8 }}>
          <PageHeader title="Product Details" onBack={() => goBack('/(tabs)')} />
          <EmptyState
            icon="diamond"
            title="Jewelry not found"
            message="This item may have been removed."
            actionLabel="Back to Home"
            onAction={() => router.replace('/(tabs)' as never)}
          />
        </View>
      </Screen>
    );
  }

  const fav = isFavorite(product.id);
  const canBuy = purchasable(product);
  const activeSize = size ?? product.sizes[0] ?? 'One Size';

  const doAdd = () => {
    if (!canBuy) {
      Alert.alert('Out of stock', 'This jewelry item is currently unavailable.');
      return;
    }
    addToCart(product.id, activeSize, 1);
    Alert.alert('Added to cart', `${product.name} (${activeSize}) was added to your cart.`, [
      { text: 'Continue', style: 'cancel' },
      { text: 'View Cart', onPress: () => router.push('/cart' as never) },
    ]);
  };

  const doBuy = () => {
    if (!canBuy) {
      Alert.alert('Out of stock', 'This jewelry item is currently unavailable.');
      return;
    }
    addToCart(product.id, activeSize, 1);
    router.push('/checkout' as never);
  };

  const gallery = (
    <View style={{ gap: 0, width: '100%' }}>
      <View style={[styles.imageCard, wide && { maxWidth: 500, width: '100%', height: 400 }]}>
        <JewelryImage
          uri={product.image}
          imageStyle={{ width: '84%', height: '84%' }}
          tileStyle={{ width: '100%', height: '100%', borderRadius: RADIUS.lg }}
          iconSize={64}
        />
      </View>
      <View style={styles.dots}>
        {[0, 1, 2, 3, 4].map((d) => (
          <View key={d} style={[styles.dot, d === 0 ? styles.dotActive : styles.dotIdle]} />
        ))}
      </View>
    </View>
  );

  const info = (
    <View style={{ gap: 16, flex: 1, width: '100%' }}>
      <View style={{ gap: 8 }}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{product.name}</Text>
          <Rating value={product.rating} />
        </View>
        <Text style={styles.price}>{peso(product.price)}</Text>
        <Text style={styles.meta}>
          {product.material} · {product.category}
          {!canBuy ? ' · Out of Stock' : ''}
        </Text>
      </View>
      <View style={{ gap: 8 }}>
        <Text style={styles.sizeLabel}>Size</Text>
        <View style={styles.sizes}>
          {product.sizes.map((s) => {
            const active = activeSize === s;
            return (
              <Pressable
                key={s}
                accessibilityRole="button"
                onPress={() => setSize(s)}
                style={({ pressed }) => [styles.sizeChip, active && styles.sizeActive, { opacity: pressed ? 0.6 : 1 }]}>
                <Text style={[styles.sizeText, active && styles.sizeTextActive]}>{s}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={{ gap: 8 }}>
        <Text style={styles.sizeLabel}>Description</Text>
        <Text style={styles.desc}>{product.description}</Text>
      </View>
    </View>
  );

  return (
    <Screen>
      <View style={{ paddingTop: 8, paddingBottom: 16, gap: 16 }}>
        <PageHeader
          title="Product Details"
          onBack={() => goBack('/(tabs)')}
          right={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={fav ? 'Remove from favorites' : 'Add to favorites'}
              onPress={() => toggleFavorite(product.id)}
              style={({ pressed }) => ({
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: fav ? COLORS.aqua : COLORS.light,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.6 : 1,
              })}>
              <MaterialCommunityIcons name={fav ? 'heart' : 'heart-outline'} size={22} color={COLORS.navy} />
            </Pressable>
          }
        />
        {wide ? (
          <View style={{ flexDirection: 'row', gap: 24, alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>{gallery}</View>
            <View style={{ flex: 1 }}>{info}</View>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            {gallery}
            {info}
          </View>
        )}
        <View style={styles.actions}>
          <View style={{ flex: 1 }}>
            <OutlineButton label={canBuy ? 'Add to Cart' : 'Out of Stock'} onPress={doAdd} />
          </View>
          <View style={{ flex: 1 }}>
            <AquaButton label="Buy Now" onPress={doBuy} disabled={!canBuy} />
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  imageCard: {
    backgroundColor: COLORS.light,
    borderRadius: RADIUS.lg,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    height: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: COLORS.aqua,
  },
  dotIdle: {
    backgroundColor: COLORS.light,
  },
  nameRow: {
    flexDirection: 'row',
    height: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    lineHeight: 24,
    color: COLORS.navy,
    flex: 1,
  },
  price: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    lineHeight: 24,
    color: COLORS.navy,
  },
  meta: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.muted,
  },
  sizeLabel: {
    fontFamily: FONTS.semibold,
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.navy,
  },
  sizes: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  sizeChip: {
    backgroundColor: COLORS.light,
    height: 36,
    minWidth: 72,
    paddingHorizontal: 16,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeActive: {
    backgroundColor: COLORS.aqua,
  },
  sizeText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.navy,
  },
  sizeTextActive: {
    fontFamily: FONTS.bold,
  },
  desc: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.muted,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 8,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
});
