// It's Me — Design System
// Super Bright, Luminous, Crystal Clear, Sparkling · Multi-Theme

export const Colors = {
  // Core Brand
  primary: '#00A884',
  primaryDark: '#075E54',
  primaryLight: '#D9FDF5',
  accent: '#25D366',
  gold: '#F0B429',
  goldLight: '#FFF9E6',

  // Backgrounds — Always bright, luminous, never dark
  background: '#F7FFFE',
  backgroundAlt: '#EAF9F6',
  surface: '#FFFFFF',
  surfaceGlow: '#F0FDFB',
  surfaceGold: '#FFFBF0',

  // Gradients (used with expo-linear-gradient)
  gradientPrimary: ['#00C9A7', '#00A884', '#128C7E'],
  gradientGold: ['#F6D365', '#F0B429'],
  gradientPearl: ['#FFFFFF', '#E8FDF8', '#D4F7EE'],
  gradientStatus: ['#E8F8F5', '#D1F2EB', '#A9DFBF'],

  // NEW THEME GRADIENTS
  // 1. Super Bright Glassy Luminous
  gradientGlassyBright: ['#E0FFFC', '#B2FFEE', '#7FFFD4', '#AFFFFF'],
  gradientGlassyTeal: ['#EAFFFE', '#C8FFFA', '#96FFF4', '#00E5CC'],
  // 2. Emerald Glassy Carved Fluffy
  gradientEmeraldGlass: ['#F0FFF8', '#C2FFE6', '#80FFD2', '#2EFFA0'],
  gradientEmeraldDeep: ['#DCFCE7', '#A7F3D0', '#6EE7B7', '#34D399'],
  // 3. Crimson Bright Rosey Delight
  gradientCrimsonRosey: ['#FFF0F3', '#FFD6DE', '#FFB3C1', '#FF85A1'],
  gradientRoseyDelight: ['#FFF5F7', '#FFE4E6', '#FFC8CC', '#FF6B81'],
  gradientCrimsonGlow: ['#FFF8F8', '#FFE5E5', '#FFCCCC', '#FF9999'],

  // Text
  textPrimary: '#0A2E2A',
  textSecondary: '#3D7A70',
  textMuted: '#7FB3AB',
  textInverse: '#FFFFFF',
  textGold: '#B7860B',
  textLink: '#00A884',
  textCrimson: '#C0392B',

  // Status
  online: '#25D366',
  away: '#F0B429',
  offline: '#C5D8D5',
  unread: '#25D366',

  // UI
  border: '#D1EDE8',
  borderLight: '#E8F7F4',
  divider: '#EBF5F3',
  shadow: 'rgba(0,168,132,0.12)',
  shadowGold: 'rgba(240,180,41,0.15)',
  shadowCrimson: 'rgba(255,133,161,0.18)',
  overlay: 'rgba(0,90,75,0.08)',

  // Semantic
  success: '#25D366',
  warning: '#F0B429',
  error: '#E74C3C',
  info: '#2E86C1',

  // Tabs
  tabActive: '#00A884',
  tabInactive: '#7FB3AB',
  tabBar: '#FFFFFF',
  tabBorder: '#D1EDE8',

  // Message bubbles
  bubbleOut: '#DCF8C6',
  bubbleIn: '#FFFFFF',
  bubbleOutText: '#0A2E2A',
  bubbleInText: '#0A2E2A',
};

// App Themes
export const THEMES = {
  emerald: {
    name: 'Emerald Glow',
    nameUr: 'زمرد چمک',
    nameAr: 'توهج الزمرد',
    background: ['#E8FDF8', '#F4FFFB', '#FFFFFF'] as [string, string, string],
    header: ['#128C7E', '#00A884', '#25D366'] as [string, string, string],
    bubble: '#DCF8C6',
    accent: '#00A884',
    desc: 'Crystal clear emerald luminous',
  },
  glassyBright: {
    name: 'Super Bright Glass',
    nameUr: 'سپر برائٹ گلاس',
    nameAr: 'زجاج لامع فائق',
    background: ['#E0FFFC', '#EAFFFE', '#FFFFFF'] as [string, string, string],
    header: ['#00C9C8', '#00E5CC', '#2EFFEA'] as [string, string, string],
    bubble: '#B2FFEE',
    accent: '#00C9C8',
    desc: 'Ultra bright glassy digital',
  },
  emeraldGlass: {
    name: 'Emerald Glass Carved',
    nameUr: 'زمرد شیشہ',
    nameAr: 'زمرد منحوت زجاجي',
    background: ['#F0FFF8', '#DCFCE7', '#FFFFFF'] as [string, string, string],
    header: ['#059669', '#10B981', '#34D399'] as [string, string, string],
    bubble: '#A7F3D0',
    accent: '#10B981',
    desc: 'Carved textured fluffy emerald',
  },
  crimsonRosey: {
    name: 'Crimson Rose',
    nameUr: 'قرمزی گلاب',
    nameAr: 'وردة قرمزية',
    background: ['#FFF5F7', '#FFF0F3', '#FFFFFF'] as [string, string, string],
    header: ['#E91E63', '#F06292', '#FF85A1'] as [string, string, string],
    bubble: '#FFD6DE',
    accent: '#E91E63',
    desc: 'Bright rosey delight display',
  },
  royalGold: {
    name: 'Royal Gold',
    nameUr: 'شاہی سونا',
    nameAr: 'الذهب الملكي',
    background: ['#FFFBF0', '#FFF9E6', '#FFFFFF'] as [string, string, string],
    header: ['#B7860B', '#D4940B', '#F0B429'] as [string, string, string],
    bubble: '#FFF3CD',
    accent: '#F0B429',
    desc: 'Premium gold luminous glow',
  },
  ocean: {
    name: 'Crystal Ocean',
    nameUr: 'کرسٹل سمندر',
    nameAr: 'المحيط الكريستالي',
    background: ['#EFF6FF', '#DBEAFE', '#FFFFFF'] as [string, string, string],
    header: ['#1D4ED8', '#3B82F6', '#60A5FA'] as [string, string, string],
    bubble: '#BFDBFE',
    accent: '#3B82F6',
    desc: 'Deep crystal ocean blue',
  },
};

export type ThemeKey = keyof typeof THEMES;

export const Fonts = {
  regular: { fontWeight: '400' as const },
  medium: { fontWeight: '500' as const },
  semiBold: { fontWeight: '600' as const },
  bold: { fontWeight: '700' as const },
  extraBold: { fontWeight: '800' as const },

  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
};

export const Shadow = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  gold: {
    shadowColor: Colors.shadowGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  crimson: {
    shadowColor: Colors.shadowCrimson,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
};
