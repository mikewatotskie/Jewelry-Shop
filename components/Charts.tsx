import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { peso } from '@/store/format';
import { COLORS, FONTS, RADIUS } from '@/store/theme';

export function HBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <View style={{ gap: 10 }}>
      {data.map((d, i) => (
        <View key={`${d.label}-${i}`} style={{ gap: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.barLabel} numberOfLines={1}>{d.label}</Text>
            <Text style={styles.barValue}>{d.value}</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.max(4, (d.value / max) * 100)}%` }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function StackedCategoryChart({ data }: { data: { label: string; value: number }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <View style={{ gap: 12 }}>
      <View style={styles.stack}>
        {data.map((d, i) => (
          <View
            key={`seg-${d.label}-${i}`}
            style={[
              styles.segment,
              {
                flex: total ? Math.max(d.value, 0.001) : 1,
                backgroundColor: i % 2 === 0 ? COLORS.aqua : COLORS.light,
              },
            ]}
          />
        ))}
      </View>
      {data.map((d, i) => (
        <View key={`${d.label}-${i}`} style={styles.legendRow}>
          <Text style={styles.barLabel}>{d.label}</Text>
          <Text style={styles.barValue}>{peso(d.value)}</Text>
        </View>
      ))}
    </View>
  );
}

export function ColumnChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <View style={styles.cols}>
      {data.map((d) => (
        <View key={d.label} style={styles.col}>
          <View style={styles.colTrack}>
            <View style={[styles.colFill, { height: `${Math.max(4, (d.value / max) * 100)}%` }]} />
          </View>
          <Text style={styles.colLabel} numberOfLines={1}>{d.label}</Text>
        </View>
      ))}
    </View>
  );
}

export function StatCard({ label, value, width }: { label: string; value: string; width?: number | string }) {
  return (
    <View style={[styles.stat, width !== undefined ? { width: width as never } : { flex: 1 }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.light,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: COLORS.aqua,
  },
  barLabel: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.navy,
    flex: 1,
  },
  barValue: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.navy,
  },
  stack: {
    flexDirection: 'row',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    gap: 2,
    backgroundColor: COLORS.light,
  },
  segment: {
    borderRadius: 4,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cols: {
    flexDirection: 'row',
    gap: 8,
    height: 170,
  },
  col: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  colTrack: {
    flex: 1,
    width: '70%',
    maxWidth: 44,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  colFill: {
    width: '100%',
    backgroundColor: COLORS.aqua,
    borderRadius: 8,
  },
  colLabel: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.navy,
  },
  stat: {
    backgroundColor: COLORS.light,
    borderRadius: RADIUS.lg,
    padding: 14,
    gap: 4,
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.navy,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.muted,
  },
});
