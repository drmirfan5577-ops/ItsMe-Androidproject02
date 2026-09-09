import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/hooks/useApp';
import ChatItem from '@/components/ui/ChatItem';
import CalendarWidget from '@/components/feature/CalendarWidget';
import WeatherWidget from '@/components/feature/WeatherWidget';
import { Colors, Fonts, Spacing, Radius, Shadow } from '@/constants/theme';
import { Chat } from '@/services/mockData';

const FILTERS = ['All', 'Unread', 'Favorites', 'Groups'];

export default function ChatsScreen() {
  const { chats, currentUser, language, pinnedChats, unreadNotifCount } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showWeather, setShowWeather] = useState(false);

  const filtered = chats.filter(c => {
    const matchSearch = c.contact.name.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' ? true :
      filter === 'Unread' ? c.unread > 0 :
      filter === 'Favorites' ? pinnedChats.includes(c.id) :
      false;
    return matchSearch && matchFilter;
  });

  const totalUnread = chats.reduce((acc, c) => acc + c.unread, 0);

  const renderChat = useCallback(({ item }: { item: Chat }) => (
    <ChatItem
      chat={item}
      pinned={pinnedChats.includes(item.id)}
      onPress={() => router.push(`/chat/${item.id}`)}
    />
  ), [pinnedChats]);

  return (
    <LinearGradient colors={['#E8FDF8', '#F4FFFB', '#FFFFFF']} style={{ flex: 1 }}>
      {/* Header */}
      <LinearGradient
        colors={['#128C7E', '#00A884', '#25D366']}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.appTitle}>It's Me</Text>
            {totalUnread > 0 && (
              <Text style={styles.unreadHint}>{totalUnread} unread messages</Text>
            )}
          </View>
          <View style={styles.headerRight}>
            <CalendarWidget language={language} compact />
            <TouchableOpacity style={styles.headerBtn} onPress={() => setShowWeather(!showWeather)}>
              <Ionicons name="partly-sunny" size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/profile')}>
              <View>
                <Image
                  source={{ uri: currentUser.avatar }}
                  style={styles.headerAvatar}
                  contentFit="cover"
                  transition={200}
                />
                {unreadNotifCount > 0 && <View style={styles.headerBadge} />}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Weather Banner */}
      {showWeather && (
        <View style={styles.weatherWrap}>
          <WeatherWidget />
        </View>
      )}

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={language === 'ur' ? 'تلاش کریں...' : 'Search or start new chat'}
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterActiveText]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Encryption notice */}
      <View style={styles.encNotice}>
        <Ionicons name="lock-closed" size={12} color={Colors.primary} />
        <Text style={styles.encNoticeText}>
          {language === 'ur' ? 'تمام پیغامات محفوظ ہیں' : 'Your personal messages are end-to-end encrypted'}
        </Text>
      </View>

      {/* Chats List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderChat}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="chat-sleep-outline" size={60} color={Colors.border} />
            <Text style={styles.emptyTitle}>No chats found</Text>
            <Text style={styles.emptyText}>Start a new conversation</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity style={[styles.fab, { bottom: 24 }]} activeOpacity={0.85} onPress={() => router.push('/profile')}>
        <LinearGradient colors={['#25D366', '#00A884']} style={styles.fabGrad}>
          <Ionicons name="chatbubble-ellipses" size={24} color={Colors.textInverse} />
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.md },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  appTitle: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  unreadHint: { fontSize: Fonts.sizes.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerAvatar: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)' },
  headerBadge: { position: 'absolute', top: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.error, borderWidth: 1.5, borderColor: '#25D366' },
  weatherWrap: { paddingHorizontal: Spacing.base, paddingTop: Spacing.sm },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, marginHorizontal: Spacing.base, marginVertical: Spacing.sm, borderRadius: Radius.full, paddingHorizontal: Spacing.md, ...Shadow.sm, borderWidth: 1, borderColor: Colors.borderLight },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: Fonts.sizes.base, color: Colors.textPrimary, paddingVertical: 11 },
  filterScroll: { maxHeight: 46 },
  filterContent: { paddingHorizontal: Spacing.base, gap: 8, alignItems: 'center', paddingVertical: 6 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.backgroundAlt, borderWidth: 1, borderColor: Colors.border },
  filterActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: Fonts.sizes.xs, fontWeight: '600', color: Colors.textSecondary },
  filterActiveText: { color: Colors.textInverse },
  encNotice: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 6 },
  encNoticeText: { fontSize: Fonts.sizes.xs, color: Colors.textMuted },
  listContent: { paddingBottom: 100 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.textSecondary },
  emptyText: { fontSize: Fonts.sizes.sm, color: Colors.textMuted },
  fab: { position: 'absolute', right: 20, borderRadius: 30, overflow: 'hidden', ...Shadow.lg },
  fabGrad: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center' },
});
