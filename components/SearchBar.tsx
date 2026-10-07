import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, FONTS, RADIUS } from '@/store/theme';

export function SearchBar({
  value,
  onChange,
  onSubmit,
  onFilter,
  placeholder = 'Search jewelry',
}: {
  value: string;
  onChange: (t: string) => void;
  onSubmit?: () => void;
  onFilter?: () => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.bar}>
      <Ionicons name="search" size={20} color={COLORS.muted} />
      <TextInput
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        placeholder={placeholder}
        placeholderTextColor={COLORS.muted}
        style={styles.input}
      />
      {onFilter ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open filters"
          onPress={onFilter}
          style={({ pressed }) => [styles.filterBtn, { opacity: pressed ? 0.6 : 1 }]}>
          <Ionicons name="options-outline" size={20} color={COLORS.navy} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function PageHeader({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          style={({ pressed }) => [styles.circle, { opacity: pressed ? 0.6 : 1 }]}>
          <Ionicons name="arrow-back" size={22} color={COLORS.navy} />
        </Pressable>
      ) : (
        <View style={{ width: 40 }} />
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={{ width: 40, alignItems: 'flex-end' }}>{right ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: RADIUS.lg,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 16,
    paddingRight: 4,
    width: '100%',
  },
  input: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.navy,
    height: '100%',
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.aqua,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    width: '100%',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.navy,
  },
});
