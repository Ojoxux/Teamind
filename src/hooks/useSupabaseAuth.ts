import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 現在のセッションを取得
    const getCurrentSession = async () => {
      try {
        const { data, error } = await supabaseClient.auth.getSession();

        if (error) {
          console.error('セッション取得エラー:', error);
          setUser(null);
          setSession(null);
        } else {
          setSession(data.session);
          setUser(data.session?.user || null);
        }
      } catch (err) {
        console.error('セッション取得中の例外:', err);
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentSession();

    // 認証状態の変更を監視
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('認証状態変更:', event);
        setSession(newSession);
        setUser(newSession?.user || null);
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Googleでログイン
  const signInWithGoogle = async (redirectUrl?: string) => {
    return supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl || window.location.origin,
      },
    });
  };

  // メール/パスワードでログイン
  const signInWithEmail = async (email: string, password: string) => {
    return supabaseClient.auth.signInWithPassword({ email, password });
  };

  // メール/パスワードで新規登録
  const signUpWithEmail = async (email: string, password: string) => {
    return supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  // パスワードリセットメールの送信
  const resetPassword = async (email: string) => {
    return supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  };

  // ログアウト
  const signOut = async () => {
    return supabaseClient.auth.signOut();
  };

  // 認証トークンの取得 - エラーハンドリングを強化
  const getToken = async (): Promise<string | null> => {
    try {
      const { data, error } = await supabaseClient.auth.getSession();

      if (error) {
        console.error('トークン取得エラー:', error);
        return null;
      }

      return data.session?.access_token || null;
    } catch (err) {
      console.error('トークン取得中の例外:', err);
      return null;
    }
  };

  return {
    user,
    session,
    isLoading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signOut,
    getToken,
  };
}
