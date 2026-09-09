import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
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

export default function IHubScreen() {
  const { currentUser, language, chats, communities } = useApp();
  const { showAlert } = useAlert();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const totalUnread = chats.reduce((acc, c) => acc + c.unread, 0);
  const joinedCommunities = communities.filter(c => c.isJoined).length;

  const QUICK_ACTIONS = [
    { icon: 'person-outline', label: 'My Profile', color: '#00A884', action: () => router.push('/profile') },
    { icon: 'notifications-outline', label: 'Notifications', color: '#F0B429', action: () => showAlert('Notifications', 'All your notifications appear here. Real-time push in V2.0!') },
    { icon: 'shield-checkmark-outline', label: 'Privacy', color: '#2E86C1', action: () => showAlert('Privacy', 'E2E Encryption active. All messages are secure.') },
    { icon: 'star-outline', label: 'Starred', color: '#E74C3C', action: () => showAlert('Starred Messages', 'Your starred messages will appear here.') },
    { icon: 'archive-outline', label: 'Archived', color: '#7F8C8D', action: () => showAlert('Archived', 'Archived chats will appear here.') },
    { icon: 'qr-code-outline', label: 'My QR Code', color: '#9B59B6', action: () => showAlert("My QR Code", `Your It's Me ID: @DrMIrfan\n\nQR code generator coming in V2.0!`) },
  ];

  const MY_ID = '@DrMIrfan.2024';

  return (
    <LinearGradient colors={['#E8FDF8', '#F4FFFB', '#FFFFFF']} style={{ flex: 1 }}>
      <LinearGradient
        colors={['#128C7E', '#00A884', '#25D366']}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>I-Hub</Text>
          <CalendarWidget language={language} compact />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient colors={['#F0FDFB', '#E8FDF8']} style={styles.profileGrad}>
            <View style={styles.profileRow}>
              <View style={styles.profileAvatarWrap}>
                <Image source={{ uri: currentUser.avatar }} style={styles.profileAvatar} contentFit="cover" transition={200} />
                <View style={styles.onlineDot} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.profileName}>{currentUser.name}</Text>
                  <MaterialIcons name="verified" size={18} color={Colors.primary} />
                </View>
                <Text style={styles.profileStatus}>{currentUser.status}</Text>
                <View style={styles.idRow}>
                  <MaterialCommunityIcons name="identifier" size={13} color={Colors.gold} />
                  <Text style={styles.idText}>{MY_ID}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/profile')}>
                <Ionicons name="pencil" size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <LinearGradient colors={['#00A884', '#128C7E']} style={styles.statGrad}>
              <Text style={styles.statNum}>{chats.length}</Text>
              <Text style={styles.statLabel}>Chats</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={['#F0B429', '#D4940B']} style={styles.statGrad}>
              <Text style={styles.statNum}>{totalUnread}</Text>
              <Text style={styles.statLabel}>Unread</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={['#2E86C1', '#1A6FA3']} style={styles.statGrad}>
              <Text style={styles.statNum}>{joinedCommunities}</Text>
              <Text style={styles.statLabel}>Communities</Text>
            </LinearGradient>
          </View>
        </View>

        {/* ID Personalization Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'ur' ? 'میری شناخت' : 'My Identity'}
          </Text>
          <TouchableOpacity
            style={styles.idCard}
            onPress={() => showAlert("ID Personalization", "Customize your unique It's Me ID, badges, and display name in V2.0!")}
          >
            <LinearGradient colors={['#FFF9E6', '#FFFBF0']} style={styles.idCardGrad}>
              <View style={styles.idCardRow}>
                <View style={styles.idIconWrap}>
                  <LinearGradient colors={['#F6D365', '#F0B429']} style={styles.idIconGrad}>
                    <MaterialCommunityIcons name="crown" size={24} color="#FFF" />
                  </LinearGradient>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.idCardTitle}>It's Me Premium ID</Text>
                  <Text style={styles.idCardValue}>{MY_ID}</Text>
                  <Text style={styles.idCardHint}>Tap to personalize your identity</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.gold} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'ur' ? 'فوری رسائی' : 'Quick Access'}
          </Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action, idx) => (
              <TouchableOpacity key={idx} style={styles.actionItem} onPress={action.action} activeOpacity={0.8}>
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Encryption Badge */}
        <View style={styles.encCard}>
          <Ionicons name="shield-checkmark" size={28} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.encTitle}>End-to-End Encrypted</Text>
            <Text style={styles.encDesc}>
              {language === 'ur'
                ? 'آپ کی تمام گفتگو مکمل طور پر محفوظ ہے'
                : "All your conversations are fully encrypted. Only you and your contacts can read them."}
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: '#FFF' },
  profileCard: { margin: Spacing.base, borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.md, borderWidth: 1, borderColor: Colors.borderLight },
  profileGrad: { padding: Spacing.base },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  profileAvatarWrap: { position: 'relative' },
  profileAvatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 3, borderColor: Colors.primary },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: Colors.online, borderWidth: 2, borderColor: Colors.surface },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  profileName: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.textPrimary },
  profileStatus: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, marginBottom: 4 },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  idText: { fontSize: Fonts.sizes.xs, fontWeight: '600', color: Colors.gold },
  editBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', paddingHorizontal: Spacing.base, gap: Spacing.sm, marginBottom: Spacing.base },
  statCard: { flex: 1, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.sm },
  statGrad: { padding: Spacing.md, alignItems: 'center' },
  statNum: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: '#FFF' },
  statLabel: { fontSize: Fonts.sizes.xs, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  section: { paddingHorizontal: Spacing.base, marginBottom: Spacing.base },
  sectionTitle: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  idCard: { borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.gold, borderWidth: 1, borderColor: '#F0D58A' },
  idCardGrad: { padding: Spacing.base },
  idCardRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  idIconWrap: { borderRadius: Radius.lg, overflow: 'hidden' },
  idIconGrad: { width: 50, height: 50, alignItems: 'center', justifyContent: 'center' },
  idCardTitle: { fontSize: Fonts.sizes.base, fontWeight: '700', color: Colors.textPrimary },
  idCardValue: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.gold, marginTop: 2 },
  idCardHint: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  actionItem: { width: '30%', alignItems: 'center', gap: 8 },
  actionIcon: { width: 54, height: 54, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: Fonts.sizes.xs, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
  encCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    marginHorizontal: Spacing.base, marginBottom: Spacing.base,
    backgroundColor: Colors.primaryLight, borderRadius: Radius.lg,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.border,
  },
  encTitle: { fontSize: Fonts.sizes.base, fontWeight: '700', color: Colors.primaryDark },
  encDesc: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 3, lineHeight: 17 },
});
