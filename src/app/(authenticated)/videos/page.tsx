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
import { VideoCardProps } from '@/components/molecules/VideoCard';
import { ApiVideo } from '@/types/video';

// APIから返される動画データをVideoCardコンポーネント用に変換する関数
function convertApiVideoToCardProps(video: ApiVideo): VideoCardProps {
  return {
    id: video.id,
    title: video.title,
    description: video.description || '',
    // サムネイルURLはサーバーサイドで生成されたものを使用（存在する場合）
    // 存在しない場合は動画のURLを使用
    thumbnailUrl: video.thumbnail_url || video.file_url,
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

  return <VideoGrid videos={videoCards} isLoading={isLoading} />;
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
