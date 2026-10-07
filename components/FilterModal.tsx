import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { CATEGORIES, Category, MATERIALS, Material } from '@/store/data';
import { DEFAULT_FILTERS, FilterState, SORTS } from '@/store/filter';
import { COLORS, FONTS, RADIUS } from '@/store/theme';
import { AquaButton, Chip, OutlineButton } from './Ui';

export function FilterModal({
  visible,
  initial,
  onClose,
  onApply,
}: {
  visible: boolean;
  initial: FilterState;
  onClose: () => void;
  onApply: (f: FilterState) => void;
}) {
  const [draft, setDraft] = useState<FilterState>(initial);

  React.useEffect(() => {
    if (visible) setDraft(initial);
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleMaterial = (m: Material) =>
    setDraft((d) => ({ ...d, materials: d.materials.includes(m) ? d.materials.filter((x) => x !== m) : [...d.materials, m] }));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Text style={styles.title}>Filter</Text>
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 440 }}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.wrap}>
              {(['All', ...CATEGORIES.map((c) => c.name)] as (Category | 'All')[]).map((c) => (
                <Chip key={c} label={c} active={draft.category === c} onPress={() => setDraft((d) => ({ ...d, category: c }))} />
              ))}
            </View>
            <Text style={styles.label}>Sort</Text>
            <View style={styles.wrap}>
              {SORTS.map((s) => (
                <Chip key={s.key} label={s.label} active={draft.sort === s.key} onPress={() => setDraft((d) => ({ ...d, sort: s.key }))} />
              ))}
            </View>
            <Text style={styles.label}>Price Range</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TextInput
                value={draft.min}
                onChangeText={(t) => setDraft((d) => ({ ...d, min: t.replace(/[^0-9]/g, '') }))}
                placeholder="Minimum"
                placeholderTextColor={COLORS.muted}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                value={draft.max}
                onChangeText={(t) => setDraft((d) => ({ ...d, max: t.replace(/[^0-9]/g, '') }))}
                placeholder="Maximum"
                placeholderTextColor={COLORS.muted}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
            <Text style={styles.label}>Material</Text>
            <View style={styles.wrap}>
              {MATERIALS.map((m) => (
                <Chip key={m} label={m} active={draft.materials.includes(m)} onPress={() => toggleMaterial(m)} />
              ))}
            </View>
          </ScrollView>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            <View style={{ flex: 1 }}>
              <OutlineButton
                label="Reset"
                onPress={() => {
                  setDraft(DEFAULT_FILTERS);
                  onApply(DEFAULT_FILTERS);
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <AquaButton label="Apply Filter" onPress={() => onApply(draft)} />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(18,38,58,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: 20,
    width: '100%',
    maxWidth: 420,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.navy,
    marginBottom: 12,
  },
  label: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.navy,
    marginTop: 12,
    marginBottom: 8,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: RADIUS.md,
    height: 44,
    paddingHorizontal: 12,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.navy,
    backgroundColor: COLORS.white,
  },
});
