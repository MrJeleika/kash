/**
 * Tailwind theme color extensions. Mirrors the C object in utils/theme.ts —
 * keep the two in sync.
 */
const colors = {
  paper: '#EDE5D8',
  paperHi: '#F5EFE5',
  paperDim: '#E2DACC',
  ink: '#0F0E0C',
  inkSoft: '#1A1815',
  inkLine: '#2A2723',
  rule: '#C9BFAE',
  text: '#171513',
  'text-muted': '#6B6358',
  'text-mute': '#9A9081',
  'text-on-ink': '#F1EBDD',
  'text-on-ink-dim': '#A89E8C',
  red: '#E5392E',
  'red-deep': '#B62B23',
  'red-dim': '#F4D9D5',
  green: '#3E8E5A',
  'green-dim': '#D6E5DC',
  amber: '#C97A2B',

  // Legacy aliases — pre-existing class usage keeps working visually
  background: '#EDE5D8',
  surface: '#F5EFE5',
  'surface-raised': '#F5EFE5',
  border: '#C9BFAE',
  accent: '#E5392E',
  'accent-hover': '#B62B23',
  primary: '#0F0E0C',
  danger: '#E5392E',
};

module.exports = { colors };
