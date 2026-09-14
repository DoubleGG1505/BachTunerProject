export const lightColors = {
  mode: 'light' as const,
  background: '#F8F4E1',
  card: '#FFFFFF',
  title: '#543310',
  subtitle: '#74512D',
  border: '#AF8F6F',
  primary: '#74512D',
  accent: '#AF8F6F',
  error: '#C0392B',
};

export const darkColors = {
  mode: 'dark' as const,
  background: '#1E1B18',
  card: '#2D2824',
  title: '#F8F4E1',
  subtitle: '#D4C3B3',
  border: '#543310',
  primary: '#AF8F6F',
  accent: '#74512D',
  error: '#E74C3C',
};

export type ThemeColors = typeof lightColors | typeof darkColors;