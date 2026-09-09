import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';
import { Colors, Fonts, Spacing, Radius, Shadow } from '@/constants/theme';
import { Message } from '@/services/mockData';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { chats, sendMessage, currentUser, language } = useApp();
  const { showAlert } = useAlert();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const flatRef = useRef<FlatList>(null);

  const chat = chats.find(c => c.id === id);

  useEffect(() => {
    if (!chat) return;
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: false }), 200);
  }, [chat?.messages.length]);

  if (!chat) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
      <Text style={{ color: Colors.textMuted }}>Chat not found</Text>
    </View>
  );

  const { contact, messages } = chat;

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(id, text.trim());
    setText('');
  };

  const handleVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      sendMessage(id, '🎤 Voice message (0:03)', 'voice');
    }, 2000);
  };

  const renderMessage = useCallback(({ item, index }: { item: Message; index: number }) => {
    const isMe = item.senderId === 'me' || item.senderId === currentUser.id;
    const prevMsg = messages[index - 1];
    const showAvatar = !isMe && (!prevMsg || prevMsg.senderId !== item.senderId);

    return (
      <View style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowThem]}>
        {!isMe && (
          <View style={styles.avatarSlot}>
            {showAvatar ? (
              <Image source={{ uri: contact.avatar }} style={styles.msgAvatar} contentFit="cover" transition={200} />
            ) : null}
          </View>
        )}
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          {item.type === 'voice' ? (
            <View style={styles.voiceMsg}>
              <Ionicons name="play-circle" size={28} color={isMe ? Colors.primaryDark : Colors.primary} />
              <View style={styles.voiceWave}>
                {[4, 8, 6, 10, 7, 5, 9, 6, 8, 4].map((h, i) => (
                  <View key={i} style={[styles.voiceBar, { height: h * 2, backgroundColor: isMe ? Colors.primaryDark : Colors.primary }]} />
                ))}
              </View>
              <Text style={styles.voiceDuration}>0:03</Text>
            </View>
          ) : (
            <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
              {item.text}
            </Text>
          )}
          <View style={styles.bubbleMeta}>
            {item.encrypted && <Ionicons name="lock-closed" size={9} color={isMe ? Colors.primaryDark : Colors.textMuted} />}
            <Text style={[styles.bubbleTime, isMe ? styles.bubbleTimeMe : styles.bubbleTimeThem]}>
              {item.time}
            </Text>
            {isMe && (
              <Ionicons
                name={item.read ? 'checkmark-done' : 'checkmark'}
                size={14}
                color={item.read ? '#34B7F1' : Colors.textMuted}
              />
            )}
          </View>
        </View>
      </View>
    );
  }, [contact.avatar, messages, currentUser.id]);

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
        <TouchableOpacity style={styles.contactInfo} activeOpacity={0.85}>
          <View style={styles.headerAvatarWrap}>
            <Image source={{ uri: contact.avatar }} style={styles.headerAvatar} contentFit="cover" transition={200} />
            {contact.online && <View style={styles.onlineDot} />}
          </View>
          <View>
            <View style={styles.headerNameRow}>
              <Text style={styles.headerName}>{contact.name}</Text>
              {contact.verified && <MaterialIcons name="verified" size={14} color="rgba(255,255,255,0.9)" />}
            </View>
            <View style={styles.headerStatus}>
              <Ionicons name="lock-closed" size={10} color="rgba(255,255,255,0.7)" />
              <Text style={styles.headerStatusText}>
                {contact.online ? 'Online · E2E Encrypted' : `${contact.lastSeen} · E2E Encrypted`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.push(`/call/${id}?type=video&name=${encodeURIComponent(contact.name)}&avatar=${encodeURIComponent(contact.avatar)}`)}>
            <Ionicons name="videocam-outline" size={22} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.push(`/call/${id}?type=voice&name=${encodeURIComponent(contact.name)}&avatar=${encodeURIComponent(contact.avatar)}`)}>
            <Ionicons name="call-outline" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => showAlert('More Options', 'View contact · Media, links, docs · Mute notifications · Search messages · Block')}>
            <Ionicons name="ellipsis-vertical" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Messages */}
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.encBanner}>
            <Ionicons name="lock-closed" size={12} color={Colors.primary} />
            <Text style={styles.encBannerText}>
              {language === 'ur' ? 'پیغامات مکمل محفوظ ہیں' : "Messages are end-to-end encrypted. Tap to learn more."}
            </Text>
          </View>
        }
      />

      {/* Input Bar */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          <TouchableOpacity style={styles.attachBtn} onPress={() => showAlert('Attach', 'Image · Video · Document · Location · Contact\n\nFull attachment support in V2.0!')}>
            <Ionicons name="add-circle-outline" size={26} color={Colors.primary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder={language === 'ur' ? 'پیغام لکھیں...' : 'Type a message...'}
            placeholderTextColor={Colors.textMuted}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={4096}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.emojiBtn} onPress={() => showAlert('Emoji', '😀 😂 🥰 🤲 🌙 ⭐ ☪ 💚 📖 🕌 ✨ 🌿')}>
            <Ionicons name="happy-outline" size={24} color={Colors.textMuted} />
          </TouchableOpacity>
          {text.trim() ? (
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.85}>
              <LinearGradient colors={['#25D366', '#00A884']} style={styles.sendGrad}>
                <Ionicons name="send" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.sendBtn, isRecording && styles.sendBtnRecording]}
              onPress={handleVoice}
              activeOpacity={0.85}
            >
              <LinearGradient colors={isRecording ? ['#E74C3C', '#C0392B'] : ['#25D366', '#00A884']} style={styles.sendGrad}>
                <Ionicons name={isRecording ? 'stop' : 'mic'} size={22} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing.sm, paddingBottom: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: 4 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  contactInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  headerAvatarWrap: { position: 'relative' },
  headerAvatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  onlineDot: { position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: 6, backgroundColor: Colors.online, borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)' },
  headerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerName: { fontSize: Fonts.sizes.base, fontWeight: '700', color: '#FFF' },
  headerStatus: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  headerStatusText: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  encBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: Colors.goldLight, marginHorizontal: Spacing.base, marginTop: Spacing.md, borderRadius: Radius.md, padding: Spacing.sm, borderWidth: 1, borderColor: '#F0D58A' },
  encBannerText: { fontSize: Fonts.sizes.xs, color: Colors.textGold },
  messageList: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.md, gap: 4, paddingBottom: 16 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 2 },
  msgRowMe: { justifyContent: 'flex-end' },
  msgRowThem: { justifyContent: 'flex-start' },
  avatarSlot: { width: 28 },
  msgAvatar: { width: 28, height: 28, borderRadius: 14 },
  bubble: { maxWidth: '78%', paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.lg, ...Shadow.sm },
  bubbleMe: { backgroundColor: Colors.bubbleOut, borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: Colors.bubbleIn, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.borderLight },
  bubbleText: { fontSize: Fonts.sizes.base, lineHeight: 22 },
  bubbleTextMe: { color: Colors.bubbleOutText },
  bubbleTextThem: { color: Colors.bubbleInText },
  bubbleMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3, justifyContent: 'flex-end' },
  bubbleTime: { fontSize: 10, fontWeight: '500' },
  bubbleTimeMe: { color: Colors.textSecondary },
  bubbleTimeThem: { color: Colors.textMuted },
  voiceMsg: { flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 160 },
  voiceWave: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 2 },
  voiceBar: { width: 3, borderRadius: 2, opacity: 0.7 },
  voiceDuration: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: Spacing.sm, paddingTop: Spacing.sm, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.divider },
  attachBtn: { width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, backgroundColor: Colors.backgroundAlt, borderRadius: Radius.xl, paddingHorizontal: Spacing.md, paddingVertical: 10, fontSize: Fonts.sizes.base, color: Colors.textPrimary, maxHeight: 120, borderWidth: 1, borderColor: Colors.border },
  emojiBtn: { width: 36, height: 44, alignItems: 'center', justifyContent: 'center' },
  sendBtn: { borderRadius: 22, overflow: 'hidden' },
  sendBtnRecording: { opacity: 0.9 },
  sendGrad: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
