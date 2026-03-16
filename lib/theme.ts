import { ViewStyle, TextStyle } from 'react-native';

export const colors = {
  bg: '#0F0F0F',           // screen backgrounds
  surface: '#1A1A1A',      // cards, inputs
  border: '#2A2A2A',       // dividers, input borders
  textPrimary: '#FAFAFA',
  textSecondary: '#888888',
  textDisabled: '#555555',
  orange: '#FF6B00',       // primary CTA, active tab
  cyan: '#00D4FF',         // safe/verified state
  cyanDim: '#003A45',      // safe badge background
  red: '#FF3131',          // stolen/error
  redDim: '#4A0A0A',       // stolen badge background
  orangeDim: '#7A3300',    // muted orange backgrounds
};

export const typography = {
  headingXL: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 32 } as const,
  headingLG: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 26 } as const,
  headingMD: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 20 } as const,
  labelSM: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 0.8, textTransform: 'uppercase' as const },
  mono: { fontFamily: 'SpaceMono_400Regular', fontSize: 13 } as const,
  monoSM: { fontFamily: 'SpaceMono_400Regular', fontSize: 11 } as const,
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const radius = { sm: 6, md: 10, lg: 14, xl: 20 };

export const presets = {
  cardBase: {
    backgroundColor: '#1A1A1A',
    borderLeftWidth: 3,
    borderRadius: 14,
  } as ViewStyle,
  buttonPrimary: {
    backgroundColor: '#FF6B00',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center' as const,
  } as ViewStyle,
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center' as const,
  } as ViewStyle,
  inputBase: {
    backgroundColor: '#1A1A1A',
    borderColor: '#2A2A2A',
    borderWidth: 1,
    color: '#FAFAFA',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  } as ViewStyle,
  screenContainer: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  } as ViewStyle,
};
