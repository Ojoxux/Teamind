'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchLayout } from '@/components/templates/SearchLayout';

// FilterState型の定義
type FilterState = {
  categories: Record<string, string[]>;
  duration: [number, number];
  keywords: string[];
};

// モックデータ
const MOCK_VIDEOS = Array.from({ length: 20 }, (_, i) => ({
  id: `search-${i + 1}`,
  title: `検索結果 ${i + 1}`,
  thumbnailUrl: `https://picsum.photos/seed/search-${i + 1}/400/225`,
  duration: Math.floor(Math.random() * 3600) + 300, // 5分〜1時間5分
  uploadDate: new Date(
    Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
  ).toISOString(),
  viewCount: Math.floor(Math.random() * 100000),
  channelName: `チャンネル ${(i % 5) + 1}`,
  description: `これは検索結果 ${
    i + 1
  } の説明です。実際のアプリケーションでは、動画の詳細な説明がここに表示されます。`,
}));

const MOCK_FILTER_CATEGORIES = [
  {
    id: 'uploadDate',
    name: 'アップロード日',
    options: [
      { id: 'today', label: '今日', count: 5 },
      { id: 'week', label: '今週', count: 15 },
      { id: 'month', label: '今月', count: 42 },
      { id: 'year', label: '今年', count: 156 },
    ],
  },
  {
    id: 'duration',
    name: '長さ',
    options: [
      { id: 'short', label: '5分未満', count: 23 },
      { id: 'medium', label: '5〜20分', count: 45 },
      { id: 'long', label: '20分以上', count: 32 },
    ],
  },
  {
    id: 'channel',
    name: 'チャンネル',
    options: [
      { id: 'channel1', label: 'チャンネル 1', count: 12 },
      { id: 'channel2', label: 'チャンネル 2', count: 8 },
      { id: 'channel3', label: 'チャンネル 3', count: 15 },
      { id: 'channel4', label: 'チャンネル 4', count: 7 },
      { id: 'channel5', label: 'チャンネル 5', count: 10 },
    ],
  },
];

const MOCK_KEYWORDS = [
  'プログラミング',
  'JavaScript',
  'React',
  'Next.js',
  'TypeScript',
  'デザイン',
  'UI/UX',
  'チュートリアル',
  'レビュー',
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get('q') || '';

  const [videos, setVideos] = useState(MOCK_VIDEOS);
  const [filteredVideos, setFilteredVideos] = useState(MOCK_VIDEOS);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [filters, setFilters] = useState<FilterState>({
    categories: {},
    duration: [0, 3600],
    keywords: [],
  });

  // 検索クエリが変更されたときの処理
  useEffect(() => {
    if (query) {
      setIsLoading(true);

      // APIからデータを取得する代わりに、モックデータを使用
      setTimeout(() => {
        // クエリに基づいてフィルタリング（単純な部分一致）
        const filtered = MOCK_VIDEOS.filter(
          (video) =>
            video.title.toLowerCase().includes(query.toLowerCase()) ||
            video.channelName.toLowerCase().includes(query.toLowerCase())
        );

        setVideos(filtered);
        setFilteredVideos(filtered);
        setIsLoading(false);
      }, 500);
    }
  }, [query]);

  // フィルターが変更されたときの処理
  const handleFilterChange = (newFilters: FilterState) => {
    setIsLoading(true);
    setFilters(newFilters);

    // APIからデータを取得する代わりに、モックデータを使用
    setTimeout(() => {
      // 簡易的なフィルタリング
      let filtered = [...videos];

      // カテゴリーでフィルタリング
      if (Object.keys(newFilters.categories).length > 0) {
        // チャンネルでフィルタリング
        if (newFilters.categories.channel?.length) {
          const channelIds = newFilters.categories.channel;
          filtered = filtered.filter((video) => {
            const channelNumber = Number.parseInt(
              video.channelName.split(' ')[1]
            );
            return channelIds.some((id) => id === `channel${channelNumber}`);
          });
        }
      }

      // キーワードでフィルタリング
      if (newFilters.keywords.length > 0) {
        filtered = filtered.filter((video) =>
          newFilters.keywords.some((keyword) =>
            video.title.toLowerCase().includes(keyword.toLowerCase())
          )
        );
      }

      setFilteredVideos(filtered);
      setIsLoading(false);
    }, 300);
  };

  // 検索処理
  const handleSearch = (newQuery: string) => {
    if (!newQuery.trim()) return;

    router.push(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  // ページ変更処理
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // 動画カードクリック時の処理
  const handleVideoClick = (videoId: string) => {
    router.push(`/video/${videoId}`);
  };

  // 動画にクリックハンドラを追加
  const videosWithClickHandler = filteredVideos.map((video) => ({
    ...video,
    onClick: () => handleVideoClick(video.id),
  }));

  return (
    <SearchLayout
      searchQuery={query}
      videos={videosWithClickHandler}
      isLoading={isLoading}
      filterCategories={MOCK_FILTER_CATEGORIES}
      keywords={MOCK_KEYWORDS}
      initialFilters={filters}
      totalResults={filteredVideos.length}
      currentPage={currentPage}
      totalPages={totalPages}
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      onPageChange={handlePageChange}
    />
  );
}
