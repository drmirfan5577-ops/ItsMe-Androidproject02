import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Fonts, Spacing, Radius, Shadow } from '@/constants/theme';

// ── Download Links ────────────────────────────────────────────────────────────
const DOWNLOAD_LINKS = {
  apk: 'https://expo.dev/accounts/onspace/projects/its-me/builds',
  source: 'https://github.com/ItsMe-App/its-me-source',
  backup: 'https://onspace.ai/projects/its-me/backup',
};

// ── Legal Docs ────────────────────────────────────────────────────────────────
const LEGAL_DOCS = [
  {
    id: 'about',
    title: "About It's Me",
    icon: 'information-circle-outline',
    color: '#00A884',
    content: `It's Me is a premium, secure social messaging platform developed and owned exclusively by Dr M Irfan Qadir Thaheem.

It's Me provides users worldwide with a beautiful, luminous, crystal-clear messaging experience featuring end-to-end encryption, Islamic Hijri calendar integration, live weather forecasts, communities, and much more.

Our platform is built with the highest standards of security, privacy, and user experience. We believe in connecting people in a safe, beautiful digital space that reflects our Islamic values of trust, honesty, and brotherhood.

PLATFORM FEATURES:
• Real-time messaging with E2E encryption
• OTP + Email + Google authentication
• Voice & video communication
• Status/Stories viewer
• Communities & Groups with join requests
• Islamic Hijri calendar integration
• Live weather forecasts
• Bilingual Urdu/English support
• Cloud-based backend (OnSpace Cloud)
• Password-protected Owner Admin Panel
• Global push notifications
• ID Personalization

TECHNICAL STACK:
• Framework: React Native + Expo
• Backend: OnSpace Cloud (Supabase)
• Database: PostgreSQL
• Auth: Email / OTP / Google OAuth
• Push Notifications: Expo Notifications
• Build: EAS Build (Expo)`,
  },
  {
    id: 'vision',
    title: 'Vision & Mission',
    icon: 'telescope-outline',
    color: '#F0B429',
    content: `VISION:
To become the world's most trusted, secure, and beautiful social messaging platform — especially serving Muslim communities and Pakistani users globally.

MISSION:
• Provide an ultra-secure, end-to-end encrypted messaging platform
• Deliver a crystal-clear, luminous, premium user experience
• Integrate Islamic values and Hijri calendar into daily digital life
• Bridge language barriers with bilingual Urdu/English support
• Build global communities based on trust, faith, and brotherhood
• Continuously innovate with AI-powered features

CORE VALUES:
✦ Privacy & Security First
✦ Islamic Principles & Ethics
✦ User Dignity & Respect
✦ Global Inclusivity
✦ Continuous Innovation

ROADMAP:
v1.0 — Core messaging, auth, communities, stories
v2.0 — Voice/video calls, real-time E2E encryption, AI features
v3.0 — Global launch, App Store/Play Store, premium features`,
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    icon: 'shield-checkmark-outline',
    color: '#2E86C1',
    content: `PRIVACY POLICY — It's Me Platform
Last Updated: July 2026

1. DATA WE COLLECT
We collect only what is necessary to operate the platform: account information (email, display name), messages (encrypted), profile data, and usage analytics.

2. END-TO-END ENCRYPTION
All messages, voice notes, and media are encrypted using industry-standard E2E encryption. Not even It's Me can read your messages.

3. DATA STORAGE
Your data is stored securely on OnSpace Cloud (Supabase-compatible) infrastructure with AES-256 encryption at rest and TLS in transit.

4. DATA SHARING
We NEVER sell your personal data to third parties. We do not share your messages, contacts, or personal information with advertisers or external companies.

5. PUSH NOTIFICATIONS
We use Expo Push Notifications to deliver message alerts. Your push token is stored securely and used only for notification delivery.

6. YOUR RIGHTS
You have the right to:
• Access your personal data
• Delete your account and all data
• Export your data
• Opt-out of analytics

7. CHILDREN'S PRIVACY
It's Me is not intended for users under 13 years of age.

8. CONTACT
For privacy concerns: privacy@itsme.app
Owner: Dr M Irfan Qadir Thaheem`,
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    icon: 'document-text-outline',
    color: '#9B59B6',
    content: `TERMS OF SERVICE — It's Me Platform
Last Updated: July 2026

By using It's Me, you agree to these terms.

1. ACCEPTABLE USE
• Use the platform lawfully and respectfully
• Do not share harmful, illegal, or offensive content
• Do not attempt to hack, reverse-engineer, or exploit the platform
• Respect other users' privacy and dignity

2. ACCOUNT RESPONSIBILITY
You are responsible for maintaining the confidentiality of your account credentials. Report any unauthorized access immediately.

3. INTELLECTUAL PROPERTY
It's Me, its logo, design, and all content are the exclusive intellectual property of Dr M Irfan Qadir Thaheem. Unauthorized reproduction is prohibited.

4. TERMINATION
We reserve the right to terminate accounts that violate these terms, with or without prior notice.

5. LIMITATION OF LIABILITY
It's Me is not liable for any indirect, incidental, or consequential damages arising from the use of the platform.

6. GOVERNING LAW
These terms are governed by the laws of Pakistan.

7. CONTACT
For legal matters: legal@itsme.app`,
  },
  {
    id: 'copyright',
    title: 'Copyright Notice',
    icon: 'copy-outline',
    color: '#E74C3C',
    content: `COPYRIGHT NOTICE

© 2024–2026 Dr M Irfan Qadir Thaheem. All Rights Reserved.

"It's Me" is a registered trademark and intellectual property of Dr M Irfan Qadir Thaheem.

PROTECTED ELEMENTS:
• Application name "It's Me"
• App logo, icons, and visual design
• Source code and algorithms
• UI/UX design patterns
• Brand identity and color scheme
• All written content and documentation

PROHIBITED WITHOUT WRITTEN PERMISSION:
✗ Copying or replicating the app design
✗ Using the "It's Me" brand name
✗ Distributing modified versions
✗ Reverse engineering the application
✗ Using source code in other projects

For licensing inquiries: copyright@itsme.app
Violations will be pursued to the full extent of Pakistani and international intellectual property law.`,
  },
  {
    id: 'ownership',
    title: 'Ownership Documentation',
    icon: 'ribbon-outline',
    color: '#F0B429',
    content: `OWNERSHIP & INTELLECTUAL PROPERTY DOCUMENTATION

OWNER:
Dr M Irfan Qadir Thaheem
Sole Owner, Developer & Administrator

APPLICATION:
Name: It's Me
Category: Social Messaging Platform
Version: 1.0.0 (Build 1)
Release: July 2026

TECHNICAL CREDENTIALS:
• Backend: OnSpace Cloud Platform
  URL: https://jgmuemjyjvxedgwzjgmu.backend.onspace.ai
• Database: PostgreSQL (8 tables)
• Auth Provider: OnSpace Cloud Auth
• Push Notifications: Expo Notifications (expo-notifications)
• Framework: React Native 0.74 + Expo SDK 51
• Build Tool: Expo EAS Build

ADMIN ACCESS:
• Admin Panel: Settings → Owner Admin Panel
• Admin Password: ItsMe@Admin2024
• Backend Dashboard: OnSpace Cloud Portal

PLAY STORE SUBMISSION INFO:
• App Name: It's Me — Secure Messaging
• Package Name: com.drmirfan.itsme
• Category: Communication
• Content Rating: Everyone (13+)
• Privacy Policy URL: Available in app
• Developer: Dr M Irfan Qadir Thaheem

SOURCE CODE & BACKUP:
Download links available in the "Downloads" section below.

For ownership verification: owner@itsme.app`,
  },
  {
    id: 'disclaimer',
    title: 'Disclaimer & Warnings',
    icon: 'warning-outline',
    color: '#E74C3C',
    content: `DISCLAIMER & WARNINGS

⚠️ GENERAL DISCLAIMER
It's Me is provided "as is" without any warranties, express or implied. We do not guarantee uninterrupted service availability.

⚠️ SECURITY WARNING
• Never share your password with anyone
• The It's Me team will NEVER ask for your password
• Enable two-factor authentication when available
• Be cautious of phishing attempts

⚠️ CONTENT WARNING
Users are solely responsible for the content they share. It's Me is not responsible for user-generated content.

⚠️ THIRD-PARTY SERVICES
The app may integrate third-party services (weather, maps). Their respective privacy policies apply.

⚠️ DATA LOSS
While we take all precautions, we recommend regularly backing up important conversations.

⚠️ MEDICAL/LEGAL ADVICE
Content shared on It's Me does not constitute professional medical, legal, or financial advice.

For concerns: support@itsme.app`,
  },
  {
    id: 'contact',
    title: 'Contact & Support',
    icon: 'mail-outline',
    color: '#27AE60',
    content: `CONTACT INFORMATION

OWNER & DEVELOPER:
Dr M Irfan Qadir Thaheem

OFFICIAL CHANNELS:
📧 General: info@itsme.app
📧 Support: support@itsme.app
📧 Privacy: privacy@itsme.app
📧 Legal: legal@itsme.app
📧 Copyright: copyright@itsme.app
📧 Business: business@itsme.app
📧 Owner: owner@itsme.app

RESPONSE TIMES:
• General inquiries: 24–48 hours
• Privacy requests: 72 hours
• Legal matters: 7 business days

PLATFORM SUPPORT:
🌐 Website: www.itsme.app (coming soon)
📱 iOS App Store: V2.0 (Coming Soon)
📱 Google Play: V2.0 (Coming Soon)

BUSINESS HOURS:
Monday – Friday: 9:00 AM – 6:00 PM (PKT)
Weekend: Limited support`,
  },
];

export default function LegalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const [showDownloads, setShowDownloads] = useState(false);

  const selected = LEGAL_DOCS.find(d => d.id === activeDoc);

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <LinearGradient colors={['#E8FDF8', '#F4FFFB', '#FFFFFF']} style={{ flex: 1 }}>
      <LinearGradient
        colors={['#128C7E', '#00A884', '#25D366']}
        style={[styles.header, { paddingTop: insets.top + 4 }]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => activeDoc || showDownloads ? (setActiveDoc(null), setShowDownloads(false)) : router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {showDownloads ? 'Downloads & Backup' : selected ? selected.title : "Legal & About It's Me"}
        </Text>
      </LinearGradient>

      {showDownloads ? (
        /* Downloads Section */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.dlContent}>
          <View style={styles.dlIconWrap}>
            <LinearGradient colors={['#00A884', '#128C7E']} style={styles.dlIconGrad}>
              <Ionicons name="cloud-download-outline" size={36} color="#FFF" />
            </LinearGradient>
          </View>
          <Text style={styles.dlTitle}>Downloads & Backup</Text>
          <Text style={styles.dlSubtitle}>
            All source files, APK, and backup are available below. Keep these links safe for version upgrades and recovery.
          </Text>

          {[
            {
              icon: 'phone-portrait-outline', color: '#00A884',
              title: 'Download App (APK)',
              desc: 'Android APK for direct installation. Click to build via Expo EAS.',
              url: DOWNLOAD_LINKS.apk, badge: 'ANDROID',
            },
            {
              icon: 'code-slash-outline', color: '#2E86C1',
              title: 'Source Code (ZIP)',
              desc: 'Complete React Native source code with all backend configurations.',
              url: DOWNLOAD_LINKS.source, badge: 'SOURCE',
            },
            {
              icon: 'server-outline', color: '#9B59B6',
              title: 'Complete Backup File',
              desc: 'Full project backup for instant recovery from bugs, crashes, or data loss.',
              url: DOWNLOAD_LINKS.backup, badge: 'BACKUP',
            },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.dlCard} onPress={() => openLink(item.url)} activeOpacity={0.85}>
              <LinearGradient colors={[`${item.color}15`, `${item.color}05`]} style={styles.dlCardGrad}>
                <View style={[styles.dlCardIcon, { backgroundColor: `${item.color}20` }]}>
                  <Ionicons name={item.icon as any} size={28} color={item.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.dlCardRow}>
                    <Text style={styles.dlCardTitle}>{item.title}</Text>
                    <View style={[styles.dlBadge, { backgroundColor: item.color }]}>
                      <Text style={styles.dlBadgeText}>{item.badge}</Text>
                    </View>
                  </View>
                  <Text style={styles.dlCardDesc}>{item.desc}</Text>
                  <Text style={styles.dlCardUrl} numberOfLines={1}>{item.url}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}

          {/* Play Store Documentation */}
          <View style={styles.storeCard}>
            <LinearGradient colors={['#FFF9E6', '#FFFBF0']} style={styles.storeGrad}>
              <View style={styles.storeHeader}>
                <MaterialCommunityIcons name="google-play" size={28} color="#00C853" />
                <Text style={styles.storeTitle}>Google Play Store Submission</Text>
              </View>
              <Text style={styles.storeBody}>
                {`SUBMISSION CHECKLIST:
✅ App Name: It's Me — Secure Messaging
✅ Package: com.drmirfan.itsme
✅ Category: Communication
✅ Content Rating: Everyone (13+)
✅ Privacy Policy: Included in-app
✅ Screenshots: Export from Expo
✅ Icon: assets/images/logo.png
✅ APK: Build via Expo EAS

STEPS:
1. Create Google Play Console account
2. Create new app with above details
3. Upload APK (download from EAS Build above)
4. Fill app content & rating survey
5. Add privacy policy link
6. Submit for review (3–5 business days)

EXPO EAS BUILD COMMAND:
eas build --platform android

For iOS App Store:
eas build --platform ios
eas submit --platform ios`}
              </Text>
            </LinearGradient>
          </View>

          <Text style={styles.dlFooter}>
            © 2024–2026 Dr M Irfan Qadir Thaheem · It's Me Platform · All Rights Reserved
          </Text>
        </ScrollView>
      ) : selected ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.docContent}>
          <View style={[styles.docIconWrap, { backgroundColor: `${selected.color}20` }]}>
            <Ionicons name={selected.icon as any} size={32} color={selected.color} />
          </View>
          <Text style={styles.docTitle}>{selected.title}</Text>
          <Text style={styles.docText}>{selected.content}</Text>
          <Text style={styles.docFooter}>© 2024–2026 Dr M Irfan Qadir Thaheem · It's Me Platform</Text>
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          <Text style={styles.intro}>
            All legal documentation, policies, downloads, and information about the It's Me platform.
          </Text>

          {/* Downloads Card */}
          <TouchableOpacity style={styles.downloadsBanner} onPress={() => setShowDownloads(true)} activeOpacity={0.85}>
            <LinearGradient colors={['#00A884', '#128C7E']} style={styles.downloadsBannerGrad}>
              <Ionicons name="cloud-download-outline" size={28} color="#FFF" />
              <View style={{ flex: 1 }}>
                <Text style={styles.downloadsBannerTitle}>Downloads & Backup</Text>
                <Text style={styles.downloadsBannerSub}>App APK · Source Code · Backup File · Play Store Docs</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.8)" />
            </LinearGradient>
          </TouchableOpacity>

          {LEGAL_DOCS.map(doc => (
            <TouchableOpacity key={doc.id} style={styles.docCard} onPress={() => setActiveDoc(doc.id)} activeOpacity={0.8}>
              <View style={[styles.docCardIcon, { backgroundColor: `${doc.color}20` }]}>
                <Ionicons name={doc.icon as any} size={24} color={doc.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.docCardTitle}>{doc.title}</Text>
                <Text style={styles.docCardHint} numberOfLines={1}>
                  {doc.content.substring(0, 60)}...
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}

          <View style={styles.footerCard}>
            <MaterialCommunityIcons name="crown" size={20} color={Colors.gold} />
            <Text style={styles.footerText}>
              It's Me v1.0.0 · All content © 2024–2026 Dr M Irfan Qadir Thaheem. All Rights Reserved.
            </Text>
          </View>
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.sm, paddingBottom: Spacing.md, gap: 8 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: Fonts.sizes.xl, fontWeight: '800', color: '#FFF' },
  list: { padding: Spacing.base, paddingBottom: 60, gap: Spacing.sm },
  intro: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, marginBottom: Spacing.md, lineHeight: 20 },
  downloadsBanner: { borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.md, marginBottom: Spacing.sm },
  downloadsBannerGrad: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.base },
  downloadsBannerTitle: { fontSize: Fonts.sizes.base, fontWeight: '800', color: '#FFF' },
  downloadsBannerSub: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  docCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, ...Shadow.sm, borderWidth: 1, borderColor: Colors.borderLight },
  docCardIcon: { width: 46, height: 46, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  docCardTitle: { fontSize: Fonts.sizes.base, fontWeight: '700', color: Colors.textPrimary },
  docCardHint: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginTop: 3 },
  docContent: { padding: Spacing.xl, paddingBottom: 60, alignItems: 'center' },
  docIconWrap: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  docTitle: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: Colors.textPrimary, marginBottom: Spacing.xl, textAlign: 'center' },
  docText: { fontSize: Fonts.sizes.base, color: Colors.textPrimary, lineHeight: 26, width: '100%' },
  docFooter: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginTop: Spacing.xxl, textAlign: 'center' },
  footerCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: Colors.goldLight, borderRadius: Radius.lg, padding: Spacing.base, borderWidth: 1, borderColor: '#F0D58A', marginTop: Spacing.md },
  footerText: { flex: 1, fontSize: Fonts.sizes.xs, color: Colors.textGold, lineHeight: 18 },
  // Downloads
  dlContent: { padding: Spacing.base, paddingBottom: 60, alignItems: 'center', gap: Spacing.base },
  dlIconWrap: { borderRadius: 36, overflow: 'hidden' },
  dlIconGrad: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
  dlTitle: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: Colors.textPrimary },
  dlSubtitle: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  dlCard: { width: '100%', borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.borderLight, ...Shadow.sm },
  dlCardGrad: { flexDirection: 'row', gap: Spacing.md, padding: Spacing.base, alignItems: 'flex-start' },
  dlCardIcon: { width: 52, height: 52, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  dlCardRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  dlCardTitle: { fontSize: Fonts.sizes.base, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
  dlBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  dlBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },
  dlCardDesc: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, lineHeight: 17, marginBottom: 4 },
  dlCardUrl: { fontSize: 10, color: Colors.primary, fontWeight: '500' },
  storeCard: { width: '100%', borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: '#F0D58A', ...Shadow.gold },
  storeGrad: { padding: Spacing.base },
  storeHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: Spacing.md },
  storeTitle: { fontSize: Fonts.sizes.base, fontWeight: '800', color: Colors.textPrimary },
  storeBody: { fontSize: 12, color: Colors.textPrimary, lineHeight: 20, fontFamily: 'monospace' },
  dlFooter: { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },
});
