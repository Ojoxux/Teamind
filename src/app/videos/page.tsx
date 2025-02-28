'use client';

import { Suspense } from 'react';
import {
  Box,
  Alert,
  AlertIcon,
  Button,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { VideoGrid } from '@/components/organisms/VideoGrid';
import { useVideos } from '@/hooks/useVideos';
import { MainLayout } from '@/components/templates/MainLayout';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

function VideoList() {
  const { data, error } = useVideos();

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        動画一覧の取得に失敗しました
      </Alert>
    );
  }

  return <VideoGrid videos={data || []} />;
}

export default function VideosPage() {
  const router = useRouter();
  const { user } = useSupabaseAuth();

  if (!user) {
    return (
      <Box p={8}>
        <Alert status="warning">
          <AlertIcon />
          この機能を利用するにはログインが必要です
        </Alert>
        <Center mt={4}>
          <Button colorScheme="blue" onClick={() => router.push('/login')}>
            ログインする
          </Button>
        </Center>
      </Box>
    );
  }

  return (
    <MainLayout>
      <Suspense
        fallback={
          <Center p={8}>
            <Spinner />
          </Center>
        }
      >
        <VideoList />
      </Suspense>
    </MainLayout>
  );
}
