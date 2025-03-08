'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { translateAuthError } from './authErrors';

export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const { signOut } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    const handleError = async (event: ErrorEvent) => {
      const error = event.error;

      console.error('グローバルエラー:', error);

      // エラーメッセージを翻訳
      const translatedError = translateAuthError(error.message);
      console.error('翻訳されたエラー:', translatedError);

      if (
        error.message.includes('認証が必要です') ||
        error.message.includes('無効なトークン') ||
        error.message.includes('401') ||
        error.message.includes('auth/invalid-credential') ||
        error.message.includes('Token has expired')
      ) {
        await signOut();
        router.push('/login?error=auth_failed');
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [router, signOut]);

  return <>{children}</>;
}
