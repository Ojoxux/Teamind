import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from './useSupabaseAuth';

export function useRequireAuth(redirectUrl = '/login') {
  const { user, isLoading: authLoading } = useSupabaseAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      setIsRedirecting(true);
      router.push(redirectUrl);
    } else if (user) {
      setIsRedirecting(false);
    }
  }, [user, authLoading, router, redirectUrl]);

  // 認証チェック中またはリダイレクト中はローディング状態とする
  const isLoading = authLoading || isRedirecting;

  return { user, isLoading };
}
