import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FilterModal } from '@/components/FilterModal';
import { JewelryImage } from '@/components/JewelryImage';
import { ProductCard } from '@/components/ProductCard';
import { Screen, useCardWidth } from '@/components/Screen';
import { SearchBar } from '@/components/SearchBar';
import { SectionHeader } from '@/components/Ui';
import { BANNER_IMAGE, CATEGORIES, Category } from '@/store/data';
import { DEFAULT_FILTERS, FilterState, applyFilters } from '@/store/filter';
import { useShop } from '@/store/shop';
import { COLORS, FONTS, RADIUS } from '@/store/theme';

export default function Home() {
  const { products } = useShop();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [filterVisible, setFilterVisible] = useState(false);
  const cardWidth = useCardWidth();

  const deals = useMemo(() => {
    const merged: FilterState = {
      ...filters,
      category: selectedCategory !== 'All' ? selectedCategory : filters.category,
    };
    return applyFilters(products, query, merged).slice(0, 8);
  }, [products, query, selectedCategory, filters]);

  const submitSearch = () => {
    if (!query.trim()) return;
    router.push({ pathname: '/search', params: { q: query.trim() } } as never);
  };

  const pickCategory = (c: Category) => {
    setSelectedCategory((prev) => (prev === c ? 'All' : c));
  };

  return (
    <Screen>
      <View style={{ paddingTop: 8, gap: 16, paddingBottom: 16 }}>
        <View style={styles.welcome}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.title}>Your Style, Yours</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={() => router.push('/orders' as never)}
            style={({ pressed }) => [styles.bell, { opacity: pressed ? 0.6 : 1 }]}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.navy} />
          </Pressable>
        </View>

        <SearchBar value={query} onChange={setQuery} onSubmit={submitSearch} onFilter={() => setFilterVisible(true)} />

        <View style={styles.banner}>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Diamond Jewelry</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/trending' as never)}
              style={({ pressed }) => [styles.shopNow, { opacity: pressed ? 0.6 : 1 }]}>
              <Text style={styles.shopNowText}>Shop Now</Text>
            </Pressable>
          </View>
          <View style={styles.bannerImgWrap}>
            <JewelryImage uri={BANNER_IMAGE} imageStyle={styles.bannerImg} tileStyle={styles.bannerImg} iconSize={48} />
          </View>
        </View>

        <View style={{ gap: 12, paddingTop: 8 }}>
          <SectionHeader title="Categories" onAction={() => router.push('/trending' as never)} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRowContent}>
            {CATEGORIES.map((c) => {
              const active = selectedCategory === c.name;
              return (
                <Pressable
                  key={c.name}
                  accessibilityRole="button"
                  onPress={() => pickCategory(c.name)}
                  style={({ pressed }) => [styles.cat, { opacity: pressed ? 0.6 : 1 }]}>
                  <View style={[styles.circle, active && styles.circleActive]}>
                    <MaterialCommunityIcons name={c.icon as never} size={32} color={COLORS.navy} />
                  </View>
                  <Text style={[styles.catLabel, active && styles.catLabelActive]}>{c.name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={{ gap: 12 }}>
          <SectionHeader title="Best Deals" onAction={() => router.push('/trending' as never)} />
          {deals.length === 0 ? (
            <Text style={styles.noResult}>No jewelry found</Text>
          ) : (
            <View style={styles.grid}>
              {deals.map((p) => (
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
      </View>

      <FilterModal
        visible={filterVisible}
        initial={filters}
        onClose={() => setFilterVisible(false)}
        onApply={(f) => {
          setFilters(f);
          setFilterVisible(false);
          if (f.category !== 'All') setSelectedCategory(f.category);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  welcome: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  greeting: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.muted,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    lineHeight: 26,
    color: COLORS.navy,
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    backgroundColor: COLORS.light,
    borderRadius: RADIUS.xl,
    height: 160,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  bannerText: {
    width: 174,
    gap: 16,
  },
  bannerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    lineHeight: 26,
    color: COLORS.navy,
  },
  shopNow: {
    backgroundColor: COLORS.aqua,
    height: 40,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  shopNowText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.navy,
  },
  bannerImgWrap: {
    flex: 1,
    height: 144,
    marginLeft: 8,
  },
  bannerImg: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  catRowContent: {
    gap: 8,
    flexGrow: 1,
    justifyContent: 'space-between',
    width: '100%',
  },
  cat: {
    width: 64,
    alignItems: 'center',
    gap: 8,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    backgroundColor: COLORS.aqua,
    borderWidth: 2,
    borderColor: COLORS.navy,
  },
  catLabel: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.navy,
  },
  catLabelActive: {
    fontFamily: FONTS.bold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    width: '100%',
  },
  noResult: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
    paddingVertical: 24,
  },
});
