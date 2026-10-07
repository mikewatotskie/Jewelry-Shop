import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '@/store/data';
import { peso } from '@/store/format';
import { useShop } from '@/store/shop';
import { COLORS, FONTS, RADIUS, SHADOW } from '@/store/theme';
import { JewelryImage } from './JewelryImage';

function stopBubble(e: unknown) {
  (e as { stopPropagation?: () => void } | null | undefined)?.stopPropagation?.();
}

function HeartButton({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remove from favorites' : 'Add to favorites'}
      onPress={(e) => {
        stopBubble(e);
        onToggle();
      }}
      hitSlop={8}
      style={({ pressed }) => [styles.heart, { opacity: pressed ? 0.6 : 1, transform: [{ scale: pressed ? 0.9 : 1 }] }]}>
      <MaterialCommunityIcons name={active ? 'heart' : 'heart-outline'} size={16} color={COLORS.navy} />
    </Pressable>
  );
}

export function ProductCard({
  product,
  width,
  variant = 'deal',
  onPress,
}: {
  product: Product;
  width: number;
  variant?: 'deal' | 'trend';
  onPress: () => void;
}) {
  const { isFavorite, toggleFavorite, addToCart } = useShop();
  const fav = isFavorite(product.id);
  const soldOut = !product.available || product.stock <= 0;
  const tileH = variant === 'deal' ? 128 : 88;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, { width, opacity: pressed ? 0.85 : 1 }]}>
      <View style={[styles.tile, { height: tileH }]}>
        <JewelryImage uri={product.image} imageStyle={{ width: '88%', height: '88%' }} tileStyle={{ width: '100%', height: '100%', borderRadius: RADIUS.lg }} iconSize={32} />
        {variant === 'deal' ? (
          <HeartButton active={fav} onToggle={() => toggleFavorite(product.id)} />
        ) : null}
        {soldOut ? (
          <View style={styles.soldOut}>
            <Text style={styles.soldOutText}>Out of Stock</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {product.name}
      </Text>
      <View style={styles.row}>
        <Text style={styles.price}>{peso(product.price)}</Text>
        {variant === 'trend' ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Add ${product.name} to cart`}
            disabled={soldOut}
            onPress={(e) => {
              stopBubble(e);
              if (soldOut) return;
              addToCart(product.id, product.sizes[0] ?? 'One Size', 1);
            }}
            style={({ pressed }) => [styles.plus, { opacity: pressed || soldOut ? 0.5 : 1 }]}>
            <Ionicons name="add" size={16} color={COLORS.navy} />
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 8,
    gap: 8,
    ...SHADOW,
  },
  tile: {
    backgroundColor: COLORS.light,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOut: {
    position: 'absolute',
    bottom: 6,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  soldOutText: {
    fontFamily: FONTS.semibold,
    fontSize: 11,
    color: COLORS.navy,
  },
  name: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.navy,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    height: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  price: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.navy,
  },
  plus: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: COLORS.aqua,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
