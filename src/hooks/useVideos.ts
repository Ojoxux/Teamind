import { useQuery } from '@tanstack/react-query';
import { fetchVideos } from '@/lib/api/videos';
import type { Video } from '@/types/video';

export function useVideos() {
  return useQuery<Video[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      try {
        const data = await fetchVideos();
        return data.videos || [];
      } catch (error) {
        console.error('動画データの取得に失敗しました:', error);
        // エラーが発生した場合でも空の配列を返す
        return [];
      }
    },
    refetchOnWindowFocus: true, // ウィンドウにフォーカスが戻ったときにデータを再フェッチ
    retry: 2,
    staleTime: 1000 * 10, // 10秒間はキャッシュを使用
    refetchInterval: 1000 * 30, // 30秒ごとに自動的に再フェッチ
  });
}

// 動画アップロード後に手動で再フェッチするための関数を追加
export function useRefreshVideos() {
  const { refetch } = useVideos();
  return refetch;
}
