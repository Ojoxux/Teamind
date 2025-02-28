'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Center, Spinner } from '@chakra-ui/react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useSupabaseAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/videos');
      } else {
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  // ローディング中はスピナーを表示
  return (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  );
}
