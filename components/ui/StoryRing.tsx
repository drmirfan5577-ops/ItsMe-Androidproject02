import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { Story } from '@/services/mockData';

interface StoryRingProps {
  story: Story;
  onPress: () => void;
  size?: number;
}

function StoryRing({ story, onPress, size = 60 }: StoryRingProps) {
  const ringSize = size + 6;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={[
        styles.ring,
        { width: ringSize, height: ringSize, borderRadius: ringSize / 2 },
        story.viewed ? styles.viewedRing : styles.unviewedRing,
      ]}>
        <Image
          source={{ uri: story.user.avatar }}
          style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
          contentFit="cover"
          transition={200}
        />
      </View>
      <Text style={styles.name} numberOfLines={1}>{story.user.name.split(' ')[0]}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 5,
    width: 72,
  },
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  unviewedRing: {
    borderWidth: 2.5,
    borderColor: Colors.primary,
  },
  viewedRing: {
    borderWidth: 2.5,
    borderColor: Colors.border,
  },
  avatar: {
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  name: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textPrimary,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default memo(StoryRing);
