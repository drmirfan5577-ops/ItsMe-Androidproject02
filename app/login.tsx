import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';
import { Colors, Fonts, Spacing, Radius, Shadow } from '@/constants/theme';
import CalendarWidget from '@/components/feature/CalendarWidget';

export default function LoginScreen() {
  const { isLoggedIn, login, register, sendOTP, verifyOTP, language } = useApp();
  const { showAlert } = useAlert();
  const insets = useSafeAreaInsets();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [mode, setMode] = useState<'password' | 'otp'>('password');
  const [step, setStep] = useState<'form' | 'otp'>('form');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) return <Redirect href="/(tabs)" />;

  const t = language === 'ur' ? {
    welcome: "It's Me میں خوش آمدید",
    tagline: 'محفوظ · نجی · خوبصورت',
    email: 'ای میل پتہ',
    password: 'پاس ورڈ',
    name: 'پورا نام',
    signIn: 'سائن ان',
    register: 'اکاؤنٹ بنائیں',
    orWith: 'یا جاری رکھیں',
    sendOtp: 'OTP بھیجیں',
    verifyOtp: 'تصدیق کریں',
    otpSent: 'آپ کی ای میل پر OTP بھیجا گیا',
    otpCode: 'OTP کوڈ (4 ہندسے)',
  } : {
    welcome: "Welcome to It's Me",
    tagline: 'Secure · Private · Luminous',
    email: 'Email Address',
    password: 'Password (min 6 chars)',
    name: 'Full Name',
    signIn: 'Sign In',
    register: 'Create Account',
    orWith: 'Or continue with',
    sendOtp: 'Send OTP Code',
    verifyOtp: 'Verify & Login',
    otpSent: 'OTP sent to your email address',
    otpCode: 'Enter 4-digit OTP',
  };

  const handlePasswordAuth = async () => {
    if (!email.trim()) return showAlert('Required', 'Please enter your email');
    if (!password.trim() || password.length < 6) return showAlert('Required', 'Password must be at least 6 characters');

    setLoading(true);
    if (tab === 'login') {
      const ok = await login(email.trim(), password);
      if (!ok) showAlert('Login Failed', 'Invalid email or password. Please try again.');
    } else {
      if (!name.trim()) { setLoading(false); return showAlert('Required', 'Please enter your name'); }
      const { error } = await register(email.trim(), password, name.trim());
      if (error) showAlert('Registration Failed', error);
      else showAlert('Account Created!', 'Please check your email to confirm your account, then sign in.');
    }
    setLoading(false);
  };

  const handleSendOTP = async () => {
    if (!email.trim()) return showAlert('Required', 'Please enter your email address');
    setLoading(true);
    const { error } = await sendOTP(email.trim());
    setLoading(false);
    if (error) showAlert('Error', error);
    else { setStep('otp'); showAlert('OTP Sent!', t.otpSent); }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode.trim() || otpCode.length < 4) return showAlert('Required', 'Please enter the 4-digit OTP');
    setLoading(true);
    const { error } = await verifyOTP(email.trim(), otpCode.trim());
    setLoading(false);
    if (error) showAlert('Invalid OTP', 'Please check the code and try again');
  };

  return (
    <LinearGradient colors={['#E8FDF8', '#F0FFFB', '#FFFFFF']} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.calRow}>
            <CalendarWidget language={language} />
          </View>

          {/* Logo */}
          <View style={styles.logoWrap}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} contentFit="contain" transition={300} />
            <Text style={styles.appName}>It's Me</Text>
            <View style={styles.encBadge}>
              <Ionicons name="lock-closed" size={11} color={Colors.primary} />
              <Text style={styles.encText}>End-to-End Encrypted</Text>
            </View>
            <Text style={styles.tagline}>{t.tagline}</Text>
          </View>

          {/* Auth Mode Toggle */}
          <View style={styles.modeRow}>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'password' && styles.modeActive]}
              onPress={() => { setMode('password'); setStep('form'); }}
            >
              <Ionicons name="lock-closed-outline" size={14} color={mode === 'password' ? Colors.textInverse : Colors.primary} />
              <Text style={[styles.modeTxt, mode === 'password' && styles.modeActiveTxt]}>Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'otp' && styles.modeActive]}
              onPress={() => { setMode('otp'); setStep('form'); }}
            >
              <Ionicons name="mail-outline" size={14} color={mode === 'otp' ? Colors.textInverse : Colors.primary} />
              <Text style={[styles.modeTxt, mode === 'otp' && styles.modeActiveTxt]}>OTP Email</Text>
            </TouchableOpacity>
          </View>

          {/* Tab row — only for password mode */}
          {mode === 'password' && (
            <View style={styles.tabRow}>
              <TouchableOpacity style={[styles.tab, tab === 'login' && styles.activeTab]} onPress={() => setTab('login')}>
                <Text style={[styles.tabText, tab === 'login' && styles.activeTabText]}>{t.signIn}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, tab === 'register' && styles.activeTab]} onPress={() => setTab('register')}>
                <Text style={[styles.tabText, tab === 'register' && styles.activeTabText]}>{t.register}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            {mode === 'password' ? (
              <>
                {tab === 'register' && (
                  <View style={styles.inputWrap}>
                    <Ionicons name="person-outline" size={18} color={Colors.primary} style={styles.iIcon} />
                    <TextInput style={styles.input} placeholder={t.name} placeholderTextColor={Colors.textMuted} value={name} onChangeText={setName} />
                  </View>
                )}
                <View style={styles.inputWrap}>
                  <Ionicons name="mail-outline" size={18} color={Colors.primary} style={styles.iIcon} />
                  <TextInput style={styles.input} placeholder={t.email} placeholderTextColor={Colors.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                </View>
                <View style={styles.inputWrap}>
                  <Ionicons name="lock-closed-outline" size={18} color={Colors.primary} style={styles.iIcon} />
                  <TextInput style={[styles.input, { flex: 1 }]} placeholder={t.password} placeholderTextColor={Colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry={!showPw} />
                  <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
                    <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.mainBtn} onPress={handlePasswordAuth} disabled={loading} activeOpacity={0.85}>
                  <LinearGradient colors={['#25D366', '#00A884', '#128C7E']} style={styles.mainBtnGrad}>
                    {loading ? <ActivityIndicator color="#FFF" /> : (
                      <>
                        <Ionicons name="log-in-outline" size={20} color="#FFF" />
                        <Text style={styles.mainBtnText}>{tab === 'login' ? t.signIn : t.register}</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : step === 'form' ? (
              <>
                <View style={styles.inputWrap}>
                  <Ionicons name="mail-outline" size={18} color={Colors.primary} style={styles.iIcon} />
                  <TextInput style={styles.input} placeholder={t.email} placeholderTextColor={Colors.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                </View>
                <TouchableOpacity style={styles.mainBtn} onPress={handleSendOTP} disabled={loading} activeOpacity={0.85}>
                  <LinearGradient colors={['#25D366', '#00A884', '#128C7E']} style={styles.mainBtnGrad}>
                    {loading ? <ActivityIndicator color="#FFF" /> : (
                      <>
                        <Ionicons name="send-outline" size={20} color="#FFF" />
                        <Text style={styles.mainBtnText}>{t.sendOtp}</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.otpInfo}>
                  <Ionicons name="mail-open-outline" size={22} color={Colors.primary} />
                  <Text style={styles.otpInfoText}>{t.otpSent}: {email}</Text>
                </View>
                <View style={[styles.inputWrap, styles.otpInput]}>
                  <Ionicons name="keypad-outline" size={18} color={Colors.primary} style={styles.iIcon} />
                  <TextInput
                    style={[styles.input, styles.otpField]}
                    placeholder={t.otpCode}
                    placeholderTextColor={Colors.textMuted}
                    value={otpCode}
                    onChangeText={setOtpCode}
                    keyboardType="number-pad"
                    maxLength={4}
                  />
                </View>
                <TouchableOpacity style={styles.mainBtn} onPress={handleVerifyOTP} disabled={loading} activeOpacity={0.85}>
                  <LinearGradient colors={['#25D366', '#00A884', '#128C7E']} style={styles.mainBtnGrad}>
                    {loading ? <ActivityIndicator color="#FFF" /> : (
                      <>
                        <Ionicons name="shield-checkmark-outline" size={20} color="#FFF" />
                        <Text style={styles.mainBtnText}>{t.verifyOtp}</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setStep('form'); setOtpCode(''); }} style={styles.backLink}>
                  <Text style={styles.backLinkText}>← Change email address</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Divider */}
          <View style={styles.divRow}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>{t.orWith}</Text>
            <View style={styles.divLine} />
          </View>

          {/* Google */}
          <TouchableOpacity style={styles.googleBtn} onPress={() => showAlert('Google Login', 'Enable Google OAuth in OnSpace Cloud Dashboard → User → Auth Settings to activate.')} activeOpacity={0.85}>
            <FontAwesome name="google" size={20} color="#EA4335" />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Legal */}
          <Text style={styles.legal}>
            By signing in you agree to our{' '}
            <Text style={styles.legalLink}>Terms of Service</Text>
            {' '}& <Text style={styles.legalLink}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.xl },
  calRow: { alignItems: 'flex-end', marginBottom: Spacing.base },
  logoWrap: { alignItems: 'center', marginBottom: Spacing.xl },
  logo: { width: 88, height: 88, borderRadius: 44, marginBottom: Spacing.md },
  appName: { fontSize: 36, fontWeight: '800', color: Colors.primaryDark, letterSpacing: -0.5 },
  encBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primaryLight, paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.full, marginTop: 8 },
  encText: { fontSize: Fonts.sizes.xs, color: Colors.primary, fontWeight: '600' },
  tagline: { fontSize: Fonts.sizes.sm, color: Colors.textMuted, marginTop: 6 },
  modeRow: { flexDirection: 'row', backgroundColor: Colors.backgroundAlt, borderRadius: Radius.xl, padding: 4, marginBottom: Spacing.md },
  modeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: Radius.lg },
  modeActive: { backgroundColor: Colors.primary },
  modeTxt: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.primary },
  modeActiveTxt: { color: Colors.textInverse },
  tabRow: { flexDirection: 'row', backgroundColor: Colors.backgroundAlt, borderRadius: Radius.xl, padding: 4, marginBottom: Spacing.lg },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Radius.lg },
  activeTab: { backgroundColor: Colors.surface, ...Shadow.sm },
  tabText: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.textMuted },
  activeTabText: { color: Colors.primaryDark },
  form: { gap: Spacing.md, marginBottom: Spacing.xl },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing.md, ...Shadow.sm },
  iIcon: { marginRight: Spacing.sm },
  input: { flex: 1, fontSize: Fonts.sizes.base, color: Colors.textPrimary, paddingVertical: 14, fontWeight: '500' },
  eyeBtn: { padding: 8 },
  mainBtn: { marginTop: 4, borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.md },
  mainBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  mainBtnText: { fontSize: Fonts.sizes.md, fontWeight: '700', color: '#FFF' },
  otpInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.primaryLight, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  otpInfoText: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.primaryDark, fontWeight: '500' },
  otpInput: { borderColor: Colors.primary, borderWidth: 2 },
  otpField: { fontSize: 22, fontWeight: '800', color: Colors.primary, letterSpacing: 8 },
  backLink: { alignItems: 'center', paddingVertical: 8 },
  backLinkText: { fontSize: Fonts.sizes.sm, color: Colors.primary, fontWeight: '600' },
  divRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, gap: Spacing.sm },
  divLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  divText: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, fontWeight: '500' },
  googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.surface, paddingVertical: 14, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: Colors.border, ...Shadow.sm, marginBottom: Spacing.lg },
  googleText: { fontSize: Fonts.sizes.base, fontWeight: '700', color: Colors.textPrimary },
  legal: { textAlign: 'center', fontSize: Fonts.sizes.xs, color: Colors.textMuted },
  legalLink: { color: Colors.primary, fontWeight: '600' },
});
