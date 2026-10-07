import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { ImageInput } from '@/components/ImageInput';
import { CTA, Screen } from '@/components/Screen';
import { PageHeader } from '@/components/SearchBar';
import { AquaButton, Chip, goBack } from '@/components/Ui';
import { CATEGORIES, Category, MATERIALS, Material } from '@/store/data';
import { useShop } from '@/store/shop';
import { COLORS, FONTS, RADIUS } from '@/store/theme';

export default function ProductForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getProduct, addProduct, updateProduct } = useShop();
  const editing = typeof id === 'string' ? getProduct(id) : undefined;

  const [name, setName] = useState(editing?.name ?? '');
  const [category, setCategory] = useState<Category>(editing?.category ?? 'Necklace');
  const [material, setMaterial] = useState<Material>(editing?.material ?? 'Gold');
  const [price, setPrice] = useState(editing ? String(editing.price) : '');
  const [image, setImage] = useState(editing?.image ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [rating, setRating] = useState(editing ? String(editing.rating) : '4.5');
  const [sizes, setSizes] = useState((editing?.sizes ?? ['One Size']).join(', '));
  const [stock, setStock] = useState(editing ? String(editing.stock) : '10');
  const [available, setAvailable] = useState(editing?.available ?? true);
  const [error, setError] = useState('');

  useEffect(() => {
    const e = typeof id === 'string' ? getProduct(id) : undefined;
    setName(e?.name ?? '');
    setCategory(e?.category ?? 'Necklace');
    setMaterial(e?.material ?? 'Gold');
    setPrice(e ? String(e.price) : '');
    setImage(e?.image ?? '');
    setDescription(e?.description ?? '');
    setRating(e ? String(e.rating) : '4.5');
    setSizes((e?.sizes ?? ['One Size']).join(', '));
    setStock(e ? String(e.stock) : '10');
    setAvailable(e?.available ?? true);
    setError('');
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = () => {
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    const priceNum = Number(price);
    if (price.trim() === '' || !Number.isFinite(priceNum) || priceNum < 0) {
      setError('Price must be a number, zero or more.');
      return;
    }
    const stockNum = Number(stock);
    if (stock.trim() === '' || !Number.isInteger(stockNum) || stockNum < 0) {
      setError('Stock must be a whole number, zero or more.');
      return;
    }
    let ratingNum = Number(rating);
    if (!Number.isFinite(ratingNum)) ratingNum = 0;
    ratingNum = Math.max(0, Math.min(5, ratingNum));
    const sizeList = sizes.split(',').map((s) => s.trim()).filter(Boolean);
    const payload = {
      name: name.trim(),
      category,
      material,
      price: Math.round(priceNum * 100) / 100,
      image: image.trim(),
      description: description.trim() || 'Beautiful handcrafted jewelry.',
      rating: Math.round(ratingNum * 10) / 10,
      sizes: sizeList.length ? sizeList : ['One Size'],
      stock: stockNum,
      available,
    };
    if (editing) {
      updateProduct(editing.id, payload);
      Alert.alert('Saved', 'Jewelry updated everywhere.');
    } else {
      addProduct(payload);
      Alert.alert('Added', 'New jewelry added to the catalog.');
    }
    goBack('/products-manage');
  };

  return (
    <Screen>
      <View style={{ paddingTop: 8, paddingBottom: 24, gap: 14, width: '100%', maxWidth: 720, alignSelf: 'center' }}>
        <PageHeader title={editing ? 'Edit Jewelry' : 'Add Jewelry'} onBack={() => goBack('/products-manage')} />

        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Product Name *</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Gold Necklace" placeholderTextColor={COLORS.muted} style={styles.input} />
        </View>

        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.wrap}>
            {CATEGORIES.map((c) => (
              <Chip key={c.name} label={c.name} active={category === c.name} onPress={() => setCategory(c.name)} />
            ))}
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Material</Text>
          <View style={styles.wrap}>
            {MATERIALS.map((m) => (
              <Chip key={m} label={m} active={material === m} onPress={() => setMaterial(m)} />
            ))}
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={styles.label}>Price (₱) *</Text>
            <TextInput value={price} onChangeText={(t) => setPrice(t.replace(/[^0-9.]/g, ''))} placeholder="75000" placeholderTextColor={COLORS.muted} keyboardType="decimal-pad" style={styles.input} />
          </View>
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={styles.label}>Stock *</Text>
            <TextInput value={stock} onChangeText={(t) => setStock(t.replace(/[^0-9]/g, ''))} placeholder="10" placeholderTextColor={COLORS.muted} keyboardType="numeric" style={styles.input} />
          </View>
        </View>

        <ImageInput value={image} onChange={setImage} />

        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Description</Text>
          <TextInput value={description} onChangeText={setDescription} placeholder="Craftsmanship, gemstone, design..." placeholderTextColor={COLORS.muted} multiline style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]} />
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={styles.label}>Rating (0-5)</Text>
            <TextInput value={rating} onChangeText={setRating} placeholder="4.5" placeholderTextColor={COLORS.muted} keyboardType="decimal-pad" style={styles.input} />
          </View>
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={styles.label}>Sizes (comma separated)</Text>
            <TextInput value={sizes} onChangeText={setSizes} placeholder="16, 18, 20 in" placeholderTextColor={COLORS.muted} style={styles.input} />
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Availability</Text>
          <View style={styles.wrap}>
            <Chip label="Available" active={available} onPress={() => setAvailable(true)} />
            <Chip label="Out of Stock" active={!available} onPress={() => setAvailable(false)} />
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={CTA}>
          <AquaButton label={editing ? 'Update Jewelry' : 'Add Jewelry'} onPress={save} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.navy,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: RADIUS.md,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.navy,
    backgroundColor: COLORS.white,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  error: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.danger,
  },
});
