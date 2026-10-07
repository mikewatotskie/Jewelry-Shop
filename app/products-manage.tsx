import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { JewelryImage } from '@/components/JewelryImage';
import { CTA, Screen } from '@/components/Screen';
import { PageHeader } from '@/components/SearchBar';
import { AquaButton, EmptyState, goBack } from '@/components/Ui';
import { peso } from '@/store/format';
import { useShop } from '@/store/shop';
import { COLORS, FONTS, RADIUS } from '@/store/theme';
import { useProductSearch } from '@/services/useProductSearch';
import { confirmDelete as confirmRemoval } from '@/services/confirm';

export default function ProductsManage() {
  const { products, deleteProduct } = useShop();

  const [query, setQuery] = useState('');
  const results = useProductSearch(query, products);
  const confirmDelete = (id: string, name: string) =>
    confirmRemoval('Delete jewelry?', `Remove ${name}?`, () => deleteProduct(id));

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, paddingTop: 8, paddingBottom: 16, gap: 16 }}>
        <PageHeader title="Products" onBack={() => goBack('/(tabs)')} />
        <View style={CTA}>
          <AquaButton label="+ Add Jewelry" onPress={() => router.push('/product-form' as never)} />
        </View>
        <TextInput value={query} onChangeText={setQuery} placeholder="Search products by name..." accessibilityLabel="Search products" style={{ padding: 12, borderWidth: 1, borderColor: COLORS.light, borderRadius: 12 }} />
        {results.length === 0 ? (
          <EmptyState
            icon="diamond"
            title={query ? "No matching products" : "No products"}
            message={query ? "Try another keyword." : "Add your first jewelry item."}
            actionLabel="Add Jewelry"
            onAction={() => router.push('/product-form' as never)}
          />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(p) => p.id}
            style={{ flex: 1, width: '100%', maxWidth: 720, alignSelf: 'center' }}
            contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item: p }) => (
              <View key={p.id} style={styles.card}>
                <View style={styles.thumb}>
                  <JewelryImage uri={p.image} imageStyle={{ width: 56, height: 56 }} tileStyle={{ width: 64, height: 64, borderRadius: RADIUS.md }} iconSize={26} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.name} numberOfLines={1}>{p.name}</Text>
                  <Text style={styles.sub}>
                    {p.category} · {peso(p.price)}
                  </Text>
                  <Text style={styles.sub}>
                    Stock {p.stock} · {p.available && p.stock > 0 ? 'Available' : 'Out of Stock'}
                  </Text>
                </View>
                <View style={{ gap: 6 }}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${p.name}`}
                    onPress={() => router.push({ pathname: '/product-form', params: { id: p.id } } as never)}
                    style={({ pressed }) => [styles.mini, styles.edit, { opacity: pressed ? 0.6 : 1 }]}>
                    <Ionicons name="pencil" size={14} color={COLORS.navy} />
                    <Text style={styles.miniText}>Edit</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${p.name}`}
                    onPress={() => confirmDelete(p.id, p.name)}
                    style={({ pressed }) => [styles.mini, styles.del, { opacity: pressed ? 0.6 : 1 }]}>
                    <Ionicons name="trash-outline" size={14} color={COLORS.danger} />
                    <Text style={[styles.miniText, { color: COLORS.danger }]}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
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
    padding: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  thumb: {
    backgroundColor: COLORS.light,
    borderRadius: RADIUS.md,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  name: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.navy,
  },
  sub: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.muted,
  },
  mini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 30,
    alignSelf: 'flex-start',
  },
  edit: {
    backgroundColor: COLORS.aqua,
  },
  del: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  miniText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.navy,
  },
});
