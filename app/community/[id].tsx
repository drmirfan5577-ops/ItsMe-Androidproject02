import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';
import { Colors, Fonts, Spacing, Radius, Shadow } from '@/constants/theme';
import { messageService } from '@/services/backendService';

// ── Mock community posts ───────────────────────────────────────────────────────
const MOCK_ANNOUNCEMENTS = [
  { id: 'ann1', type: 'announcement', user: 'Admin', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=80&q=80', text: '🌟 Welcome to the community! Share knowledge, help others, and grow together. JazakAllah Khair!', time: '2 days ago', pinned: true },
  { id: 'ann2', type: 'announcement', user: 'Moderator', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', text: '📌 Rules: Be respectful, no spam, only relevant content. May Allah bless us all. ☪', time: '1 day ago', pinned: true },
];

const MOCK_POSTS = [
  { id: 'p1', type: 'post', user: 'Brother Ahmad', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80', text: 'Assalamu Alaikum everyone! 🤲 May Allah bless this community with guidance and knowledge.', time: '3 hrs ago', likes: 24, replies: 5 },
  { id: 'p2', type: 'post', user: 'Sister Fatima', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', text: 'Sharing a beautiful Hadith: "The best among you are those who have the best manners and character." — Prophet Muhammad ﷺ', time: '5 hrs ago', likes: 89, replies: 12 },
  { id: 'p3', type: 'post', user: 'Dr. Hassan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', text: '🌙 Reminder: Friday Jummah is tomorrow. Let us pray for each other and for the ummah. InshAllah!', time: '8 hrs ago', likes: 156, replies: 28 },
  { id: 'p4', type: 'post', user: 'Abdullah Khan', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&q=80', text: "Good morning to all community members! It's a great day to learn something new. What topic shall we discuss today?", time: '10 hrs ago', likes: 34, replies: 9 },
];

type PostItem = typeof MOCK_POSTS[0] | typeof MOCK_ANNOUNCEMENTS[0];

export default function CommunityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { communities, currentUser, language } = useApp();
  const { showAlert } = useAlert();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatRef = useRef<FlatList>(null);
  const [text, setText] = useState('');
  const [posts, setPosts] = useState<any[]>([...MOCK_ANNOUNCEMENTS, ...MOCK_POSTS]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'chat' | 'announcements' | 'members'>('chat');

  const community = communities.find(c => c.id === id) ?? {
    id: id ?? '',
    name: 'Community',
    description: 'A vibrant community',
    avatar: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150&h=150&fit=crop',
    members: 1000,
    isJoined: true,
    isAdmin: false,
    category: 'General',
    lastActivity: 'Recently',
    requestPending: false,
  };

  const handleSend = useCallback(() => {
    if (!text.trim()) return;
    const newPost = {
      id: `p_${Date.now()}`,
      type: 'post',
      user: currentUser.name,
      avatar: currentUser.avatar,
      text: text.trim(),
      time: 'Just now',
      likes: 0,
      replies: 0,
    };
    setPosts(prev => [...prev, newPost]);
    setText('');
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 200);
  }, [text, currentUser]);

  const toggleLike = useCallback((postId: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId); else next.add(postId);
      return next;
    });
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, likes: (p.likes ?? 0) + (likedPosts.has(postId) ? -1 : 1) } : p
    ));
  }, [likedPosts]);

  const displayedPosts = activeTab === 'announcements'
    ? posts.filter(p => p.type === 'announcement')
    : activeTab === 'chat'
    ? posts
    : [];

  const t = {
    en: { writePost: 'Write a post or ask a question...', members: 'Members', announcements: 'Announcements', chat: 'Discussion', share: 'Share', like: 'Like', reply: 'Reply' },
    ur: { writePost: 'کوئی سوال یا پوسٹ لکھیں...', members: 'اعضاء', announcements: 'اعلانات', chat: 'بحث', share: 'شیئر', like: 'پسند', reply: 'جواب' },
    ar: { writePost: 'اكتب منشوراً أو اطرح سؤالاً...', members: 'الأعضاء', announcements: 'الإعلانات', chat: 'النقاش', share: 'مشاركة', like: 'إعجاب', reply: 'رد' },
  }[language] ?? { writePost: 'Write a post...', members: 'Members', announcements: 'Announcements', chat: 'Discussion', share: 'Share', like: 'Like', reply: 'Reply' };

  const renderPost = useCallback(({ item }: { item: any }) => {
    const isAnnouncement = item.type === 'announcement';
    const isLiked = likedPosts.has(item.id);
    return (
      <View style={[styles.postCard, isAnnouncement && styles.announcementCard]}>
        {isAnnouncement && (
          <View style={styles.announcementBanner}>
            <Ionicons name="megaphone" size={12} color={Colors.gold} />
            <Text style={styles.announcementLabel}>ANNOUNCEMENT {item.pinned ? '· PINNED 📌' : ''}</Text>
          </View>
        )}
        <View style={styles.postHeader}>
          <Image source={{ uri: item.avatar }} style={styles.postAvatar} contentFit="cover" transition={200} />
          <View style={{ flex: 1 }}>
            <View style={styles.postNameRow}>
              <Text style={styles.postUser}>{item.user}</Text>
              {isAnnouncement && (
                <View style={styles.adminTag}>
                  <MaterialCommunityIcons name="crown" size={10} color={Colors.gold} />
                  <Text style={styles.adminTagText}>Admin</Text>
                </View>
              )}
            </View>
            <Text style={styles.postTime}>{item.time}</Text>
          </View>
          <TouchableOpacity onPress={() => showAlert('Options', 'Report · Copy · Share')} style={styles.postMore}>
            <Ionicons name="ellipsis-horizontal" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={styles.postText}>{item.text}</Text>

        {!isAnnouncement && (
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.postAction} onPress={() => toggleLike(item.id)}>
              <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={18} color={isLiked ? '#E74C3C' : Colors.textMuted} />
              <Text style={[styles.postActionText, isLiked && { color: '#E74C3C' }]}>{(item.likes ?? 0) + (isLiked ? 1 : 0)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction} onPress={() => showAlert('Reply', 'Thread replies available in V2.0!')}>
              <Ionicons name="chatbubble-outline" size={17} color={Colors.textMuted} />
              <Text style={styles.postActionText}>{item.replies ?? 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction} onPress={() => showAlert('Share', 'Share this post with your contacts!')}>
              <Ionicons name="share-social-outline" size={18} color={Colors.textMuted} />
              <Text style={styles.postActionText}>{t.share}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }, [likedPosts, t]);

  return (
    <View style={{ flex: 1, backgroundColor: '#E8FDF8' }}>
      {/* Header */}
      <LinearGradient
        colors={['#128C7E', '#00A884', '#25D366']}
        style={[styles.header, { paddingTop: insets.top + 4 }]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Image source={{ uri: community.avatar }} style={styles.headerAvatar} contentFit="cover" transition={200} />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerName}>{community.name}</Text>
          <Text style={styles.headerSub}>{(community.members ?? 0).toLocaleString()} members · {community.category}</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn} onPress={() => showAlert('Community Info', `${community.name}\n\n${community.description}\n\nCategory: ${community.category}\nMembers: ${(community.members ?? 0).toLocaleString()}`)}>
          <Ionicons name="information-circle-outline" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => router.push(`/call/${id}?type=video&name=${encodeURIComponent(community.name)}&avatar=${encodeURIComponent(community.avatar)}`)}
        >
          <Ionicons name="videocam-outline" size={22} color="#FFF" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Sub-tabs */}
      <View style={styles.subTabs}>
        {(['chat', 'announcements', 'members'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.subTab, activeTab === tab && styles.subTabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.subTabText, activeTab === tab && styles.subTabActiveText]}>
              {tab === 'chat' ? t.chat : tab === 'announcements' ? t.announcements : t.members}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'members' ? (
        <View style={styles.membersPlaceholder}>
          <MaterialCommunityIcons name="account-group" size={64} color={Colors.border} />
          <Text style={styles.membersTitle}>{(community.members ?? 0).toLocaleString()} Members</Text>
          <Text style={styles.membersSubtitle}>Member list management in V2.0</Text>
          <TouchableOpacity
            style={styles.inviteBtn}
            onPress={() => showAlert('Invite', 'Share community invite link with friends!')}
          >
            <LinearGradient colors={['#25D366', '#00A884']} style={styles.inviteGrad}>
              <Ionicons name="person-add-outline" size={18} color="#FFF" />
              <Text style={styles.inviteText}>Invite Members</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            ref={flatRef}
            data={displayedPosts}
            keyExtractor={item => item.id}
            renderItem={renderPost}
            contentContainerStyle={styles.postList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Ionicons name="chatbubbles-outline" size={52} color={Colors.border} />
                <Text style={styles.emptyText}>No posts yet. Be the first!</Text>
              </View>
            }
          />

          {/* Input */}
          {community.isJoined ? (
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
                <Image source={{ uri: currentUser.avatar }} style={styles.inputAvatar} contentFit="cover" transition={200} />
                <TextInput
                  style={styles.input}
                  placeholder={t.writePost}
                  placeholderTextColor={Colors.textMuted}
                  value={text}
                  onChangeText={setText}
                  multiline
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={!text.trim()}>
                  <LinearGradient
                    colors={text.trim() ? ['#25D366', '#00A884'] : [Colors.border, Colors.border]}
                    style={styles.sendGrad}
                  >
                    <Ionicons name="send" size={18} color="#FFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          ) : (
            <View style={[styles.notMemberBar, { paddingBottom: insets.bottom + 8 }]}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} />
              <Text style={styles.notMemberText}>Join this community to post</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing.sm, paddingBottom: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  headerAvatar: { width: 38, height: 38, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  headerName: { fontSize: Fonts.sizes.base, fontWeight: '700', color: '#FFF' },
  headerSub: { fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 1 },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  subTabs: { flexDirection: 'row', backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  subTab: { flex: 1, paddingVertical: 11, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  subTabActive: { borderBottomColor: Colors.primary },
  subTabText: { fontSize: Fonts.sizes.xs, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  subTabActiveText: { color: Colors.primary },
  postList: { padding: Spacing.sm, paddingBottom: 100, gap: Spacing.sm },
  postCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, ...Shadow.sm, borderWidth: 1, borderColor: Colors.borderLight },
  announcementCard: { borderColor: '#F0D58A', backgroundColor: Colors.goldLight },
  announcementBanner: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  announcementLabel: { fontSize: 10, fontWeight: '700', color: Colors.gold, letterSpacing: 0.8 },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  postAvatar: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: Colors.borderLight },
  postNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  postUser: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.textPrimary },
  adminTag: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: Colors.goldLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.full },
  adminTagText: { fontSize: 9, fontWeight: '700', color: Colors.textGold },
  postTime: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  postMore: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  postText: { fontSize: Fonts.sizes.sm, color: Colors.textPrimary, lineHeight: 22, marginBottom: Spacing.sm },
  postActions: { flexDirection: 'row', gap: Spacing.lg, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.divider },
  postAction: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  postActionText: { fontSize: Fonts.sizes.xs, fontWeight: '600', color: Colors.textMuted },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: Spacing.sm, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.divider },
  inputAvatar: { width: 34, height: 34, borderRadius: 17 },
  input: { flex: 1, backgroundColor: Colors.backgroundAlt, borderRadius: Radius.xl, paddingHorizontal: Spacing.md, paddingVertical: 10, fontSize: Fonts.sizes.sm, color: Colors.textPrimary, maxHeight: 100, borderWidth: 1, borderColor: Colors.border },
  sendBtn: { borderRadius: 20, overflow: 'hidden' },
  sendGrad: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  notMemberBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: Spacing.base, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.divider },
  notMemberText: { fontSize: Fonts.sizes.sm, color: Colors.textMuted },
  membersPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  membersTitle: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: Colors.textPrimary },
  membersSubtitle: { fontSize: Fonts.sizes.sm, color: Colors.textMuted },
  inviteBtn: { borderRadius: Radius.xl, overflow: 'hidden', marginTop: Spacing.sm },
  inviteGrad: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: Spacing.xl, paddingVertical: 13 },
  inviteText: { fontSize: Fonts.sizes.base, fontWeight: '700', color: '#FFF' },
  emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: Fonts.sizes.sm, color: Colors.textMuted },
});
