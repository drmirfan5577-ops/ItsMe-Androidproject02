// Real Backend Auth Hook for It's Me
import { useState, useEffect, useCallback } from 'react';
import { authService, profileService } from '@/services/backendService';
import { getSupabaseClient } from '@/template';

const supabase = getSupabaseClient();

export interface BackendUser {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  status_text: string;
  about_text: string;
  its_me_id: string;
  phone: string;
  is_online: boolean;
  language: string;
  is_admin: boolean;
  push_token?: string;
}

export function useBackendAuth() {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await profileService.getProfile(userId);
    if (data) {
      setUser({
        id: data.id,
        email: data.email ?? '',
        display_name: data.display_name ?? data.username ?? 'It\'s Me User',
        avatar_url: data.avatar_url ?? `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`,
        status_text: data.status_text ?? '🌟 Available',
        about_text: data.about_text ?? 'Hey there! I am using It\'s Me.',
        its_me_id: data.its_me_id ?? `@user_${userId.slice(0, 6)}`,
        phone: data.phone ?? '',
        is_online: true,
        language: data.language ?? 'en',
        is_admin: data.is_admin ?? false,
        push_token: data.push_token,
      });
    }
  }, []);

  useEffect(() => {
    // Check current session
    authService.getSession().then(async (session) => {
      if (session?.user) {
        await loadProfile(session.user.id);
        profileService.setOnline(session.user.id, true);
      }
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadProfile(session.user.id);
        profileService.setOnline(session.user.id, true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    setOperationLoading(true);
    const { data, error } = await authService.signIn(email, password);
    setOperationLoading(false);
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    setOperationLoading(true);
    const { data, error } = await authService.signUp(email, password, displayName);
    setOperationLoading(false);
    if (error) return { error: error.message };
    // After sign up, update profile with display name
    if (data.user) {
      await profileService.updateProfile(data.user.id, {
        display_name: displayName,
        its_me_id: `@${displayName.replace(/\s+/g, '').toLowerCase()}_${data.user.id.slice(0, 4)}`,
      });
    }
    return { error: null };
  }, []);

  const sendOTP = useCallback(async (email: string) => {
    setOperationLoading(true);
    const { error } = await authService.sendOTP(email);
    setOperationLoading(false);
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const verifyOTP = useCallback(async (email: string, token: string) => {
    setOperationLoading(true);
    const { data, error } = await authService.verifyOTP(email, token);
    setOperationLoading(false);
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    if (user) profileService.setOnline(user.id, false);
    setOperationLoading(true);
    await authService.signOut();
    setOperationLoading(false);
    setUser(null);
  }, [user]);

  const updateMyProfile = useCallback(async (updates: Partial<BackendUser>) => {
    if (!user) return;
    const { data } = await profileService.updateProfile(user.id, updates);
    if (data) setUser(prev => prev ? { ...prev, ...updates } : null);
  }, [user]);

  return {
    user,
    authLoading,
    operationLoading,
    isLoggedIn: !!user,
    signIn,
    signUp,
    sendOTP,
    verifyOTP,
    signOut,
    updateMyProfile,
    refreshProfile: () => user ? loadProfile(user.id) : Promise.resolve(),
  };
}
