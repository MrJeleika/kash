// Kash design system tokens — Editorial-brutalist warm palette.
// Source of truth for inline styles across the app.

export const C = {
  // Surfaces (cream)
  paper: '#EDE5D8',       // primary background
  paperHi: '#F5EFE5',     // raised cards on cream
  paperDim: '#E2DACC',    // dividers, fills, inactive bars
  // Surfaces (ink)
  ink: '#0F0E0C',         // primary ink, black panels, primary buttons
  inkSoft: '#1A1815',     // secondary dark surface
  inkLine: '#2A2723',     // hairline on ink
  // Hairlines on cream
  rule: '#C9BFAE',
  // Text on cream
  text: '#171513',
  textMuted: '#6B6358',
  textMute: '#9A9081',    // tertiary / placeholder
  // Text on ink
  textOnInk: '#F1EBDD',
  textOnInkDim: '#A89E8C',
  // Signal
  red: '#E5392E',
  redDeep: '#B62B23',
  redDim: '#F4D9D5',
  // Semantic
  green: '#3E8E5A',
  greenDim: '#D6E5DC',
  amber: '#C97A2B',

  // Legacy aliases (kept so old imports keep compiling)
  background: '#EDE5D8',
  surface: '#F5EFE5',
  surfaceRaised: '#F5EFE5',
  border: '#C9BFAE',
  accent: '#E5392E',
  accentHover: '#B62B23',
  primary: '#0F0E0C',
  danger: '#E5392E',
} as const;

export type ColorKey = keyof typeof C;

export const withAlpha = (hex: string, alpha: number): string => {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
};

// Font families — Google Fonts loaded via @expo-google-fonts/* in _layout.
// Use these as fontFamily values on Text/View styles.
export const FONTS = {
  sans: 'InterTight_400Regular',
  sansMedium: 'InterTight_500Medium',
  sansSemi: 'InterTight_600SemiBold',
  sansBold: 'InterTight_700Bold',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
  monoSemi: 'JetBrainsMono_600SemiBold',
  monoBold: 'JetBrainsMono_700Bold',
  serif: 'InstrumentSerif_400Regular',
  serifItalic: 'InstrumentSerif_400Regular_Italic',
} as const;

// Common label style — mono uppercase 10/0.14em, used as section eyebrows.
export const eyebrowStyle = {
  fontFamily: FONTS.monoSemi,
  fontSize: 10,
  letterSpacing: 1.4,
  textTransform: 'uppercase' as const,
  color: C.textMuted,
};
