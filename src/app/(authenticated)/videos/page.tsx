'use client';

import { Suspense } from 'react';
import {
  Box,
  Alert,
  AlertIcon,
  Button,
  Center,
  Spinner,
  Flex,
  Heading,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { VideoGrid } from '@/components/organisms/VideoGrid';
import { useVideos, useRefreshVideos } from '@/hooks/useVideos';
import { VideoCardProps } from '@/components/molecules/VideoCard';
import { ApiVideo } from '@/types/video';
import { RepeatIcon } from '@chakra-ui/icons';

// APIから返される動画データをVideoCardコンポーネント用に変換する関数
function convertApiVideoToCardProps(video: ApiVideo): VideoCardProps {
  return {
    id: video.id,
    title: video.title,
    description: video.description || '',
    // サムネイルURLはサーバーサイドで生成されたものを使用（存在する場合）
    // 存在しない場合は動画のURLを使用
    thumbnailUrl: video.thumbnail_url || '',
    // 動画の長さ（秒）
    duration: video.duration || 0,
    // アップロード日
    uploadDate: video.created_at,
    // カテゴリ（タグの最初の要素を使用）
    category: video.tags && video.tags.length > 0 ? video.tags[0] : undefined,
  };
}

function VideoList() {
  const { data, error, isLoading } = useVideos();
  const refreshVideos = useRefreshVideos();

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        動画一覧の取得に失敗しました
      </Alert>
    );
  }

  // APIから返されたデータを変換
  const videoCards = data
    ? data.map((video) =>
        convertApiVideoToCardProps(video as unknown as ApiVideo)
      )
    : [];

  const handleRefresh = async () => {
    console.log('動画一覧を手動で更新します');
    await refreshVideos();
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="lg">動画一覧</Heading>
        <Tooltip label="動画一覧を更新">
          <IconButton
            aria-label="動画一覧を更新"
            icon={<RepeatIcon />}
            onClick={handleRefresh}
            isLoading={isLoading}
            colorScheme="blue"
            variant="ghost"
          />
        </Tooltip>
      </Flex>
      <VideoGrid videos={videoCards} isLoading={isLoading} />
    </Box>
  );
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
