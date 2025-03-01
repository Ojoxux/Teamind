'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout';

// モックデータ
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

const MOCK_RECENT_VIDEOS = Array.from({ length: 4 }, (_, i) => ({
  id: `recent-${i + 1}`,
  title: `最近の動画 ${i + 1}`,
  thumbnailUrl: `https://picsum.photos/seed/recent-${i + 1}/400/225`,
  duration: Math.floor(Math.random() * 1800) + 300, // 5分〜35分
  uploadDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(), // 最近の日付
  viewCount: Math.floor(Math.random() * 1000),
  channelName: 'マイチャンネル',
  description: `これは最近の動画 ${i + 1} の説明です。`,
}));

const MOCK_POPULAR_VIDEOS = Array.from({ length: 4 }, (_, i) => ({
  id: `popular-${i + 1}`,
  title: `人気の動画 ${i + 1}`,
  thumbnailUrl: `https://picsum.photos/seed/popular-${i + 1}/400/225`,
  duration: Math.floor(Math.random() * 1800) + 300, // 5分〜35分
  uploadDate: new Date(
    Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
  ).toISOString(),
  viewCount: Math.floor(Math.random() * 5000) + 5000, // 高い視聴回数
  channelName: 'マイチャンネル',
  description: `これは人気の動画 ${i + 1} の説明です。`,
}));

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 動画カードクリック時の処理
  const handleVideoClick = (videoId: string) => {
    router.push(`/video/${videoId}`);
  };

  // 動画にクリックハンドラを追加
  const recentVideosWithClickHandler = MOCK_RECENT_VIDEOS.map((video) => ({
    ...video,
    onClick: () => handleVideoClick(video.id),
  }));

  const popularVideosWithClickHandler = MOCK_POPULAR_VIDEOS.map((video) => ({
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
