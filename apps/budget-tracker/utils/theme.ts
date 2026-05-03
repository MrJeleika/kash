export const C = {
  background: '#C2B9A7',
  surface: '#D6D1C4',
  surfaceRaised: '#DDD8CC',
  border: '#B5ADA0',
  text: '#1A1918',
  textMuted: '#7A7469',
  accent: '#CC2200',
  accentHover: '#AA1C00',
  primary: '#1A1918',
  danger: '#CC2200',
} as const;

export type ColorKey = keyof typeof C;

export const withAlpha = (hex: string, alpha: number): string => {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
};
