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
  return (
    <Suspense
      fallback={
        <Center p={8}>
          <Spinner />
        </Center>
      }
    >
      <VideoList />
    </Suspense>
  );
}
