import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform,
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

export default function ProfileScreen() {
  const { currentUser, updateProfile, language, backendUser } = useApp();
  const { showAlert } = useAlert();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(currentUser.name);
  const [status, setStatus] = useState(currentUser.status);
  const [about, setAbout] = useState(currentUser.about);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(currentUser.name);
    setStatus(currentUser.status);
    setAbout(currentUser.about);
  }, [currentUser]);

  const AVATAR_OPTIONS = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&crop=face',
  ];

  const STATUS_EMOJIS = ['🌟', '🤲', '🌙', '☪', '💚', '📖', '🕌', '✨', '⭐', '🌿', '😊', '🤗'];

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({ name: name.trim(), status: status.trim(), about: about.trim() });
    setSaving(false);
    setEditing(false);
    showAlert('Profile Updated', 'Your profile has been saved to OnSpace Cloud!');
  };

  const itsmeId = backendUser?.its_me_id ?? `@DrMIrfan.2024`;

  const THEMES = [
    { name: 'Emerald', colors: ['#25D366', '#00A884'] },
    { name: 'Royal Gold', colors: ['#F6D365', '#F0B429'] },
    { name: 'Ocean', colors: ['#3498DB', '#2E86C1'] },
    { name: 'Rose', colors: ['#E74C3C', '#C0392B'] },
    { name: 'Lavender', colors: ['#9B59B6', '#8E44AD'] },
    { name: 'Teal', colors: ['#00C9A7', '#00A884'] },
  ];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <LinearGradient colors={['#E8FDF8', '#F4FFFB', '#FFFFFF']} style={{ flex: 1 }}>
        <LinearGradient
          colors={['#128C7E', '#00A884', '#25D366']}
          style={[styles.header, { paddingTop: insets.top + 4 }]}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{language === 'ur' ? 'میری پروفائل' : 'My Profile'}</Text>
          <CalendarWidget language={language} compact />
        </LinearGradient>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Avatar */}
          <LinearGradient colors={['#E8FDF8', '#D4F7EE']} style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: currentUser.avatar }} style={styles.avatar} contentFit="cover" transition={200} />
              <TouchableOpacity
                style={styles.avatarEdit}
                onPress={() => showAlert('Change Avatar', 'Camera upload coming in V2.0! Choose from options below.')}
              >
                <LinearGradient colors={['#25D366', '#00A884']} style={styles.avatarEditGrad}>
                  <Ionicons name="camera" size={16} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={styles.nameSection}>
              <View style={styles.verifiedRow}>
                <Text style={styles.profileName}>{currentUser.name}</Text>
                <MaterialIcons name="verified" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.profilePhone}>{currentUser.phone || backendUser?.email || 'No phone'}</Text>
              <View style={styles.idBadge}>
                <MaterialCommunityIcons name="identifier" size={13} color={Colors.gold} />
                <Text style={styles.idText}>{itsmeId}</Text>
              </View>
              {backendUser && (
                <View style={styles.cloudBadge}>
                  <Ionicons name="cloud-done-outline" size={11} color={Colors.primary} />
                  <Text style={styles.cloudText}>Synced to OnSpace Cloud</Text>
                </View>
              )}
            </View>
          </LinearGradient>

          {/* Edit Toggle */}
          <View style={styles.editToggle}>
            <TouchableOpacity
              style={[styles.editBtn, editing && styles.editBtnActive]}
              onPress={() => editing ? handleSave() : setEditing(true)}
              disabled={saving}
            >
              <LinearGradient
                colors={editing ? ['#25D366', '#00A884'] : ['#F0FDFB', '#E8FDF8']}
                style={styles.editBtnGrad}
              >
                <Ionicons name={editing ? (saving ? 'sync-outline' : 'checkmark') : 'pencil'} size={18} color={editing ? '#FFF' : Colors.primary} />
                <Text style={[styles.editBtnText, editing && styles.editBtnTextActive]}>
                  {editing ? (saving ? 'Saving...' : 'Save Profile') : 'Edit Profile'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            {editing && (
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Profile Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFILE INFO</Text>
            <View style={styles.fieldCard}>
              <View style={styles.field}>
                <View style={styles.fieldIconWrap}><Ionicons name="person-outline" size={18} color={Colors.primary} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>Name</Text>
                  {editing ? (
                    <TextInput style={styles.fieldInput} value={name} onChangeText={setName} autoFocus />
                  ) : (
                    <Text style={styles.fieldValue}>{name}</Text>
                  )}
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.field}>
                <View style={styles.fieldIconWrap}><Ionicons name="happy-outline" size={18} color={Colors.primary} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>Status</Text>
                  {editing ? (
                    <TextInput style={styles.fieldInput} value={status} onChangeText={setStatus} />
                  ) : (
                    <Text style={styles.fieldValue}>{status}</Text>
                  )}
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.field}>
                <View style={styles.fieldIconWrap}><Ionicons name="information-circle-outline" size={18} color={Colors.primary} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>About</Text>
                  {editing ? (
                    <TextInput style={styles.fieldInput} value={about} onChangeText={setAbout} multiline />
                  ) : (
                    <Text style={styles.fieldValue}>{about}</Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Status Emojis */}
          {editing && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>QUICK STATUS</Text>
              <View style={styles.emojiRow}>
                {STATUS_EMOJIS.map(em => (
                  <TouchableOpacity key={em} style={styles.emojiChip} onPress={() => setStatus(`${em} ${status.replace(/^[\u{1F300}-\u{1FAD6}\u{2600}-\u{27BF}]\s*/u, '')}`.trim())}>
                    <Text style={styles.emoji}>{em}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Avatar Options */}
          {editing && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CHOOSE AVATAR</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                {AVATAR_OPTIONS.map((url, idx) => (
                  <TouchableOpacity key={idx} onPress={() => updateProfile({ avatar: url, avatar_url: url })}>
                    <Image
                      source={{ uri: url }}
                      style={[styles.avatarOption, currentUser.avatar === url && styles.avatarOptionSelected]}
                      contentFit="cover"
                      transition={200}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Theme */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFILE THEME</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {THEMES.map(t => (
                <TouchableOpacity key={t.name} onPress={() => showAlert('Theme', `"${t.name}" theme applied!`)} style={styles.themeChip}>
                  <LinearGradient colors={t.colors as [string, string]} style={styles.themeGrad} />
                  <Text style={styles.themeName}>{t.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.sm, paddingBottom: Spacing.md, gap: 8 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: Fonts.sizes.xl, fontWeight: '800', color: '#FFF' },
  avatarSection: { alignItems: 'center', paddingVertical: Spacing.xl, paddingHorizontal: Spacing.base },
  avatarWrap: { position: 'relative', marginBottom: Spacing.md },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: Colors.surface },
  avatarEdit: { position: 'absolute', bottom: 0, right: 0, borderRadius: 18, overflow: 'hidden', borderWidth: 2, borderColor: Colors.surface },
  avatarEditGrad: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  nameSection: { alignItems: 'center', gap: 4 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  profileName: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: Colors.textPrimary },
  profilePhone: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary },
  idBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.goldLight, paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.full },
  idText: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.textGold },
  cloudBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primaryLight, paddingHorizontal: 10, paddingVertical: 3, borderRadius: Radius.full },
  cloudText: { fontSize: 10, fontWeight: '600', color: Colors.primary },
  editToggle: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, gap: Spacing.sm },
  editBtn: { flex: 1, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1.5, borderColor: Colors.primary },
  editBtnActive: { borderColor: 'transparent' },
  editBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 13 },
  editBtnText: { fontSize: Fonts.sizes.base, fontWeight: '700', color: Colors.primary },
  editBtnTextActive: { color: '#FFF' },
  cancelBtn: { paddingHorizontal: Spacing.base },
  cancelText: { fontSize: Fonts.sizes.base, fontWeight: '600', color: Colors.textMuted },
  section: { paddingHorizontal: Spacing.base, marginBottom: Spacing.base },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, marginBottom: 8, letterSpacing: 1 },
  fieldCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, ...Shadow.sm, borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden' },
  field: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.base, paddingVertical: 14 },
  fieldIconWrap: { width: 36, height: 36, borderRadius: Radius.md, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldValue: { fontSize: Fonts.sizes.base, fontWeight: '500', color: Colors.textPrimary },
  fieldInput: { fontSize: Fonts.sizes.base, fontWeight: '500', color: Colors.textPrimary, borderBottomWidth: 1.5, borderBottomColor: Colors.primary, paddingVertical: 4 },
  divider: { height: 1, backgroundColor: Colors.divider, marginLeft: 68 },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emojiChip: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.backgroundAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  emoji: { fontSize: 20 },
  avatarOption: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: Colors.border },
  avatarOptionSelected: { borderColor: Colors.primary, borderWidth: 3 },
  themeChip: { alignItems: 'center', gap: 6 },
  themeGrad: { width: 60, height: 40, borderRadius: Radius.md },
  themeName: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, fontWeight: '500' },
});
