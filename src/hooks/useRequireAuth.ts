import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from './useSupabaseAuth';

export function useRequireAuth(redirectUrl = '/login') {
  const { user, isLoading } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectUrl);
    }
  }, [user, isLoading, router, redirectUrl]);

  return { user, isLoading };
}
