import { Platform, ViewStyle } from 'react-native';

export const COLORS = {
  white: '#FFFFFF',
  light: '#D5EEFF',
  aqua: '#A6F6FF',
  navy: '#12263A',
  muted: 'rgba(18,38,58,0.6)',
  faint: 'rgba(18,38,58,0.08)',
  danger: '#E5484D',
  success: '#1F9D55',
} as const;

export const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
} as const;

export const SHADOW: ViewStyle =
  Platform.OS === 'web'
    ? {
        boxShadow: '0px 4px 16px rgba(18,38,58,0.06)',
      }
    : {
        shadowColor: COLORS.navy,
        shadowOpacity: 0.05,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      };

export const SIDE_PADDING = 16;
export const MAX_WEB_WIDTH = 1100;
