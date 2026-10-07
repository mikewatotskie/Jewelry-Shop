import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProductCard } from '@/components/ProductCard';
import { Screen, useCardWidth } from '@/components/Screen';
import { CartButton, EmptyState } from '@/components/Ui';
import { useShop } from '@/store/shop';
import { COLORS, FONTS } from '@/store/theme';

export default function Favorites() {
  const { products, favorites } = useShop();
  const cardWidth = useCardWidth();
  const items = useMemo(() => products.filter((p) => favorites.includes(p.id)), [products, favorites]);

  return (
    <Screen>
      <View style={{ paddingTop: 8, paddingBottom: 16, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.title}>Favorites</Text>
          <CartButton />
        </View>
        {items.length === 0 ? (
          <EmptyState
            icon="heart-outline"
            title="No favorites yet"
            message="Tap the heart on any jewelry to save it here."
            actionLabel="Browse Jewelry"
            onAction={() => router.push('/trending' as never)}
          />
        ) : (
          <View style={styles.grid}>
            {items.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                width={cardWidth}
                variant="deal"
                onPress={() => router.push({ pathname: '/product/[id]', params: { id: p.id } } as never)}
              />
            ))}
          </View>
        )}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    width: '100%',
  },
});
