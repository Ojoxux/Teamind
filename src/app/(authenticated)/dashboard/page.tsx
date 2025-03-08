'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { useVideos } from '@/hooks/useVideos';
import { VideoCardProps } from '@/components/molecules/VideoCard';
import { ApiVideo } from '@/types/video';

// モックデータ（統計情報）
const MOCK_STATS = [
  {
    label: '総視聴回数',
    value: '12,345',
    helpText: '先週比',
    change: 12,
    isIncreased: true,
  },
  {
    label: '総再生時間',
    value: '1,234時間',
    helpText: '先週比',
    change: 5,
    isIncreased: true,
  },
  { label: '動画数', value: '42', helpText: '先月 +3' },
  {
    label: 'フォロワー',
    value: '567',
    helpText: '先週比',
    change: 2,
    isIncreased: false,
  },
];

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

export default function DashboardPage() {
  const { data, error, isLoading } = useVideos();
  const router = useRouter();

  // 動画カードクリック時の処理
  const handleVideoClick = (videoId: string) => {
    router.push(`/video/${videoId}`);
  };

  // 実際のデータが取得できた場合は、それを使用する
  let recentVideos: VideoCardProps[] = [];
  let popularVideos: VideoCardProps[] = [];

  if (data && data.length > 0) {
    // APIから返されたデータを変換
    const videoCards = data.map((video) =>
      convertApiVideoToCardProps(video as unknown as ApiVideo)
    );

    // 最近の動画（作成日時でソート）
    recentVideos = [...videoCards]
      .sort(
        (a, b) =>
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      )
      .slice(0, 4);

    // 人気の動画（ランダムに選択 - 実際のアプリでは視聴回数などでソートする）
    popularVideos = [...videoCards].sort(() => Math.random() - 0.5).slice(0, 4);
  }

  // 動画にクリックハンドラを追加
  const recentVideosWithClickHandler = recentVideos.map((video) => ({
    ...video,
    onClick: () => handleVideoClick(video.id),
  }));

  const popularVideosWithClickHandler = popularVideos.map((video) => ({
    ...video,
    onClick: () => handleVideoClick(video.id),
  }));

  return (
    <DashboardLayout
      stats={MOCK_STATS}
      recentVideos={recentVideosWithClickHandler}
      popularVideos={popularVideosWithClickHandler}
      isLoading={isLoading}
    />
  );
}
