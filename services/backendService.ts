// It's Me — OnSpace Cloud Backend Service
import { getSupabaseClient } from '@/template';

const supabase = getSupabaseClient();

// ─── AUTH ───────────────────────────────────────────────────────────────────
export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  },

  async signUp(email: string, password: string, displayName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    return { data, error };
  },

  async sendOTP(email: string) {
    const { error } = await supabase.auth.signInWithOtp({ email });
    return { error };
  },

  async verifyOTP(email: string, token: string, password?: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  async getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },
};

// ─── PROFILE ─────────────────────────────────────────────────────────────────
export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async updateProfile(userId: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  async setOnline(userId: string, isOnline: boolean) {
    await supabase.from('user_profiles').update({
      is_online: isOnline,
      last_seen: new Date().toISOString(),
    }).eq('id', userId);
  },

  async savePushToken(userId: string, token: string) {
    await supabase.from('user_profiles').update({ push_token: token }).eq('id', userId);
  },

  async getAllProfiles() {
    const { data } = await supabase.from('user_profiles').select('*').limit(50);
    return data ?? [];
  },
};

// ─── CONVERSATIONS ────────────────────────────────────────────────────────────
export const conversationService = {
  async getMyConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversation_participants')
      .select(`
        *,
        conversation:conversations(*)
      `)
      .eq('user_id', userId)
      .order('joined_at', { ascending: false });
    return { data, error };
  },

  async findOrCreateDirectChat(userId: string, otherUserId: string) {
    // Find existing direct chat
    const { data: existing } = await supabase.rpc
      ? await supabase.from('conversation_participants').select('conversation_id').eq('user_id', userId)
      : { data: [] };

    // Create new conversation
    const { data: conv, error } = await supabase
      .from('conversations')
      .insert({ type: 'direct', created_by: userId })
      .select()
      .single();
    if (error || !conv) return { data: null, error };

    // Add both participants
    await supabase.from('conversation_participants').insert([
      { conversation_id: conv.id, user_id: userId },
      { conversation_id: conv.id, user_id: otherUserId },
    ]);
    return { data: conv, error: null };
  },

  async updateLastMessage(convId: string, text: string) {
    await supabase.from('conversations').update({
      last_message_text: text,
      last_message_time: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', convId);
  },
};

// ─── MESSAGES ─────────────────────────────────────────────────────────────────
export const messageService = {
  async getMessages(conversationId: string, limit = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select(`*, sender:user_profiles(id, display_name, avatar_url)`)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);
    return { data, error };
  },

  async sendMessage(conversationId: string, senderId: string, content: string, type = 'text', mediaUrl?: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        message_type: type,
        media_url: mediaUrl,
        is_encrypted: true,
      })
      .select()
      .single();

    if (!error && data) {
      await conversationService.updateLastMessage(conversationId, type === 'voice' ? '🎤 Voice message' : content);
    }
    return { data, error };
  },

  async markAsRead(conversationId: string, userId: string) {
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId);

    await supabase
      .from('conversation_participants')
      .update({ unread_count: 0 })
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);
  },

  async pollNewMessages(conversationId: string, afterTimestamp: string) {
    const { data } = await supabase
      .from('messages')
      .select(`*, sender:user_profiles(id, display_name, avatar_url)`)
      .eq('conversation_id', conversationId)
      .gt('created_at', afterTimestamp)
      .order('created_at', { ascending: true });
    return data ?? [];
  },
};

// ─── STORIES ──────────────────────────────────────────────────────────────────
export const storyService = {
  async getActiveStories() {
    const { data, error } = await supabase
      .from('stories')
      .select(`*, user:user_profiles(id, display_name, avatar_url)`)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createStory(userId: string, content: string, type: 'text' | 'image', bgColor = '#00A884') {
    const { data, error } = await supabase
      .from('stories')
      .insert({ user_id: userId, content, story_type: type, bg_color: bgColor })
      .select()
      .single();
    return { data, error };
  },

  async viewStory(storyId: string, viewerId: string) {
    await supabase.from('story_views').upsert({
      story_id: storyId,
      viewer_id: viewerId,
    }, { onConflict: 'story_id,viewer_id' });

    await supabase.rpc ? null : await supabase
      .from('stories')
      .update({ view_count: 0 })
      .eq('id', storyId);
  },

  async getViewedStoryIds(userId: string) {
    const { data } = await supabase
      .from('story_views')
      .select('story_id')
      .eq('viewer_id', userId);
    return (data ?? []).map((d: any) => d.story_id as string);
  },
};

// ─── COMMUNITIES ─────────────────────────────────────────────────────────────
export const communityService = {
  async getCommunities() {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .order('member_count', { ascending: false });
    return { data, error };
  },

  async getMyCommunities(userId: string) {
    const { data } = await supabase
      .from('community_members')
      .select('community_id, role, status')
      .eq('user_id', userId);
    return data ?? [];
  },

  async joinCommunity(communityId: string, userId: string, isPrivate: boolean) {
    const status = isPrivate ? 'pending' : 'active';
    const { error } = await supabase.from('community_members').upsert({
      community_id: communityId,
      user_id: userId,
      role: 'member',
      status,
    }, { onConflict: 'community_id,user_id' });

    if (!error && !isPrivate) {
      // increment member count
      await supabase.from('communities').update({
        member_count: 0, // will be updated via trigger in v2
      }).eq('id', communityId);
    }
    return { error, status };
  },

  async createCommunity(userId: string, name: string, description: string, category: string, isPrivate: boolean) {
    const { data, error } = await supabase
      .from('communities')
      .insert({ name, description, category, is_private: isPrivate, created_by: userId })
      .select()
      .single();
    if (!error && data) {
      await supabase.from('community_members').insert({
        community_id: data.id,
        user_id: userId,
        role: 'owner',
        status: 'active',
      });
    }
    return { data, error };
  },
};

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const notificationService = {
  async getMyNotifications(userId: string) {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    return data ?? [];
  },

  async createNotification(userId: string, title: string, body: string, type = 'message', notifData: any = {}) {
    await supabase.from('notifications').insert({
      user_id: userId,
      title,
      body,
      type,
      data: notifData,
    });
  },

  async markAllRead(userId: string) {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId);
  },

  async getUnreadCount(userId: string) {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    return count ?? 0;
  },
};

// ─── ADMIN ────────────────────────────────────────────────────────────────────
export const adminService = {
  async getTotalUsers() {
    const { count } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });
    return count ?? 0;
  },

  async getTotalMessages() {
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true });
    return count ?? 0;
  },

  async getAppSettings() {
    const { data } = await supabase.from('app_settings').select('*');
    return data ?? [];
  },

  async broadcastNotification(title: string, body: string) {
    const { data: users } = await supabase.from('user_profiles').select('id');
    if (!users) return;
    const inserts = users.map((u: any) => ({ user_id: u.id, title, body, type: 'admin' }));
    await supabase.from('notifications').insert(inserts);
  },
};
