import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { JewelryImage } from '@/components/JewelryImage';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/SearchBar';
import { EmptyState, QtyStepper, goBack } from '@/components/Ui';
import { LOW_STOCK_THRESHOLD } from '@/store/data';
import { useShop } from '@/store/shop';
import { COLORS, FONTS, RADIUS } from '@/store/theme';

export default function Inventory() {
  const { products, adjustStock, setStock, setAvailability } = useShop();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  return (
    <Screen>
      <View style={{ paddingTop: 8, paddingBottom: 16, gap: 16 }}>
        <PageHeader title="Inventory" onBack={() => goBack('/(tabs)')} />
        {products.length === 0 ? (
          <EmptyState icon="cube-outline" title="No inventory" message="Add products to manage stock." />
        ) : (
          <View style={{ gap: 10, width: '100%', maxWidth: 720, alignSelf: 'center' }}>
            {products.map((p) => {
              const out = p.stock <= 0 || !p.available;
              const low = !out && p.stock <= LOW_STOCK_THRESHOLD;
              return (
                <View key={p.id} style={styles.card}>
                  <View style={styles.thumb}>
                    <JewelryImage uri={p.image} imageStyle={{ width: 52, height: 52 }} tileStyle={{ width: 60, height: 60, borderRadius: RADIUS.md }} iconSize={24} />
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.name} numberOfLines={1}>{p.name}</Text>
                    <Text style={styles.sub}>{p.category} · Stock {p.stock}</Text>
                    <View style={[styles.badge, out ? styles.out : low ? styles.low : styles.ok]}>
                      <Text style={[styles.badgeText, out ? styles.outText : null]}>
                        {out ? 'Out of Stock' : low ? 'Low Stock' : 'Available'}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 4 }}>
                      <QtyStepper small qty={p.stock} onMinus={() => adjustStock(p.id, -1)} onPlus={() => adjustStock(p.id, 1)} />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                      <TextInput
                        value={drafts[p.id] ?? ''}
                        onChangeText={(t) => setDrafts((d) => ({ ...d, [p.id]: t.replace(/[^0-9]/g, '') }))}
                        placeholder="Set stock"
                        placeholderTextColor={COLORS.muted}
                        keyboardType="numeric"
                        style={styles.setInput}
                      />
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Set stock for ${p.name}`}
                        onPress={() => {
                          const raw = drafts[p.id] ?? '';
                          if (raw.trim() === '') {
                            Alert.alert('Enter a number', 'Type a stock quantity before pressing Set.');
                            return;
                          }
                          const v = Number(raw);
                          if (Number.isInteger(v) && v >= 0) {
                            setStock(p.id, v);
                            setDrafts((d) => ({ ...d, [p.id]: '' }));
                          }
                        }}
                        style={({ pressed }) => [styles.mini, { opacity: pressed ? 0.6 : 1 }]}>
                        <Text style={styles.miniText}>Set</Text>
                      </Pressable>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => setAvailability(p.id, true)}
                        disabled={p.stock <= 0}
                        style={({ pressed }) => [styles.mini, styles.aquaMini, { opacity: pressed || p.stock <= 0 ? 0.5 : 1 }]}>
                        <Text style={styles.miniText}>Mark Available</Text>
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => setAvailability(p.id, false)}
                        style={({ pressed }) => [styles.mini, styles.ghostMini, { opacity: pressed ? 0.6 : 1 }]}>
                        <Text style={styles.miniText}>Out of Stock</Text>
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Edit ${p.name}`}
                        onPress={() => router.push({ pathname: '/product-form', params: { id: p.id } } as never)}
                        style={({ pressed }) => [styles.mini, styles.ghostMini, { opacity: pressed ? 0.6 : 1 }]}>
                        <Text style={styles.miniText}>Edit</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
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
  },
  thumb: {
    backgroundColor: COLORS.light,
    borderRadius: RADIUS.md,
    width: 60,
    height: 60,
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
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  ok: {
    backgroundColor: COLORS.aqua,
  },
  low: {
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.navy,
  },
  out: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: COLORS.navy,
  },
  outText: {
    color: COLORS.danger,
  },
  setInput: {
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: 8,
    height: 32,
    paddingHorizontal: 8,
    width: 90,
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.navy,
  },
  mini: {
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  aquaMini: {
    backgroundColor: COLORS.aqua,
  },
  ghostMini: {
    backgroundColor: COLORS.light,
  },
  miniText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.navy,
  },
});
