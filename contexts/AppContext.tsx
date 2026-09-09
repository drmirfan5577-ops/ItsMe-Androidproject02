// It's Me — Full Backend-Connected App Context
import React, { createContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { getSupabaseClient } from '@/template';
import { useBackendAuth, BackendUser } from '@/hooks/useBackendAuth';
import { messageService, storyService, communityService, notificationService } from '@/services/backendService';
import { registerForPushNotifications, addNotificationListener, addResponseListener, scheduleLocalNotification, setBadgeCount } from '@/services/notificationService';
import { MOCK_CHATS, MOCK_STORIES, MOCK_COMMUNITIES, Chat, Story, Community, Message, User, CURRENT_USER } from '@/services/mockData';
import { ThemeKey } from '@/constants/theme';

// ── Helpers ──────────────────────────────────────────────────────────────────
const toUser = (bu: BackendUser): User => ({
  id: bu.id,
  name: bu.display_name,
  phone: bu.phone,
  avatar: bu.avatar_url,
  status: bu.status_text,
  about: bu.about_text,
  online: bu.is_online,
  lastSeen: 'Online',
  verified: true,
});

// ── Context type ──────────────────────────────────────────────────────────────
interface AppContextType {
  currentUser: User;
  backendUser: BackendUser | null;
  isLoggedIn: boolean;
  authLoading: boolean;
  language: 'en' | 'ur' | 'ar';
  activeTheme: ThemeKey;
  chats: Chat[];
  stories: Story[];
  communities: Community[];
  isAdminUnlocked: boolean;
  theme: 'bright';
  notifications: any[];
  unreadNotifCount: number;

  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  sendOTP: (email: string) => Promise<{ error: string | null }>;
  verifyOTP: (email: string, token: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  toggleLanguage: () => void;
  setLanguage: (lang: 'en' | 'ur' | 'ar') => void;
  setActiveTheme: (theme: ThemeKey) => void;
  sendMessage: (chatId: string, text: string, type?: Message['type']) => void;
  updateProfile: (updates: Partial<User> & Record<string, any>) => Promise<void>;
  unlockAdmin: (password: string) => boolean;
  lockAdmin: () => void;
  joinCommunity: (communityId: string) => void;
  requestJoinCommunity: (communityId: string) => void;
  markStoryViewed: (storyId: string) => void;
  pinnedChats: string[];
  togglePinChat: (chatId: string) => void;
  refreshChats: () => void;
  markNotificationsRead: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const auth = useBackendAuth();
  const [language, setLanguageState] = useState<'en' | 'ur' | 'ar'>('en');
  const [activeTheme, setActiveThemeState] = useState<ThemeKey>('emerald');
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [pinnedChats, setPinnedChats] = useState<string[]>(['c1']);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ADMIN_PASSWORD = 'ItsMe@Admin2024';

  const currentUser: User = auth.user ? toUser(auth.user) : CURRENT_USER;

  // ── Push notification setup ───────────────────────────────────────────────
  useEffect(() => {
    if (!auth.user) return;
    registerForPushNotifications().then(token => {
      if (token && auth.user) {
        import('@/services/backendService').then(({ profileService }) => {
          profileService.savePushToken(auth.user!.id, token);
        });
      }
    });
    const notifSub = addNotificationListener((notification) => {
      const { title, body } = notification.request.content;
      setNotifications(prev => [{ id: Date.now(), title, body, read: false, created_at: new Date().toISOString() }, ...prev]);
      setUnreadNotifCount(prev => prev + 1);
    });
    const responseSub = addResponseListener((_response) => {
      setBadgeCount(0);
    });
    return () => { notifSub.remove(); responseSub.remove(); };
  }, [auth.user]);

  // ── Load backend notifications ────────────────────────────────────────────
  useEffect(() => {
    if (!auth.user) return;
    notificationService.getMyNotifications(auth.user.id).then(data => {
      setNotifications(data);
      const unread = data.filter((n: any) => !n.is_read).length;
      setUnreadNotifCount(unread);
      setBadgeCount(unread);
    });
  }, [auth.user]);

  // ── Load communities ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!auth.user) return;
    Promise.all([
      communityService.getCommunities(),
      communityService.getMyCommunities(auth.user.id),
    ]).then(([{ data: commsData }, memberships]) => {
      if (commsData) {
        const memberMap = new Map(memberships.map((m: any) => [m.community_id, m]));
        const merged = commsData.map((c: any) => {
          const membership = memberMap.get(c.id) as any;
          return {
            id: c.id,
            name: c.name,
            description: c.description ?? '',
            avatar: c.avatar_url ?? 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150&h=150&fit=crop',
            members: c.member_count ?? 0,
            isJoined: membership?.status === 'active',
            isAdmin: membership?.role === 'owner' || membership?.role === 'admin',
            category: c.category ?? 'General',
            lastActivity: 'Recently',
            requestPending: membership?.status === 'pending',
          };
        });
        setCommunities(merged);
      }
    });
  }, [auth.user]);

  // ── Load stories ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!auth.user) return;
    Promise.all([
      storyService.getActiveStories(),
      storyService.getViewedStoryIds(auth.user.id),
    ]).then(([{ data: storiesData }, viewedIds]) => {
      if (storiesData && storiesData.length > 0) {
        const grouped = new Map<string, any>();
        storiesData.forEach((s: any) => {
          const uid = s.user_id;
          if (!grouped.has(uid)) {
            grouped.set(uid, {
              id: s.id,
              user: {
                id: s.user?.id ?? uid,
                name: s.user?.display_name ?? 'User',
                avatar: s.user?.avatar_url ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
              },
              viewed: viewedIds.includes(s.id),
              stories: [],
            });
          }
          grouped.get(uid).stories.push({
            id: s.id,
            type: s.story_type,
            content: s.content,
            time: new Date(s.created_at).toLocaleTimeString(),
            duration: 5,
          });
        });
        setStories(Array.from(grouped.values()));
      }
    });
  }, [auth.user]);

  const refreshChats = useCallback(() => {}, []);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const { error } = await auth.signIn(email, password);
    return !error;
  }, [auth]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    return auth.signUp(email, password, name);
  }, [auth]);

  const logout = useCallback(async () => {
    setIsAdminUnlocked(false);
    await auth.signOut();
    if (pollRef.current) clearInterval(pollRef.current);
  }, [auth]);

  // ── Language ──────────────────────────────────────────────────────────────
  const setLanguage = useCallback((lang: 'en' | 'ur' | 'ar') => {
    setLanguageState(lang);
    if (auth.user) {
      import('@/services/backendService').then(({ profileService }) => {
        profileService.updateProfile(auth.user!.id, { language: lang });
      });
    }
  }, [auth.user]);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => prev === 'en' ? 'ur' : prev === 'ur' ? 'ar' : 'en');
  }, []);

  const setActiveTheme = useCallback((theme: ThemeKey) => {
    setActiveThemeState(theme);
    if (auth.user) {
      import('@/services/backendService').then(({ profileService }) => {
        profileService.updateProfile(auth.user!.id, { theme });
      });
    }
  }, [auth.user]);

  // ── Messaging ─────────────────────────────────────────────────────────────
  const sendMessage = useCallback((chatId: string, text: string, type: Message['type'] = 'text') => {
    const newMessage: Message = {
      id: `m_${Date.now()}`,
      senderId: auth.user?.id ?? 'me',
      text,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      type,
      read: false,
      delivered: true,
      encrypted: true,
    };
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return { ...chat, messages: [...chat.messages, newMessage], lastMessage: type === 'voice' ? '🎤 Voice message' : text, lastTime: newMessage.time, unread: 0 };
      }
      return chat;
    }));

    // Simulated reply for demo
    setTimeout(() => {
      const replies = ['JazakAllah Khair! 🤲', 'Alhamdulillah!', 'Subhan Allah! ☪', 'InshAllah 🌙', 'MashaAllah! 🌟', '✅ Noted!'];
      const reply: Message = {
        id: `m_${Date.now()}_r`,
        senderId: chatId,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        type: 'text',
        read: false,
        delivered: true,
        encrypted: true,
      };
      setChats(prev => prev.map(chat =>
        chat.id === chatId ? { ...chat, messages: [...chat.messages, reply], lastMessage: reply.text, lastTime: reply.time, unread: 1 } : chat
      ));
      scheduleLocalNotification('New message', reply.text, 0);
      setUnreadNotifCount(prev => prev + 1);
    }, 1800 + Math.random() * 1200);
  }, [auth.user]);

  // ── Profile ───────────────────────────────────────────────────────────────
  const updateProfile = useCallback(async (updates: Partial<User> & Record<string, any>) => {
    if (auth.user) {
      const backendUpdates: Record<string, any> = {};
      if (updates.name) backendUpdates.display_name = updates.name;
      if (updates.status) backendUpdates.status_text = updates.status;
      if (updates.about) backendUpdates.about_text = updates.about;
      if (updates.avatar) backendUpdates.avatar_url = updates.avatar;
      if (updates.avatar_url) backendUpdates.avatar_url = updates.avatar_url;
      if (updates.phone) backendUpdates.phone = updates.phone;
      await auth.updateMyProfile(backendUpdates);
    }
  }, [auth]);

  // ── Admin ─────────────────────────────────────────────────────────────────
  const unlockAdmin = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) { setIsAdminUnlocked(true); return true; }
    return false;
  }, []);
  const lockAdmin = useCallback(() => setIsAdminUnlocked(false), []);

  // ── Communities ───────────────────────────────────────────────────────────
  const joinCommunity = useCallback((communityId: string) => {
    setCommunities(prev => prev.map(c =>
      c.id === communityId ? { ...c, isJoined: true, requestPending: false, members: c.members + 1 } : c
    ));
    if (auth.user) communityService.joinCommunity(communityId, auth.user.id, false);
  }, [auth.user]);

  const requestJoinCommunity = useCallback((communityId: string) => {
    setCommunities(prev => prev.map(c =>
      c.id === communityId ? { ...c, requestPending: true } : c
    ));
    if (auth.user) communityService.joinCommunity(communityId, auth.user.id, true);
  }, [auth.user]);

  // ── Stories ───────────────────────────────────────────────────────────────
  const markStoryViewed = useCallback((storyId: string) => {
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, viewed: true } : s));
    if (auth.user) storyService.viewStory(storyId, auth.user.id);
  }, [auth.user]);

  // ── Pins & Notifications ──────────────────────────────────────────────────
  const togglePinChat = useCallback((chatId: string) => {
    setPinnedChats(prev => prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]);
  }, []);

  const markNotificationsRead = useCallback(() => {
    setUnreadNotifCount(0);
    setBadgeCount(0);
    if (auth.user) notificationService.markAllRead(auth.user.id);
  }, [auth.user]);

  return (
    <AppContext.Provider value={{
      currentUser, backendUser: auth.user,
      isLoggedIn: auth.isLoggedIn, authLoading: auth.authLoading,
      language, activeTheme,
      chats, stories, communities,
      isAdminUnlocked, theme: 'bright',
      notifications, unreadNotifCount,
      login, register, sendOTP: auth.sendOTP, verifyOTP: auth.verifyOTP,
      logout, toggleLanguage, setLanguage, setActiveTheme,
      sendMessage, updateProfile,
      unlockAdmin, lockAdmin,
      joinCommunity, requestJoinCommunity,
      markStoryViewed, pinnedChats, togglePinChat,
      refreshChats, markNotificationsRead,
    }}>
      {children}
    </AppContext.Provider>
  );
}
