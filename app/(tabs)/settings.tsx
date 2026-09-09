import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';
import CalendarWidget from '@/components/feature/CalendarWidget';
import { Colors, Fonts, Spacing, Radius, Shadow, THEMES, ThemeKey } from '@/constants/theme';

export default function SettingsScreen() {
  const { currentUser, language, toggleLanguage, setLanguage, logout, unreadNotifCount, markNotificationsRead, activeTheme, setActiveTheme } = useApp();
  const { showAlert } = useAlert();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    showAlert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await logout(); } },
    ]);
  };

  const langLabel = language === 'ur' ? 'اردو' : language === 'ar' ? 'عربي' : 'English';

  const SECTIONS = [
    {
      title: language === 'ur' ? 'اکاؤنٹ' : language === 'ar' ? 'الحساب' : 'Account',
      items: [
        { icon: 'person-outline', label: language === 'ur' ? 'پروفائل' : language === 'ar' ? 'الملف الشخصي' : 'Profile', value: currentUser.name, action: () => router.push('/profile') },
        {
          icon: 'notifications-outline',
          label: language === 'ur' ? 'اطلاعات' : language === 'ar' ? 'الإشعارات' : 'Notifications',
          value: unreadNotifCount > 0 ? `${unreadNotifCount} unread` : 'All read',
          iconColor: unreadNotifCount > 0 ? Colors.warning : Colors.primary,
          action: () => { markNotificationsRead(); showAlert('Notifications', 'All notifications marked as read.'); },
        },
        { icon: 'shield-checkmark-outline', label: language === 'ur' ? 'پرائیویسی' : language === 'ar' ? 'الخصوصية' : 'Privacy', iconColor: '#2E86C1', action: () => showAlert('Privacy', 'E2E Encryption is always ON. All messages are secured.') },
        { icon: 'lock-closed-outline', label: language === 'ur' ? 'سیکیورٹی' : language === 'ar' ? 'الأمان' : 'Security', iconColor: '#E74C3C', action: () => showAlert('Security', 'Biometric lock & 2FA coming in V2.0!') },
      ],
    },
    {
      title: language === 'ur' ? 'ترجیحات' : language === 'ar' ? 'التفضيلات' : 'Preferences',
      items: [
        { icon: 'chatbubble-outline', label: language === 'ur' ? 'چیٹ سیٹنگ' : language === 'ar' ? 'إعدادات الدردشة' : 'Chats', action: () => showAlert('Chat Settings', 'Chat backup, export, font size and notification sounds.') },
        { icon: 'color-palette-outline', label: language === 'ur' ? 'ظاہری شکل' : language === 'ar' ? 'المظهر' : 'Appearance & Themes', iconColor: '#9B59B6', action: () => {} },
        {
          icon: 'language-outline',
          label: language === 'ur' ? 'زبان' : language === 'ar' ? 'اللغة' : 'Language',
          iconColor: '#27AE60',
          value: langLabel,
          action: () => showAlert(
            'Select Language',
            'Choose your preferred language:',
            [
              { text: 'English', onPress: () => setLanguage('en') },
              { text: 'اردو', onPress: () => setLanguage('ur') },
              { text: 'عربي', onPress: () => setLanguage('ar') },
              { text: 'Cancel', style: 'cancel' },
            ]
          ),
        },
        { icon: 'cloud-outline', label: language === 'ur' ? 'اسٹوریج' : language === 'ar' ? 'التخزين' : 'Storage & Data', action: () => showAlert('Storage', 'Cloud storage powered by OnSpace Cloud!') },
      ],
    },
    {
      title: language === 'ur' ? 'مدد' : language === 'ar' ? 'الدعم' : 'Support',
      items: [
        { icon: 'help-circle-outline', label: language === 'ur' ? 'مدد مرکز' : language === 'ar' ? 'مركز المساعدة' : 'Help Center', action: () => showAlert('Help', 'support@itsme.app') },
        { icon: 'document-text-outline', label: language === 'ur' ? 'قانونی' : language === 'ar' ? 'القانونية' : 'Legal & Policies', action: () => router.push('/legal') },
        { icon: 'download-outline', label: language === 'ur' ? 'ڈاؤنلوڈ' : language === 'ar' ? 'التحميل' : 'Downloads & Backup', iconColor: '#00A884', action: () => router.push('/legal') },
        { icon: 'star-outline', label: language === 'ur' ? 'ریٹنگ' : language === 'ar' ? 'التقييم' : 'Rate the App', iconColor: Colors.gold, action: () => showAlert('Rate Us', "Thank you! Rate It's Me on Google Play when available.") },
      ],
    },
  ];

  return (
    <LinearGradient colors={['#E8FDF8', '#F4FFFB', '#FFFFFF']} style={{ flex: 1 }}>
      <LinearGradient
        colors={['#128C7E', '#00A884', '#25D366']}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>
            {language === 'ur' ? 'سیٹنگز' : language === 'ar' ? 'الإعدادات' : 'Settings'}
          </Text>
          <CalendarWidget language={language} compact />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Card */}
        <TouchableOpacity style={styles.profileCard} onPress={() => router.push('/profile')} activeOpacity={0.85}>
          <Image source={{ uri: currentUser.avatar }} style={styles.profileAvatar} contentFit="cover" transition={200} />
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.profileName}>{currentUser.name}</Text>
              <MaterialIcons name="verified" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.profilePhone}>{currentUser.phone || 'Add phone number'}</Text>
            <Text style={styles.profileStatus} numberOfLines={1}>{currentUser.status}</Text>
          </View>
          {unreadNotifCount > 0 && (
            <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>{unreadNotifCount}</Text></View>
          )}
          <View style={styles.qrBtn}>
            <MaterialCommunityIcons name="qrcode" size={24} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Theme Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'ur' ? 'تھیمز' : language === 'ar' ? 'المظاهر' : 'APP THEMES'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.themeScroll}>
            {(Object.entries(THEMES) as [ThemeKey, typeof THEMES[ThemeKey]][]).map(([key, t]) => (
              <TouchableOpacity
                key={key}
                style={[styles.themeCard, activeTheme === key && styles.themeCardActive]}
                onPress={() => setActiveTheme(key)}
                activeOpacity={0.85}
              >
                <LinearGradient colors={t.header} style={styles.themePreview} />
                <LinearGradient colors={t.background} style={styles.themePreviewBg} />
                {activeTheme === key && (
                  <View style={styles.themeCheck}>
                    <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                  </View>
                )}
                <Text style={[styles.themeName, activeTheme === key && styles.themeNameActive]} numberOfLines={1}>
                  {language === 'ur' ? t.nameUr : language === 'ar' ? t.nameAr : t.name}
                </Text>
                <Text style={styles.themeDesc} numberOfLines={1}>{t.desc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Language Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'ur' ? 'زبان کا انتخاب' : language === 'ar' ? 'اختيار اللغة' : 'LANGUAGE'}
          </Text>
          <View style={styles.langCard}>
            {(['en', 'ur', 'ar'] as const).map(lang => (
              <TouchableOpacity
                key={lang}
                style={[styles.langBtn, language === lang && styles.langBtnActive]}
                onPress={() => setLanguage(lang)}
              >
                {language === lang ? (
                  <LinearGradient colors={['#25D366', '#00A884']} style={styles.langBtnGrad}>
                    <Text style={styles.langBtnTextActive}>{lang === 'en' ? '🇬🇧 English' : lang === 'ur' ? '🇵🇰 اردو' : '🇸🇦 عربي'}</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.langBtnText}>{lang === 'en' ? '🇬🇧 English' : lang === 'ur' ? '🇵🇰 اردو' : '🇸🇦 عربي'}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Admin Panel Access */}
        <TouchableOpacity style={styles.adminCard} onPress={() => router.push('/admin')} activeOpacity={0.85}>
          <LinearGradient colors={['#FFF9E6', '#FFFBF0']} style={styles.adminGrad}>
            <View style={styles.adminIconWrap}>
              <LinearGradient colors={['#F6D365', '#F0B429']} style={styles.adminIconGrad}>
                <MaterialCommunityIcons name="crown" size={22} color="#FFF" />
              </LinearGradient>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.adminTitle}>
                {language === 'ur' ? 'مالک ایڈمن پینل' : language === 'ar' ? 'لوحة المالك' : 'Owner Admin Panel'}
              </Text>
              <Text style={styles.adminDesc}>
                {language === 'ur' ? 'پاس ورڈ سے محفوظ · مکمل کنٹرول' : language === 'ar' ? 'محمي بكلمة مرور · تحكم كامل' : 'Password-protected · Full control · Real-time stats'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.gold} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Settings Sections */}
        {SECTIONS.map((section, si) => (
          <View key={si} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, ii) => (
                <View key={ii}>
                  <TouchableOpacity style={styles.settingItem} onPress={item.action} activeOpacity={0.75}>
                    <View style={[styles.settingIconWrap, { backgroundColor: `${(item as any).iconColor ?? Colors.primary}20` }]}>
                      <Ionicons name={item.icon as any} size={20} color={(item as any).iconColor ?? Colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.settingLabel}>{item.label}</Text>
                      {(item as any).value ? <Text style={styles.settingValue}>{(item as any).value}</Text> : null}
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                  </TouchableOpacity>
                  {ii < section.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <View style={styles.logoutWrap}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={styles.logoutText}>
              {language === 'ur' ? 'سائن آؤٹ' : language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>It's Me v1.0.0 · OnSpace Cloud Backend</Text>
        <Text style={styles.version}>© 2024–2026 Dr M Irfan Qadir Thaheem</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: '#FFF' },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, margin: Spacing.base, backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base, ...Shadow.md, borderWidth: 1, borderColor: Colors.borderLight },
  profileAvatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: Colors.primary },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  profileName: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.textPrimary },
  profilePhone: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, marginTop: 2 },
  profileStatus: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  notifBadge: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.error, alignItems: 'center', justifyContent: 'center' },
  notifBadgeText: { fontSize: 11, fontWeight: '800', color: '#FFF' },
  qrBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  section: { paddingHorizontal: Spacing.base, marginBottom: Spacing.base },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, marginBottom: 8, letterSpacing: 1 },
  themeScroll: { gap: 10, paddingVertical: 4 },
  themeCard: { width: 90, borderRadius: Radius.md, overflow: 'hidden', borderWidth: 2, borderColor: Colors.borderLight, backgroundColor: Colors.surface },
  themeCardActive: { borderColor: Colors.primary },
  themePreview: { height: 36 },
  themePreviewBg: { height: 24 },
  themeCheck: { position: 'absolute', top: 4, right: 4 },
  themeName: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary, paddingHorizontal: 6, paddingTop: 4, textAlign: 'center' },
  themeNameActive: { color: Colors.primary },
  themeDesc: { fontSize: 9, color: Colors.textMuted, paddingHorizontal: 6, paddingBottom: 6, textAlign: 'center' },
  langCard: { flexDirection: 'row', backgroundColor: Colors.backgroundAlt, borderRadius: Radius.xl, padding: 4, gap: 4 },
  langBtn: { flex: 1, borderRadius: Radius.lg, overflow: 'hidden', alignItems: 'center' },
  langBtnActive: {},
  langBtnGrad: { width: '100%', paddingVertical: 10, alignItems: 'center' },
  langBtnText: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.textMuted, paddingVertical: 10 },
  langBtnTextActive: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: '#FFF' },
  adminCard: { marginHorizontal: Spacing.base, marginBottom: Spacing.base, borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.gold, borderWidth: 1, borderColor: '#F0D58A' },
  adminGrad: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.base },
  adminIconWrap: { borderRadius: Radius.md, overflow: 'hidden' },
  adminIconGrad: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  adminTitle: { fontSize: Fonts.sizes.base, fontWeight: '800', color: Colors.textPrimary },
  adminDesc: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  sectionCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, ...Shadow.sm, borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.base, paddingVertical: 14 },
  settingIconWrap: { width: 36, height: 36, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontSize: Fonts.sizes.base, fontWeight: '600', color: Colors.textPrimary },
  settingValue: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginTop: 1 },
  divider: { height: 1, backgroundColor: Colors.divider, marginLeft: 68 },
  logoutWrap: { paddingHorizontal: Spacing.base, marginBottom: Spacing.xl },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FDEDEC', borderRadius: Radius.xl, paddingVertical: 14, borderWidth: 1, borderColor: '#FADBD8' },
  logoutText: { fontSize: Fonts.sizes.base, fontWeight: '700', color: Colors.error },
  version: { textAlign: 'center', fontSize: 11, color: Colors.textMuted, marginBottom: 4 },
});
