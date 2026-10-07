import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, FONTS, RADIUS } from '@/store/theme';
import { JewelryImage } from './JewelryImage';

export function ImageInput({ value, onChange }: { value: string; onChange: (uri: string) => void }) {
  const pick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        onChange(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Could not open photos', 'Please paste an image URL instead.');
    }
  };

  return (
    <View style={{ gap: 10 }}>
      <Text style={styles.label}>Product Image</Text>
      {value ? (
        <View style={styles.previewWrap}>
          <JewelryImage uri={value} imageStyle={styles.preview} tileStyle={styles.preview} iconSize={48} />
        </View>
      ) : null}
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <Pressable accessibilityRole="button" onPress={pick} style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.6 : 1 }]}>
          <Text style={styles.btnText}>{value ? 'Change Image' : 'Upload Image'}</Text>
        </Pressable>
        {value ? (
          <Pressable accessibilityRole="button" onPress={() => onChange('')} style={({ pressed }) => [styles.btnGhost, { opacity: pressed ? 0.6 : 1 }]}>
            <Text style={styles.btnText}>Remove</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.or}>OR</Text>
      <Text style={styles.subLabel}>Image URL</Text>
      <TextInput
        value={/^(file:|blob:|content:|data:)/.test(value) ? '' : value}
        onChangeText={onChange}
        placeholder="https://..."
        placeholderTextColor={COLORS.muted}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.navy,
  },
  subLabel: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.muted,
  },
  or: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.muted,
    textAlign: 'center',
  },
  previewWrap: {
    backgroundColor: COLORS.light,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    maxWidth: 320,
  },
  preview: {
    width: '100%',
    maxWidth: 320,
    aspectRatio: 1,
    borderRadius: RADIUS.lg,
  },
  btn: {
    backgroundColor: COLORS.aqua,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  btnGhost: {
    backgroundColor: COLORS.light,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  btnText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.navy,
  },
  input: {
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
