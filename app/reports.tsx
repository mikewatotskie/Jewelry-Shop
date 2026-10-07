import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ColumnChart, HBarChart, StackedCategoryChart, StatCard } from '@/components/Charts';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/SearchBar';
import { Chip, EmptyState, SectionHeader, goBack } from '@/components/Ui';
import { CATEGORIES, LOW_STOCK_THRESHOLD } from '@/store/data';
import { peso } from '@/store/format';
import { useShop } from '@/store/shop';
import { COLORS, FONTS } from '@/store/theme';

type Range = 'Daily' | 'Weekly' | 'Monthly';

function bucketize(dates: number[], range: Range): { label: string; value: number }[] {
  const now = new Date();
  if (range === 'Daily') {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      return d;
    });
    return days.map((d) => ({
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      value: dates.filter((t) => {
        const x = new Date(t);
        return x.toDateString() === d.toDateString();
      }).length,
    }));
  }
  if (range === 'Weekly') {
    return [...Array(4)].map((_, i) => {
      const end = new Date(now);
      end.setDate(now.getDate() - i * 7);
      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      return {
        label: `W${4 - i}`,
        value: dates.filter((t) => t >= start.getTime() && t <= end.getTime()).length,
      };
    });
  }
  return [...Array(6)].map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const next = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1);
    return {
      label: d.toLocaleString('en-US', { month: 'short' }),
      value: dates.filter((t) => t >= d.getTime() && t < next.getTime()).length,
    };
  });
}

export default function Reports() {
  const { orders, products } = useShop();
  const [range, setRange] = useState<Range>('Daily');

  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const avg = totalOrders ? Math.round(totalSales / totalOrders) : 0;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD);
  const outStock = products.filter((p) => p.stock <= 0 || !p.available);

  const best = useMemo(() => {
    const m = new Map<string, { label: string; value: number }>();
    for (const o of orders)
      for (const i of o.items) {
        const cur = m.get(i.productId) ?? { label: i.name, value: 0 };
        cur.value += i.qty;
        m.set(i.productId, cur);
      }
    return [...m.values()].sort((a, b) => b.value - a.value).slice(0, 8);
  }, [orders]);

  const byCategory = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p.category]));
    const rev = new Map<string, number>(CATEGORIES.map((c) => [c.name, 0]));
    for (const o of orders)
      for (const i of o.items) {
        const cat = byId.get(i.productId) ?? 'Removed';
        rev.set(cat, (rev.get(cat) ?? 0) + i.price * i.qty);
      }
    return [...rev.entries()].map(([label, value]) => ({ label, value })).filter((d) => d.value > 0);
  }, [orders, products]);

  const overTime = useMemo(() => bucketize(orders.map((o) => o.date), range), [orders, range]);

  return (
    <Screen>
      <View style={{ paddingTop: 8, paddingBottom: 16, gap: 16 }}>
        <PageHeader title="Reports" onBack={() => goBack('/(tabs)')} />
        <View style={styles.statGrid}>
          <StatCard label="Total Sales" value={peso(totalSales)} />
          <StatCard label="Total Orders" value={String(totalOrders)} />
        </View>
        <View style={styles.statGrid}>
          <StatCard label="Avg Order Value" value={peso(avg)} />
          <StatCard label="Total Products" value={String(products.length)} />
        </View>
        <View style={styles.statGrid}>
          <StatCard label="Low Stock" value={String(lowStock.length)} />
          <StatCard label="Out of Stock" value={String(outStock.length)} />
        </View>

        <View style={{ gap: 8 }}>
          <SectionHeader title="Best-Selling Jewelry" />
          {best.length === 0 ? (
            <Text style={styles.note}>No sales yet.</Text>
          ) : (
            <HBarChart data={best} />
          )}
        </View>

        <View style={{ gap: 8 }}>
          <SectionHeader title="Sales by Category" />
          {byCategory.length === 0 ? (
            <Text style={styles.note}>No sales yet.</Text>
          ) : (
            <StackedCategoryChart data={byCategory} />
          )}
        </View>

        <View style={{ gap: 8 }}>
          <SectionHeader title="Sales Over Time" />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['Daily', 'Weekly', 'Monthly'] as Range[]).map((r) => (
              <Chip key={r} label={r} active={range === r} onPress={() => setRange(r)} />
            ))}
          </View>
          <ColumnChart data={overTime} />
        </View>

        <View style={{ gap: 8 }}>
          <SectionHeader
            title="Low Stock"
            actionLabel="Inventory"
            onAction={() => router.push('/inventory' as never)}
          />
          {lowStock.length === 0 && outStock.length === 0 ? (
            <Text style={styles.note}>All stocked up.</Text>
          ) : (
            [...outStock, ...lowStock.filter((p) => !outStock.includes(p))].map((p) => (
              <Pressable
                key={p.id}
                accessibilityRole="button"
                onPress={() => router.push('/inventory' as never)}
                style={({ pressed }) => [styles.lowRow, { opacity: pressed ? 0.6 : 1 }]}>
                <Text style={styles.lowName}>{p.name}</Text>
                <Text style={[styles.lowStock, p.stock <= 0 && styles.lowOut]}>Stock {p.stock}</Text>
              </Pressable>
            ))
          )}
        </View>

        {orders.length === 0 ? (
          <EmptyState icon="chart-bar" title="No report data" message="Complete a checkout to see analytics." />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  note: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.muted,
  },
  lowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 12,
  },
  lowName: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.navy,
  },
  lowStock: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.navy,
  },
  lowOut: {
    color: COLORS.danger,
  },
});
