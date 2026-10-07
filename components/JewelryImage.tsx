import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, ImageStyle, StyleProp, View, ViewStyle } from 'react-native';
import { COLORS } from '@/store/theme';

export function JewelryImage({
  uri,
  imageStyle,
  tileStyle,
  iconSize = 40,
}: {
  uri?: string;
  imageStyle?: StyleProp<ImageStyle>;
  tileStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [uri]);
  if (!uri || failed) {
    return (
      <View style={[{ backgroundColor: COLORS.light, alignItems: 'center', justifyContent: 'center' }, tileStyle]}>
        <MaterialCommunityIcons name="diamond" size={iconSize} color={COLORS.navy} />
      </View>
    );
  }
  return <Image source={{ uri }} resizeMode="contain" onError={() => setFailed(true)} style={imageStyle} />;
}
