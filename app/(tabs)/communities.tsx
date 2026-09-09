import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';
import CalendarWidget from '@/components/feature/CalendarWidget';
import { Colors, Fonts, Spacing, Radius, Shadow } from '@/constants/theme';
import { Community } from '@/services/mockData';

export default function CommunitiesScreen() {
  const { communities, joinCommunity, requestJoinCommunity, language } = useApp();
  const { showAlert } = useAlert();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'joined'>('all');

  const filtered = communities.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === 'joined' ? c.isJoined : true;
    return matchSearch && matchTab;
  });

  const formatMembers = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;

  const t = language === 'ur'
    ? { all: 'سب', joined: 'میرے گروپس', create: 'نیا', chat: 'چیٹ', call: 'کال' }
    : language === 'ar'
    ? { all: 'الكل', joined: 'مجتمعاتي', create: 'جديد', chat: 'دردشة', call: 'مكالمة' }
    : { all: 'All', joined: 'Joined', create: 'New', chat: 'Chat', call: 'Call' };

  const renderCommunity = ({ item }: { item: Community }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardMain}
        activeOpacity={0.85}
        onPress={() => router.push(`/community/${item.id}`)}
      >
        <Image source={{ uri: item.avatar }} style={styles.cardAvatar} contentFit="cover" transition={200} />
        <View style={styles.cardBody}>
          <View style={styles.cardNameRow}>
            <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
            {item.isAdmin && <View style={styles.adminBadge}><MaterialCommunityIcons name="crown" size={10} color={Colors.gold} /><Text style={styles.adminBadgeText}>Admin</Text></View>}
          </View>
          <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
          <View style={styles.cardMeta}>
            <Ionicons name="people-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.cardMetaText}>{formatMembers(item.members)} members</Text>
            <View style={styles.dot} />
            <Text style={styles.cardMetaText}>{item.lastActivity}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Actions row */}
      <View style={styles.cardActionsRow}>
        {item.isJoined ? (
          <>
            <TouchableOpacity
              style={styles.actionChip}
              onPress={() => router.push(`/community/${item.id}`)}
            >
              <LinearGradient colors={['#25D366', '#00A884']} style={styles.actionChipGrad}>
                <Ionicons name="chatbubbles-outline" size={14} color="#FFF" />
                <Text style={styles.actionChipText}>{t.chat}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionChip}
              onPress={() => router.push(`/call/${item.id}?type=group-voice&name=${encodeURIComponent(item.name)}&avatar=${encodeURIComponent(item.avatar)}`)}
            >
              <LinearGradient colors={['#3498DB', '#2E86C1']} style={styles.actionChipGrad}>
                <Ionicons name="call-outline" size={14} color="#FFF" />
                <Text style={styles.actionChipText}>{t.call}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <View style={styles.joinedBadge}>
              <Ionicons name="checkmark-circle" size={15} color={Colors.primary} />
              <Text style={styles.joinedText}>Joined</Text>
            </View>
          </>
        ) : item.requestPending ? (
          <View style={styles.pendingBadge}>
            <Ionicons name="time-outline" size={15} color={Colors.warning} />
            <Text style={styles.pendingText}>Pending Request</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.joinBtn}
            onPress={() => {
              joinCommunity(item.id);
              showAlert('Joined!', `Welcome to "${item.name}"! Tap Chat to start participating.`);
            }}
          >
            <LinearGradient colors={['#25D366', '#00A884']} style={styles.joinGrad}>
              <Ionicons name="add-circle-outline" size={14} color="#FFF" />
              <Text style={styles.joinText}>Join Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#E8FDF8', '#F4FFFB', '#FFFFFF']} style={{ flex: 1 }}>
      <LinearGradient
        colors={['#128C7E', '#00A884', '#25D366']}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>
            {language === 'ur' ? 'کمیونٹیز' : language === 'ar' ? 'المجتمعات' : 'Communities'}
          </Text>
          <CalendarWidget language={language} compact />
        </View>
      </LinearGradient>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder={language === 'ur' ? 'تلاش کریں...' : language === 'ar' ? 'بحث...' : 'Search communities...'}
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tabBtn, tab === 'all' && styles.tabActive]} onPress={() => setTab('all')}>
          <Text style={[styles.tabText, tab === 'all' && styles.tabActiveText]}>{t.all}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, tab === 'joined' && styles.tabActive]} onPress={() => setTab('joined')}>
          <Text style={[styles.tabText, tab === 'joined' && styles.tabActiveText]}>{t.joined}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderCommunity}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons name="account-group-outline" size={60} color={Colors.border} />
            <Text style={styles.emptyText}>No communities found</Text>
          </View>
        }
      />

      {/* Create FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => showAlert(t.create + ' Community', 'Create your own community with admin controls. Feature available in V2.0!')}
      >
        <LinearGradient colors={['#F6D365', '#F0B429']} style={styles.fabGrad}>
          <Ionicons name="add" size={28} color={Colors.textInverse} />
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: '#FFF' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, margin: Spacing.base, borderRadius: Radius.full, paddingHorizontal: Spacing.md, ...Shadow.sm, borderWidth: 1, borderColor: Colors.borderLight },
  searchInput: { flex: 1, fontSize: Fonts.sizes.base, color: Colors.textPrimary, paddingVertical: 11 },
  tabRow: { flexDirection: 'row', backgroundColor: Colors.backgroundAlt, marginHorizontal: Spacing.base, marginBottom: Spacing.sm, borderRadius: Radius.xl, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: Radius.lg },
  tabActive: { backgroundColor: Colors.surface, ...Shadow.sm },
  tabText: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.textMuted },
  tabActiveText: { color: Colors.primaryDark },
  list: { paddingHorizontal: Spacing.base, paddingBottom: 100, gap: Spacing.sm },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, ...Shadow.sm, borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden' },
  cardMain: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, padding: Spacing.md },
  cardAvatar: { width: 54, height: 54, borderRadius: 12 },
  cardBody: { flex: 1, gap: 4 },
  cardNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardName: { fontSize: Fonts.sizes.base, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
  adminBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: Colors.goldLight, paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radius.full },
  adminBadgeText: { fontSize: 9, fontWeight: '700', color: Colors.textGold },
  cardDesc: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, lineHeight: 16 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMetaText: { fontSize: 10, color: Colors.textMuted },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.border },
  cardActionsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, paddingTop: 4 },
  actionChip: { borderRadius: Radius.full, overflow: 'hidden' },
  actionChipGrad: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 7 },
  actionChipText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  joinedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 'auto' },
  joinedText: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.primary },
  pendingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pendingText: { fontSize: Fonts.sizes.xs, fontWeight: '600', color: Colors.warning },
  joinBtn: { borderRadius: Radius.full, overflow: 'hidden' },
  joinGrad: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 16, paddingVertical: 8 },
  joinText: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: '#FFF' },
  fab: { position: 'absolute', bottom: 24, right: 20, borderRadius: 30, overflow: 'hidden', ...Shadow.gold },
  fabGrad: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center' },
  emptyWrap: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: Fonts.sizes.sm, color: Colors.textMuted },
});
