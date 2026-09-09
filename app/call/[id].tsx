import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/hooks/useApp';
import { Colors, Fonts, Spacing, Radius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function CallScreen() {
  const { id, type, name, avatar } = useLocalSearchParams<{ id: string; type: string; name: string; avatar: string }>();
  const { currentUser, chats, communities } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isVideo = type === 'video';
  const isGroup = type === 'group-voice' || type === 'group-video';

  const [callState, setCallState] = useState<'ringing' | 'connecting' | 'connected' | 'ended'>('ringing');
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [duration, setDuration] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Contact or community info
  const chat = chats.find(c => c.id === id);
  const community = communities.find(c => c.id === id);
  const contactName = name ? decodeURIComponent(name) : chat?.contact?.name ?? community?.name ?? 'Unknown';
  const contactAvatar = avatar ? decodeURIComponent(avatar) : chat?.contact?.avatar ?? community?.avatar ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80';

  useEffect(() => {
    // Pulse animation for ringing
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    pulse.start();

    // Simulate call connecting
    const connectTimer = setTimeout(() => {
      setCallState('connecting');
      setTimeout(() => {
        setCallState('connected');
        timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
      }, 1500);
    }, 2000);

    return () => {
      clearTimeout(connectTimer);
      pulse.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallState('ended');
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => router.back(), 1200);
  };

  const statusLabel = callState === 'ringing' ? 'Ringing...' :
    callState === 'connecting' ? 'Connecting...' :
    callState === 'connected' ? formatDuration(duration) :
    'Call Ended';

  const GRID_PARTICIPANTS = [
    { name: contactName, avatar: contactAvatar, muted: false },
    { name: currentUser.name, avatar: currentUser.avatar, muted: muted },
    ...(isGroup ? [
      { name: 'Ahmad R.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', muted: true },
      { name: 'Sara M.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', muted: false },
    ] : []),
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#0D2B28' }}>
      {isVideo ? (
        // Video call background — remote video
        <LinearGradient
          colors={['#0D2B28', '#1A4A42', '#0A3D30']}
          style={StyleSheet.absoluteFillObject}
        >
          {!videoOff && (
            <Image
              source={{ uri: contactAvatar }}
              style={[StyleSheet.absoluteFillObject, { opacity: 0.35 }]}
              contentFit="cover"
              transition={300}
              blurRadius={isGroup ? 0 : 2}
            />
          )}
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={['#075E54', '#128C7E', '#00A884']}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {/* Top overlay */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.topBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-down" size={28} color="rgba(255,255,255,0.9)" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.callTypeLabel}>
            {isGroup ? '👥 Group' : ''} {isVideo ? '📹 Video' : '📞 Voice'} Call
          </Text>
        </View>
        <TouchableOpacity style={styles.topBtn} onPress={() => {}}>
          <Ionicons name="ellipsis-horizontal" size={22} color="rgba(255,255,255,0.9)" />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      {isGroup ? (
        // Group video grid
        <View style={styles.gridContainer}>
          {GRID_PARTICIPANTS.map((p, i) => (
            <View key={i} style={styles.gridCell}>
              <Image source={{ uri: p.avatar }} style={styles.gridAvatar} contentFit="cover" transition={200} />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.gridOverlay}>
                <Text style={styles.gridName} numberOfLines={1}>{p.name}</Text>
                {p.muted && <Ionicons name="mic-off" size={12} color="#E74C3C" />}
              </LinearGradient>
              {i === 1 && isVideo && !videoOff && (
                <View style={styles.youBadge}><Text style={styles.youBadgeText}>You</Text></View>
              )}
            </View>
          ))}
        </View>
      ) : (
        // 1:1 call
        <View style={styles.avatarCenter}>
          <Animated.View style={[styles.pulseRing, { transform: [{ scale: callState === 'ringing' ? pulseAnim : new Animated.Value(1) }] }]}>
            <View style={styles.pulseRingInner} />
          </Animated.View>
          <Image source={{ uri: contactAvatar }} style={styles.mainAvatar} contentFit="cover" transition={300} />
          <Text style={styles.contactName}>{contactName}</Text>
          <View style={styles.statusRow}>
            {callState === 'connected' && (
              <Ionicons name="lock-closed" size={11} color="rgba(255,255,255,0.7)" />
            )}
            <Text style={styles.statusLabel}>{statusLabel}</Text>
          </View>
          {callState === 'connected' && (
            <View style={styles.qualityRow}>
              <Ionicons name="cellular" size={12} color="#25D366" />
              <Text style={styles.qualityText}>HD · E2E Encrypted</Text>
            </View>
          )}
        </View>
      )}

      {/* Self preview for video */}
      {isVideo && !isGroup && (
        <View style={styles.selfPreview}>
          <Image source={{ uri: currentUser.avatar }} style={styles.selfPreviewImg} contentFit="cover" transition={200} />
          {videoOff && (
            <View style={styles.videoOffOverlay}>
              <Ionicons name="videocam-off" size={16} color="#FFF" />
            </View>
          )}
        </View>
      )}

      {/* Controls */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={[styles.controlsWrap, { paddingBottom: insets.bottom + 24 }]}
      >
        {/* Secondary controls */}
        <View style={styles.secondaryControls}>
          <TouchableOpacity style={styles.secBtn} onPress={() => {}}>
            <Ionicons name="add-outline" size={22} color="#FFF" />
            <Text style={styles.secBtnText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secBtn} onPress={() => {}}>
            <Ionicons name="chatbubble-outline" size={22} color="#FFF" />
            <Text style={styles.secBtnText}>Message</Text>
          </TouchableOpacity>
          {isVideo && (
            <TouchableOpacity style={styles.secBtn} onPress={() => {}}>
              <Ionicons name="camera-reverse-outline" size={22} color="#FFF" />
              <Text style={styles.secBtnText}>Flip</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.secBtn} onPress={() => {}}>
            <Ionicons name="recording-outline" size={22} color="#FFF" />
            <Text style={styles.secBtnText}>Record</Text>
          </TouchableOpacity>
        </View>

        {/* Primary controls */}
        <View style={styles.primaryControls}>
          <TouchableOpacity
            style={[styles.controlBtn, muted && styles.controlBtnActive]}
            onPress={() => setMuted(!muted)}
          >
            <Ionicons name={muted ? 'mic-off' : 'mic'} size={26} color="#FFF" />
          </TouchableOpacity>

          {isVideo && (
            <TouchableOpacity
              style={[styles.controlBtn, videoOff && styles.controlBtnActive]}
              onPress={() => setVideoOff(!videoOff)}
            >
              <Ionicons name={videoOff ? 'videocam-off' : 'videocam'} size={24} color="#FFF" />
            </TouchableOpacity>
          )}

          {/* End call */}
          <TouchableOpacity style={styles.endCallBtn} onPress={handleEndCall} activeOpacity={0.85}>
            <LinearGradient colors={['#E74C3C', '#C0392B']} style={styles.endCallGrad}>
              <Ionicons name="call" size={28} color="#FFF" style={{ transform: [{ rotate: '135deg' }] }} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, speakerOn && styles.controlBtnActive]}
            onPress={() => setSpeakerOn(!speakerOn)}
          >
            <Ionicons name={speakerOn ? 'volume-high' : 'volume-medium'} size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlBtn} onPress={() => {}}>
            <Ionicons name="ellipsis-horizontal" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Ended overlay */}
      {callState === 'ended' && (
        <View style={styles.endedOverlay}>
          <LinearGradient colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.95)']} style={StyleSheet.absoluteFillObject} />
          <Ionicons name="call" size={48} color={Colors.error} style={{ transform: [{ rotate: '135deg' }] }} />
          <Text style={styles.endedText}>Call Ended</Text>
          <Text style={styles.endedDuration}>{formatDuration(duration)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.sm, paddingBottom: Spacing.md },
  topBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  callTypeLabel: { fontSize: Fonts.sizes.sm, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  avatarCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  pulseRing: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.08)' },
  pulseRingInner: { position: 'absolute', width: 140, height: 140, top: 10, left: 10, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.06)' },
  mainAvatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: 'rgba(255,255,255,0.4)' },
  contactName: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: '#FFF', marginTop: 20, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusLabel: { fontSize: Fonts.sizes.base, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  qualityRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  qualityText: { fontSize: 11, color: '#25D366', fontWeight: '600' },
  selfPreview: { position: 'absolute', top: 110, right: Spacing.base, width: 90, height: 130, borderRadius: Radius.md, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  selfPreviewImg: { width: '100%', height: '100%' },
  videoOffOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center' },
  gridContainer: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 4, gap: 4 },
  gridCell: { width: (width - 12) / 2, height: (height - 280) / 2, borderRadius: Radius.md, overflow: 'hidden', backgroundColor: '#0A3D30' },
  gridAvatar: { width: '100%', height: '100%' },
  gridOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, justifyContent: 'flex-end', paddingHorizontal: 8, paddingBottom: 6, flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  gridName: { flex: 1, fontSize: 11, fontWeight: '700', color: '#FFF' },
  youBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: Colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  youBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFF' },
  controlsWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingTop: 60 },
  secondaryControls: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.xl, marginBottom: Spacing.xl },
  secBtn: { alignItems: 'center', gap: 4 },
  secBtnText: { fontSize: 10, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
  primaryControls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: Spacing.lg, paddingHorizontal: Spacing.xl },
  controlBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  controlBtnActive: { backgroundColor: 'rgba(231,76,60,0.4)' },
  endCallBtn: { borderRadius: 34, overflow: 'hidden' },
  endCallGrad: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center' },
  endedOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  endedText: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: '#FFF' },
  endedDuration: { fontSize: Fonts.sizes.base, color: 'rgba(255,255,255,0.7)' },
});
