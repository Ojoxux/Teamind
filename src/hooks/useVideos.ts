import { useQuery } from '@tanstack/react-query';
import { fetchVideos } from '@/lib/api/videos';
import type { Video } from '@/types/video';

export function useVideos() {
  return useQuery<Video[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      const data = await fetchVideos();
      return data.videos;
    },
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 1000 * 60 * 30,
  });
}
