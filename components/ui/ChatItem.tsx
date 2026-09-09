import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow } from '@/constants/theme';
import { Chat } from '@/services/mockData';

interface ChatItemProps {
  chat: Chat;
  onPress: () => void;
  onLongPress?: () => void;
  pinned?: boolean;
}

function ChatItem({ chat, onPress, onLongPress, pinned }: ChatItemProps) {
  const { contact, lastMessage, lastTime, unread, muted } = chat;

  return (
    <TouchableOpacity
      style={[styles.container, pinned && styles.pinned]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.75}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: contact.avatar }}
          style={styles.avatar}
          contentFit="cover"
          transition={200}
        />
        {contact.online && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.nameRow}>
            {pinned && <Ionicons name="pin" size={12} color={Colors.gold} style={styles.pinIcon} />}
            <Text style={styles.name} numberOfLines={1}>{contact.name}</Text>
            {contact.verified && <MaterialIcons name="verified" size={14} color={Colors.primary} />}
          </View>
          <Text style={[styles.time, unread > 0 && styles.timeUnread]}>{lastTime}</Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.messageRow}>
            <Ionicons name="lock-closed" size={10} color={Colors.primary} style={{ marginRight: 3 }} />
            {muted && <Ionicons name="volume-mute" size={12} color={Colors.textMuted} style={{ marginRight: 3 }} />}
            <Text style={[styles.lastMessage, unread > 0 && styles.lastMessageUnread]} numberOfLines={1}>
              {lastMessage}
            </Text>
          </View>
          {unread > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unread > 99 ? '99+' : unread}</Text>
            </View>
          ) : (
            <Ionicons name="checkmark-done" size={16} color={Colors.primary} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  pinned: {
    backgroundColor: Colors.surfaceGold,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: Colors.online,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  pinIcon: {
    marginRight: 2,
  },
  name: {
    fontSize: Fonts.sizes.base,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  time: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
  },
  timeUnread: {
    color: Colors.primary,
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lastMessage: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
    flex: 1,
  },
  lastMessageUnread: {
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: Colors.textInverse,
    fontSize: Fonts.sizes.xs,
    fontWeight: '700',
  },
});

export default memo(ChatItem);
