import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { FilterModal } from '@/components/FilterModal';
import { ProductCard } from '@/components/ProductCard';
import { Screen, useCardWidth } from '@/components/Screen';
import { PageHeader, SearchBar } from '@/components/SearchBar';
import { CartButton, Chip, EmptyState, goBack } from '@/components/Ui';
import { CATEGORIES, Category } from '@/store/data';
import { DEFAULT_FILTERS, FilterState, applyFilters } from '@/store/filter';
import { useShop } from '@/store/shop';
import { COLORS, FONTS } from '@/store/theme';

export default function Trending() {
  const { products } = useShop();
  const params = useLocalSearchParams<{ category?: string }>();
  const [query, setQuery] = useState('');
  const [chip, setChip] = useState<Category | 'All'>('All');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [filterVisible, setFilterVisible] = useState(false);
  const cardWidth = useCardWidth();

  useEffect(() => {
    const c = params.category;
    if (typeof c === 'string' && (CATEGORIES.some((x) => x.name === c) || c === 'All')) {
      setChip(c as Category | 'All');
    }
  }, [params.category]);

  const results = useMemo(() => {
    const merged: FilterState = { ...filters, category: chip !== 'All' ? chip : filters.category };
    return applyFilters(products, query, merged);
  }, [products, query, chip, filters]);

  return (
    <Screen>
      <View style={{ paddingTop: 8, paddingBottom: 16, gap: 16 }}>
        <PageHeader title="Trending Now" onBack={() => goBack('/(tabs)')} right={<CartButton />} />
        <SearchBar value={query} onChange={setQuery} onFilter={() => setFilterVisible(true)} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {(['All', ...CATEGORIES.map((c) => c.name)] as (Category | 'All')[]).map((c) => (
            <Chip key={c} label={c} active={chip === c} onPress={() => setChip(c)} wide />
          ))}
        </ScrollView>
        {results.length === 0 ? (
          <EmptyState icon="magnify" title="No jewelry found" message="Try a different search or filter." />
        ) : (
          <View style={styles.grid}>
            {results.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                width={cardWidth}
                variant="trend"
                onPress={() => router.push({ pathname: '/product/[id]', params: { id: p.id } } as never)}
              />
            ))}
          </View>
        )}
        <Text style={styles.hint}>Tap + to add to cart. Tap a card for details.</Text>
      </View>

      <FilterModal
        visible={filterVisible}
        initial={filters}
        onClose={() => setFilterVisible(false)}
        onApply={(f) => {
          setFilters(f);
          setFilterVisible(false);
          if (f.category !== 'All') setChip(f.category);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    width: '100%',
  },
  hint: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
  },
});
