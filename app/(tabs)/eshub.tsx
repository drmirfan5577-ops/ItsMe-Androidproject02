import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';
import CalendarWidget from '@/components/feature/CalendarWidget';
import WeatherWidget from '@/components/feature/WeatherWidget';
import { Colors, Fonts, Spacing, Radius, Shadow } from '@/constants/theme';

export default function ESHubScreen() {
  const { language } = useApp();
  const { showAlert } = useAlert();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [expandedWeather, setExpandedWeather] = useState(false);

  const ES_FEATURES = [
    {
      id: 'weather',
      title: 'Live Weather',
      titleUr: 'لائیو موسم',
      desc: 'Daily forecast & alerts',
      icon: 'partly-sunny-outline',
      color: '#F0B429',
      bg: '#FFF9E6',
    },
    {
      id: 'filters',
      title: 'Message Filters',
      titleUr: 'پیغام فلٹرز',
      desc: 'Custom chat themes & bubbles',
      icon: 'color-filter-outline',
      color: '#9B59B6',
      bg: '#F5EEF8',
    },
    {
      id: 'voice',
      title: 'Voice Messages',
      titleUr: 'وائس پیغامات',
      desc: 'Record & send voice notes',
      icon: 'mic-outline',
      color: '#E74C3C',
      bg: '#FDEDEC',
    },
    {
      id: 'video',
      title: 'Video Player',
      titleUr: 'ویڈیو پلیئر',
      desc: 'HD video calls & sharing',
      icon: 'videocam-outline',
      color: '#2E86C1',
      bg: '#EAF4FB',
    },
    {
      id: 'calendar',
      title: 'Islamic Calendar',
      titleUr: 'اسلامی کیلنڈر',
      desc: 'Hijri dates & Islamic events',
      icon: 'calendar-outline',
      color: '#00A884',
      bg: '#E8FDF8',
    },
    {
      id: 'translate',
      title: 'Translator',
      titleUr: 'ترجمہ',
      desc: 'Urdu ↔ English real-time',
      icon: 'language-outline',
      color: '#16A085',
      bg: '#E8F8F5',
    },
    {
      id: 'backup',
      title: 'Cloud Backup',
      titleUr: 'کلاؤڈ بیک اپ',
      desc: 'Auto-backup all messages',
      icon: 'cloud-upload-outline',
      color: '#3498DB',
      bg: '#EBF5FB',
    },
    {
      id: 'share',
      title: 'Smart Share',
      titleUr: 'شیئر',
      desc: 'Share files, links, contacts',
      icon: 'share-outline',
      color: '#27AE60',
      bg: '#EAFAF1',
    },
    {
      id: 'qibla',
      title: 'Qibla Finder',
      titleUr: 'قبلہ فائنڈر',
      desc: 'Find Qibla direction',
      icon: 'compass-outline',
      color: '#8E44AD',
      bg: '#F4ECF7',
    },
  ];

  const WALLPAPERS = [
    { id: 'w1', name: 'Crystal Clear', colors: ['#E8FDF8', '#D4F7EE', '#B8F0E2'] },
    { id: 'w2', name: 'Golden Pearl', colors: ['#FFF9E6', '#FFF0C0', '#FFE599'] },
    { id: 'w3', name: 'Ocean Blue', colors: ['#EAF4FB', '#D6EAF8', '#A9CCE3'] },
    { id: 'w4', name: 'Rose Glow', colors: ['#FDEDEC', '#FADBD8', '#F1948A'] },
    { id: 'w5', name: 'Forest Fresh', colors: ['#EAFAF1', '#D5F5E3', '#A9DFBF'] },
  ];

  const handleFeature = (id: string) => {
    if (id === 'weather') {
      setExpandedWeather(!expandedWeather);
    } else if (id === 'calendar') {
      showAlert('Islamic Calendar', 'Full Hijri calendar with Islamic events, prayer times, and Ramadan countdown coming in V2.0!');
    } else {
      showAlert('Coming Soon', `${id.charAt(0).toUpperCase() + id.slice(1)} feature will be fully available in V2.0 with OnSpace Cloud!`);
    }
  };

  return (
    <LinearGradient colors={['#E8FDF8', '#F4FFFB', '#FFFFFF']} style={{ flex: 1 }}>
      <LinearGradient
        colors={['#128C7E', '#00A884', '#25D366']}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>E.S Hub</Text>
            <Text style={styles.headerSub}>Extra Services</Text>
          </View>
          <CalendarWidget language={language} compact />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Weather */}
        {expandedWeather && (
          <View style={styles.weatherSection}>
            <WeatherWidget />
          </View>
        )}

        {/* Features Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'ur' ? 'اضافی خدمات' : 'Extra Services'}
          </Text>
          <View style={styles.featuresGrid}>
            {ES_FEATURES.map(f => (
              <TouchableOpacity
                key={f.id}
                style={styles.featureCard}
                onPress={() => handleFeature(f.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.featureIcon, { backgroundColor: f.bg }]}>
                  <Ionicons name={f.icon as any} size={28} color={f.color} />
                </View>
                <Text style={styles.featureTitle}>
                  {language === 'ur' ? f.titleUr : f.title}
                </Text>
                <Text style={styles.featureDesc} numberOfLines={2}>{f.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Wallpapers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'ur' ? 'والپیپر' : 'Chat Wallpapers'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {WALLPAPERS.map(w => (
              <TouchableOpacity
                key={w.id}
                style={styles.wallpaperCard}
                onPress={() => showAlert('Wallpaper', `"${w.name}" applied to all chats!`)}
                activeOpacity={0.8}
              >
                <LinearGradient colors={w.colors as [string, string, string]} style={styles.wallpaperGrad} />
                <Text style={styles.wallpaperName}>{w.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Message Filters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'ur' ? 'پیغام فلٹرز' : 'Message Bubble Styles'}
          </Text>
          <View style={styles.bubblesRow}>
            {['Classic', 'Rounded', 'Modern', 'Minimal'].map(style => (
              <TouchableOpacity
                key={style}
                style={styles.bubbleChip}
                onPress={() => showAlert('Style Applied', `"${style}" bubble style selected!`)}
              >
                <Text style={styles.bubbleChipText}>{style}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Legal Link */}
        <TouchableOpacity style={styles.legalBtn} onPress={() => router.push('/legal')}>
          <Ionicons name="document-text-outline" size={18} color={Colors.primary} />
          <Text style={styles.legalText}>Legal Documents & Policies</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: Fonts.sizes.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  weatherSection: { padding: Spacing.base },
  section: { paddingHorizontal: Spacing.base, marginBottom: Spacing.xl },
  sectionTitle: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.textSecondary, marginBottom: Spacing.md, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: Spacing.md },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  featureCard: {
    width: '31%', backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center', gap: 6,
    ...Shadow.sm, borderWidth: 1, borderColor: Colors.borderLight,
  },
  featureIcon: { width: 52, height: 52, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  featureTitle: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  featureDesc: { fontSize: 10, color: Colors.textMuted, textAlign: 'center', lineHeight: 14 },
  wallpaperCard: { width: 100, alignItems: 'center', gap: 6 },
  wallpaperGrad: { width: 100, height: 80, borderRadius: Radius.md, borderWidth: 2, borderColor: Colors.border },
  wallpaperName: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, fontWeight: '500' },
  bubblesRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  bubbleChip: {
    paddingHorizontal: 18, paddingVertical: 9, borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight, borderWidth: 1.5, borderColor: Colors.primary,
  },
  bubbleChipText: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.primary },
  legalBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    marginHorizontal: Spacing.base, marginBottom: Spacing.xl,
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.base, ...Shadow.sm, borderWidth: 1, borderColor: Colors.borderLight,
  },
  legalText: { flex: 1, fontSize: Fonts.sizes.base, fontWeight: '600', color: Colors.primary },
});
