import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FilterModal } from '@/components/FilterModal';
import { ProductCard } from '@/components/ProductCard';
import { Screen, useCardWidth } from '@/components/Screen';
import { SearchBar } from '@/components/SearchBar';
import { CartButton, Chip, EmptyState } from '@/components/Ui';
import { CATEGORIES, Category } from '@/store/data';
import { DEFAULT_FILTERS, FilterState, applyFilters } from '@/store/filter';
import { useShop } from '@/store/shop';
import { COLORS, FONTS } from '@/store/theme';
import { useProductSearch } from '@/services/useProductSearch';

export default function Search() {
  const { products, recentSearches, addRecentSearch, clearRecentSearches } = useShop();
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState('');
  const [chipCategory, setChipCategory] = useState<Category | 'All'>('All');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [filterVisible, setFilterVisible] = useState(false);
  const cardWidth = useCardWidth();
  const sqlProducts = useProductSearch(query, products);

  useEffect(() => {
    if (typeof params.q === 'string' && params.q) {
      setQuery(params.q);
      addRecentSearch(params.q);
    }
  }, [params.q]); // eslint-disable-line react-hooks/exhaustive-deps

  const results = useMemo(() => {
    const merged: FilterState = {
      ...filters,
      category: chipCategory !== 'All' ? chipCategory : filters.category,
    };
    return applyFilters(sqlProducts, '', merged);
  }, [sqlProducts, chipCategory, filters]);

  const submit = () => {
    if (query.trim()) addRecentSearch(query.trim());
  };

  return (
    <Screen>
      <View style={{ paddingTop: 8, paddingBottom: 16, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.title}>Search</Text>
          <CartButton />
        </View>
        <SearchBar value={query} onChange={setQuery} onSubmit={submit} onFilter={() => setFilterVisible(true)} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {(['All', ...CATEGORIES.map((c) => c.name)] as (Category | 'All')[]).map((c) => (
            <Chip key={c} label={c} active={chipCategory === c} onPress={() => setChipCategory(c)} wide />
          ))}
        </ScrollView>

        {query.trim() === '' && recentSearches.length > 0 ? (
          <View style={{ gap: 8 }}>
            <View style={styles.recentHead}>
              <Text style={styles.recentTitle}>Recent Searches</Text>
              <Pressable accessibilityRole="button" onPress={clearRecentSearches} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                <Text style={styles.clear}>Clear</Text>
              </Pressable>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {recentSearches.map((r) => (
                <Chip key={r} label={r} active={false} onPress={() => setQuery(r)} />
              ))}
            </View>
          </View>
        ) : null}

        {results.length === 0 ? (
          <EmptyState icon="magnify" title="No jewelry found" message="Try a different name, category, or material." />
        ) : (
          <View style={styles.grid}>
            {results.map((p) => (
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

      <FilterModal
        visible={filterVisible}
        initial={filters}
        onClose={() => setFilterVisible(false)}
        onApply={(f) => {
          setFilters(f);
          setFilterVisible(false);
          if (f.category !== 'All') setChipCategory(f.category);
        }}
      />
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
  recentHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentTitle: {
    fontFamily: FONTS.semibold,
    fontSize: 16,
    color: COLORS.navy,
  },
  clear: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.muted,
  },
});
