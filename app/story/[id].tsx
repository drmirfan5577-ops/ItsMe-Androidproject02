import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/hooks/useApp';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { storyService } from '@/services/backendService';

const { width, height } = Dimensions.get('window');

export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { stories, markStoryViewed, backendUser } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [progress, setProgress] = useState(0);

  const story = stories.find(s => s.id === id);

  useEffect(() => {
    if (story) {
      markStoryViewed(story.id);
      if (backendUser) {
        storyService.viewStory(story.id, backendUser.id);
      }
    }
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { router.back(); return 100; }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  if (!story) return null;
  const item = story.stories[0];

  return (
    <View style={styles.container}>
      {item.type === 'image' ? (
        <Image source={{ uri: item.content }} style={styles.bg} contentFit="cover" transition={300} />
      ) : (
        <LinearGradient colors={['#128C7E', '#00A884', '#25D366']} style={styles.bg} />
      )}

      <LinearGradient colors={['rgba(0,0,0,0.55)', 'transparent']} style={[styles.topOverlay, { paddingTop: insets.top + 8 }]}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.userRow}>
          <Image source={{ uri: story.user.avatar }} style={styles.avatar} contentFit="cover" transition={200} />
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{story.user.name}</Text>
            <Text style={styles.storyTime}>{item.time}</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={26} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {item.type === 'text' && (
        <View style={styles.textContent}>
          <Text style={styles.storyText}>{item.content}</Text>
        </View>
      )}

      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.55)']} style={[styles.bottomOverlay, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.replyRow}>
          <View style={styles.replyInput}>
            <Text style={styles.replyPlaceholder}>Reply to {story.user.name.split(' ')[0]}...</Text>
          </View>
          <TouchableOpacity style={styles.likeBtn}>
            <Ionicons name="heart-outline" size={26} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtn}>
            <Ionicons name="paper-plane-outline" size={26} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bg: { position: 'absolute', width, height },
  topOverlay: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: Spacing.base, paddingBottom: Spacing.xl },
  progressBar: { height: 3, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 2, marginBottom: Spacing.md, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FFF', borderRadius: 2 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  avatar: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)' },
  userName: { fontSize: Fonts.sizes.base, fontWeight: '700', color: '#FFF' },
  storyTime: { fontSize: Fonts.sizes.xs, color: 'rgba(255,255,255,0.7)' },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  textContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl },
  storyText: { fontSize: 26, fontWeight: '800', color: '#FFF', textAlign: 'center', lineHeight: 36, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  bottomOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: Spacing.base, paddingTop: Spacing.xl },
  replyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  replyInput: { flex: 1, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)', borderRadius: 24, paddingHorizontal: Spacing.base, paddingVertical: 11 },
  replyPlaceholder: { color: 'rgba(255,255,255,0.8)', fontSize: Fonts.sizes.sm },
  likeBtn: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  shareBtn: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
});
