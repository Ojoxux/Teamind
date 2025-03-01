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
import { useRequireAuth } from '@/hooks/useRequireAuth';

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
  const { user, isLoading } = useRequireAuth();

  // 認証チェック中はローディング表示
  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // 認証されていない場合は何も表示しない（リダイレクト処理中）
  if (!user) {
    return null;
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
