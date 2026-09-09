import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch,
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
import { adminService } from '@/services/backendService';

export default function AdminScreen() {
  const { isAdminUnlocked, unlockAdmin, lockAdmin, language, unreadNotifCount } = useApp();
  const { showAlert } = useAlert();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [stats, setStats] = useState({ users: 0, messages: 0 });
  const [statsLoaded, setStatsLoaded] = useState(false);

  const handleUnlock = () => {
    const ok = unlockAdmin(password);
    if (ok) {
      setError('');
      setPassword('');
      // Load real stats
      Promise.all([adminService.getTotalUsers(), adminService.getTotalMessages()])
        .then(([users, messages]) => { setStats({ users, messages }); setStatsLoaded(true); });
    } else {
      setError('Incorrect password. Access denied.');
      setPassword('');
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastTitle.trim() || !broadcastMsg.trim()) {
      showAlert('Required', 'Please enter both title and message');
      return;
    }
    setBroadcasting(true);
    await adminService.broadcastNotification(broadcastTitle, broadcastMsg);
    setBroadcasting(false);
    setBroadcastTitle('');
    setBroadcastMsg('');
    showAlert('Broadcast Sent!', 'Notification sent to all registered users successfully.');
  };

  const ADMIN_STATS = [
    { label: 'Total Users', value: statsLoaded ? stats.users.toLocaleString() : '—', icon: 'people-outline', color: '#00A884' },
    { label: 'Messages', value: statsLoaded ? stats.messages.toLocaleString() : '—', icon: 'chatbubbles-outline', color: '#2E86C1' },
    { label: 'Notifications', value: unreadNotifCount.toString(), icon: 'notifications-outline', color: '#F0B429' },
    { label: 'Communities', value: '5', icon: 'grid-outline', color: '#9B59B6' },
  ];

  const ADMIN_ACTIONS = [
    { label: 'Manage Users', icon: 'people-outline', color: '#00A884', action: () => showAlert('User Management', 'View all users in OnSpace Cloud Dashboard → Data → user_profiles') },
    { label: 'Database Explorer', icon: 'server-outline', color: '#2E86C1', action: () => showAlert('Database', 'Access full database via OnSpace Cloud Dashboard → Data tab') },
    { label: 'Enable/Disable Features', icon: 'toggle-outline', color: '#27AE60', action: () => showAlert('Feature Flags', 'Toggle features in app_settings table via OnSpace Cloud Dashboard') },
    { label: 'App Analytics', icon: 'analytics-outline', color: '#8E44AD', action: () => showAlert('Analytics', 'View usage stats in OnSpace Cloud Dashboard → Log tab') },
    { label: 'Community Moderation', icon: 'shield-outline', color: '#3498DB', action: () => showAlert('Moderation', 'Manage communities in OnSpace Cloud Dashboard → Data → communities') },
    { label: 'Legal Document Editor', icon: 'document-text-outline', color: '#16A085', action: () => showAlert('Legal Editor', 'Edit legal documents in the Legal & About section') },
    { label: 'Storage Manager', icon: 'cloud-outline', color: '#E74C3C', action: () => showAlert('Storage', 'Manage all files in OnSpace Cloud Dashboard → Storage tab') },
    { label: 'Edge Functions', icon: 'code-slash-outline', color: '#7F8C8D', action: () => showAlert('Edge Functions', 'View deployed functions in OnSpace Cloud Dashboard → Edge Functions') },
    { label: 'Downloads & APK Export', icon: 'download-outline', color: '#00A884', action: () => router.push('/legal') },
  ];

  return (
    <LinearGradient colors={['#FFF9E6', '#FFFBF0', '#FFFFFF']} style={{ flex: 1 }}>
      <LinearGradient
        colors={['#B7860B', '#D4940B', '#F0B429']}
        style={[styles.header, { paddingTop: insets.top + 4 }]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <MaterialCommunityIcons name="crown" size={22} color="#FFF" />
          <Text style={styles.headerTitle}>Owner Admin Panel</Text>
        </View>
        {isAdminUnlocked && (
          <TouchableOpacity style={styles.lockBtn} onPress={() => { lockAdmin(); router.back(); }}>
            <Ionicons name="lock-closed-outline" size={22} color="#FFF" />
          </TouchableOpacity>
        )}
      </LinearGradient>

      {!isAdminUnlocked ? (
        <View style={styles.lockScreen}>
          <View style={styles.lockCard}>
            <View style={styles.lockIconWrap}>
              <LinearGradient colors={['#F6D365', '#F0B429']} style={styles.lockIconGrad}>
                <MaterialCommunityIcons name="crown" size={40} color="#FFF" />
              </LinearGradient>
            </View>
            <Text style={styles.lockTitle}>Owner Access Only</Text>
            <Text style={styles.lockDesc}>
              {language === 'ur'
                ? 'یہ سیکشن صرف مالک کے لیے ہے۔ پاس ورڈ درج کریں۔'
                : 'Exclusively for Dr M Irfan Qadir Thaheem. Enter the owner password.'}
            </Text>
            {error.length > 0 && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            <View style={styles.pwWrap}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.gold} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.pwInput}
                placeholder="Enter owner password..."
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.unlockBtn} onPress={handleUnlock} activeOpacity={0.85}>
              <LinearGradient colors={['#F6D365', '#F0B429', '#D4940B']} style={styles.unlockGrad}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#FFF" />
                <Text style={styles.unlockText}>Unlock Admin Panel</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.hint}>Default Password: ItsMe@Admin2024</Text>
          </View>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.welcomeBanner}>
            <MaterialCommunityIcons name="crown" size={24} color={Colors.gold} />
            <View style={{ flex: 1 }}>
              <Text style={styles.welcomeTitle}>Welcome, Owner</Text>
              <Text style={styles.welcomeDesc}>Dr M Irfan Qadir Thaheem · Full control · OnSpace Cloud Backend</Text>
            </View>
          </View>

          {/* Real Stats */}
          <View style={styles.statsGrid}>
            {ADMIN_STATS.map((s, i) => (
              <View key={i} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${s.color}20` }]}>
                  <Ionicons name={s.icon as any} size={22} color={s.color} />
                </View>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Global Broadcast */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BROADCAST TO ALL USERS</Text>
            <View style={styles.broadcastCard}>
              <LinearGradient colors={['#FFF9E6', '#FFFBF0']} style={styles.broadcastGrad}>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.broadInput}
                    placeholder="Notification title..."
                    placeholderTextColor={Colors.textMuted}
                    value={broadcastTitle}
                    onChangeText={setBroadcastTitle}
                  />
                </View>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={[styles.broadInput, { minHeight: 80 }]}
                    placeholder="Notification message..."
                    placeholderTextColor={Colors.textMuted}
                    value={broadcastMsg}
                    onChangeText={setBroadcastMsg}
                    multiline
                  />
                </View>
                <TouchableOpacity style={styles.broadcastBtn} onPress={handleBroadcast} disabled={broadcasting} activeOpacity={0.85}>
                  <LinearGradient colors={['#F6D365', '#F0B429']} style={styles.broadcastBtnGrad}>
                    <Ionicons name="megaphone-outline" size={18} color="#FFF" />
                    <Text style={styles.broadcastBtnText}>{broadcasting ? 'Sending...' : 'Send Global Notification'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ADMIN ACTIONS</Text>
            <View style={styles.actionsCard}>
              {ADMIN_ACTIONS.map((a, i) => (
                <View key={i}>
                  <TouchableOpacity style={styles.actionRow} onPress={a.action} activeOpacity={0.75}>
                    <View style={[styles.actionIcon, { backgroundColor: `${a.color}20` }]}>
                      <Ionicons name={a.icon as any} size={20} color={a.color} />
                    </View>
                    <Text style={styles.actionLabel}>{a.label}</Text>
                    <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                  </TouchableOpacity>
                  {i < ADMIN_ACTIONS.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>

          {/* APK Export */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📦 APK EXPORT & DOWNLOAD</Text>
            <View style={styles.apkCard}>
              <LinearGradient colors={['#E8FDF8', '#D4F7EE']} style={styles.apkGrad}>
                <View style={styles.apkRow}>
                  <Ionicons name="phone-portrait-outline" size={28} color={Colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.apkTitle}>Export Android APK</Text>
                    <Text style={styles.apkDesc}>Use OnSpace toolbar (top-right) → Download button → "Android APK" to build and download your APK instantly.</Text>
                  </View>
                </View>
                <View style={styles.apkSteps}>
                  {['1. Click ⬇️ Download button in top-right toolbar', '2. Select "Android APK" option', '3. Wait for EAS build (3–5 min)', '4. APK downloads to your device', '5. Install via Android Settings → Unknown Sources'].map((step, i) => (
                    <View key={i} style={styles.apkStep}>
                      <Ionicons name="checkmark-circle-outline" size={14} color={Colors.primary} />
                      <Text style={styles.apkStepText}>{step}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={styles.apkBtn} onPress={() => router.push('/legal')} activeOpacity={0.85}>
                  <LinearGradient colors={['#25D366', '#00A884']} style={styles.apkBtnGrad}>
                    <Ionicons name="document-text-outline" size={18} color="#FFF" />
                    <Text style={styles.apkBtnText}>Download Links & Docs</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>

          {/* Ownership */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OWNERSHIP & BACKEND INFO</Text>
            <View style={styles.ownerCard}>
              <LinearGradient colors={['#FFF9E6', '#FFF0C0']} style={styles.ownerGrad}>
                {[
                  { label: 'Owner', value: 'Dr M Irfan Qadir Thaheem' },
                  { label: 'App Name', value: "It's Me" },
                  { label: 'Version', value: 'v1.0.0 (Build 1)' },
                  { label: 'Platform', value: 'iOS / Android / Web' },
                  { label: 'Backend', value: 'OnSpace Cloud (Supabase)' },
                  { label: 'Database', value: 'PostgreSQL (8 tables)' },
                  { label: 'Auth', value: 'Email / OTP / Google' },
                  { label: 'Notifications', value: 'Expo Push + Local' },
                  { label: 'E2E Encryption', value: 'Signal Protocol (V2.0)' },
                  { label: 'Admin Password', value: 'ItsMe@Admin2024' },
                ].map((item, i) => (
                  <View key={i} style={styles.ownerRow}>
                    <Text style={styles.ownerLabel}>{item.label}</Text>
                    <Text style={styles.ownerValue}>{item.value}</Text>
                  </View>
                ))}
              </LinearGradient>
            </View>
          </View>
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.sm, paddingBottom: Spacing.md, gap: 8 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: '#FFF' },
  lockBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  lockScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  lockCard: { backgroundColor: Colors.surface, borderRadius: Radius.xxl, padding: Spacing.xl, alignItems: 'center', gap: Spacing.md, ...Shadow.lg, borderWidth: 1, borderColor: '#F0D58A', width: '100%' },
  lockIconWrap: { borderRadius: Radius.xl, overflow: 'hidden', marginBottom: Spacing.sm },
  lockIconGrad: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  lockTitle: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: Colors.textPrimary },
  lockDesc: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FDEDEC', borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, width: '100%', borderWidth: 1, borderColor: '#FADBD8' },
  errorText: { fontSize: Fonts.sizes.sm, color: Colors.error, flex: 1 },
  pwWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.backgroundAlt, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, borderWidth: 1.5, borderColor: Colors.gold, width: '100%' },
  pwInput: { flex: 1, fontSize: Fonts.sizes.base, color: Colors.textPrimary, paddingVertical: 14 },
  unlockBtn: { borderRadius: Radius.xl, overflow: 'hidden', width: '100%', ...Shadow.gold },
  unlockGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15 },
  unlockText: { fontSize: Fonts.sizes.md, fontWeight: '800', color: '#FFF' },
  hint: { fontSize: Fonts.sizes.xs, color: Colors.textMuted },
  welcomeBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, margin: Spacing.base, backgroundColor: Colors.goldLight, borderRadius: Radius.lg, padding: Spacing.base, borderWidth: 1, borderColor: '#F0D58A' },
  welcomeTitle: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.textGold },
  welcomeDesc: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.base, gap: Spacing.sm, marginBottom: Spacing.base },
  statCard: { width: '47%', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', gap: 6, ...Shadow.sm, borderWidth: 1, borderColor: Colors.borderLight },
  statIcon: { width: 46, height: 46, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, fontWeight: '600', textAlign: 'center' },
  section: { paddingHorizontal: Spacing.base, marginBottom: Spacing.base },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, marginBottom: 8, letterSpacing: 1 },
  broadcastCard: { borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.gold, borderWidth: 1, borderColor: '#F0D58A' },
  broadcastGrad: { padding: Spacing.base, gap: Spacing.sm },
  inputWrap: { backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border },
  broadInput: { padding: Spacing.md, fontSize: Fonts.sizes.base, color: Colors.textPrimary },
  broadcastBtn: { borderRadius: Radius.lg, overflow: 'hidden' },
  broadcastBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 13 },
  broadcastBtnText: { fontSize: Fonts.sizes.base, fontWeight: '700', color: '#FFF' },
  actionsCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, ...Shadow.sm, borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden' },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.base, paddingVertical: 14 },
  actionIcon: { width: 36, height: 36, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { flex: 1, fontSize: Fonts.sizes.base, fontWeight: '600', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.divider, marginLeft: 68 },
  ownerCard: { borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.gold, borderWidth: 1, borderColor: '#F0D58A' },
  ownerGrad: { padding: Spacing.base, gap: 12 },
  ownerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ownerLabel: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, fontWeight: '600' },
  ownerValue: { fontSize: Fonts.sizes.sm, color: Colors.textPrimary, fontWeight: '700', textAlign: 'right', flex: 1, marginLeft: 8 },
  apkCard: { borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.borderLight, ...Shadow.sm },
  apkGrad: { padding: Spacing.base, gap: Spacing.sm },
  apkRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start', marginBottom: Spacing.sm },
  apkTitle: { fontSize: Fonts.sizes.base, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  apkDesc: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, lineHeight: 18 },
  apkSteps: { gap: 6, marginBottom: Spacing.sm },
  apkStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  apkStepText: { fontSize: Fonts.sizes.xs, color: Colors.textPrimary, flex: 1, lineHeight: 17 },
  apkBtn: { borderRadius: Radius.lg, overflow: 'hidden' },
  apkBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  apkBtnText: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: '#FFF' },
});
