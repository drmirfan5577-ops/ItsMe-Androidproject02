import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/hooks/useApp';
import StoryRing from '@/components/ui/StoryRing';
import CalendarWidget from '@/components/feature/CalendarWidget';
import { Colors, Fonts, Spacing, Radius, Shadow } from '@/constants/theme';

export default function UpdatesScreen() {
  const { stories, currentUser, language } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'status' | 'channels'>('status');

  const CHANNELS = [
    { id: 'ch1', name: "It's Me Official", avatar: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=80&h=80&fit=crop', followers: '89.5K', lastUpdate: '2h ago', verified: true },
    { id: 'ch2', name: 'Islamic Daily', avatar: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=80&h=80&fit=crop', followers: '145K', lastUpdate: '1h ago', verified: true },
    { id: 'ch3', name: 'Tech Pakistan', avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=80&h=80&fit=crop', followers: '34.2K', lastUpdate: '3h ago', verified: false },
    { id: 'ch4', name: 'Weather Updates', avatar: 'https://images.unsplash.com/photo-1504608524841-42584120d693?w=80&h=80&fit=crop', followers: '22K', lastUpdate: '30m ago', verified: false },
  ];

  return (
    <LinearGradient colors={['#E8FDF8', '#F4FFFB', '#FFFFFF']} style={{ flex: 1 }}>
      {/* Header */}
      <LinearGradient
        colors={['#128C7E', '#00A884', '#25D366']}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Updates</Text>
          <CalendarWidget language={language} compact />
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'status' && styles.activeTab]}
          onPress={() => setActiveTab('status')}
        >
          <Text style={[styles.tabText, activeTab === 'status' && styles.activeTabText]}>
            {language === 'ur' ? 'اسٹیٹس' : 'Status'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'channels' && styles.activeTab]}
          onPress={() => setActiveTab('channels')}
        >
          <Text style={[styles.tabText, activeTab === 'channels' && styles.activeTabText]}>
            {language === 'ur' ? 'چینلز' : 'Channels'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'status' ? (
          <>
            {/* My Status */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                {language === 'ur' ? 'میرا اسٹیٹس' : 'My Status'}
              </Text>
              <TouchableOpacity style={styles.myStatusRow}>
                <View style={styles.addStatusWrap}>
                  <Image source={{ uri: currentUser.avatar }} style={styles.myAvatar} contentFit="cover" transition={200} />
                  <View style={styles.addDot}>
                    <Ionicons name="add" size={14} color={Colors.textInverse} />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.myStatusName}>
                    {language === 'ur' ? 'میری اسٹیٹس' : 'My status'}
                  </Text>
                  <Text style={styles.myStatusHint}>
                    {language === 'ur' ? 'اپنا اسٹیٹس ڈالیں' : 'Tap to add status update'}
                  </Text>
                </View>
                <Ionicons name="camera-outline" size={22} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Stories */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                {language === 'ur' ? 'حالیہ اپڈیٹس' : 'Recent Updates'}
              </Text>
              <View style={styles.storiesRow}>
                {stories.filter(s => !s.viewed).map(s => (
                  <StoryRing key={s.id} story={s} onPress={() => router.push(`/story/${s.id}`)} />
                ))}
              </View>
            </View>

            {/* Viewed */}
            {stories.some(s => s.viewed) && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  {language === 'ur' ? 'دیکھی گئی' : 'Viewed'}
                </Text>
                <View style={styles.storiesRow}>
                  {stories.filter(s => s.viewed).map(s => (
                    <StoryRing key={s.id} story={s} onPress={() => router.push(`/story/${s.id}`)} />
                  ))}
                </View>
              </View>
            )}
          </>
        ) : (
          /* Channels */
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {language === 'ur' ? 'چینلز' : 'Channels'}
            </Text>
            {CHANNELS.map(ch => (
              <TouchableOpacity key={ch.id} style={styles.channelCard}>
                <Image source={{ uri: ch.avatar }} style={styles.channelAvatar} contentFit="cover" transition={200} />
                <View style={{ flex: 1 }}>
                  <View style={styles.channelNameRow}>
                    <Text style={styles.channelName}>{ch.name}</Text>
                    {ch.verified && <MaterialIcons name="verified" size={14} color={Colors.primary} />}
                  </View>
                  <Text style={styles.channelMeta}>{ch.followers} followers · {ch.lastUpdate}</Text>
                </View>
                <TouchableOpacity style={styles.followBtn}>
                  <Text style={styles.followText}>Follow</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <LinearGradient colors={['#25D366', '#00A884']} style={styles.fabGrad}>
          <Ionicons name="pencil" size={22} color={Colors.textInverse} />
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: '#FFF' },
  tabRow: {
    flexDirection: 'row', backgroundColor: Colors.backgroundAlt,
    marginHorizontal: Spacing.base, marginVertical: Spacing.sm,
    borderRadius: Radius.xl, padding: 4,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Radius.lg },
  activeTab: { backgroundColor: Colors.surface, ...Shadow.sm },
  tabText: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.textMuted },
  activeTabText: { color: Colors.primaryDark },
  section: { paddingHorizontal: Spacing.base, marginBottom: Spacing.lg },
  sectionLabel: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  myStatusRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, ...Shadow.sm, borderWidth: 1, borderColor: Colors.borderLight,
  },
  addStatusWrap: { position: 'relative' },
  myAvatar: { width: 52, height: 52, borderRadius: 26 },
  addDot: {
    position: 'absolute', bottom: -2, right: -2,
    width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.surface,
  },
  myStatusName: { fontSize: Fonts.sizes.base, fontWeight: '600', color: Colors.textPrimary },
  myStatusHint: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  storiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  channelCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm,
    ...Shadow.sm, borderWidth: 1, borderColor: Colors.borderLight,
  },
  channelAvatar: { width: 46, height: 46, borderRadius: 23 },
  channelNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  channelName: { fontSize: Fonts.sizes.base, fontWeight: '600', color: Colors.textPrimary },
  channelMeta: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  followBtn: {
    backgroundColor: Colors.primaryLight, paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.primary,
  },
  followText: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.primary },
  fab: { position: 'absolute', bottom: 24, right: 20, borderRadius: 30, overflow: 'hidden', ...Shadow.lg },
  fabGrad: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center' },
});
