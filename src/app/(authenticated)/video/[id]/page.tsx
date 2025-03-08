'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  Button,
} from '@chakra-ui/react';
import { VideoDetailLayout } from '@/components/templates/VideoDetailLayout';
import { fetchVideo } from '@/lib/api/videos';
import { ApiVideo, VideoDetailData } from '@/types/video';

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<VideoDetailData | null>(null);

  useEffect(() => {
    const loadVideoData = async () => {
      if (!videoId) {
        setError('動画IDが指定されていません');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const video = (await fetchVideo(videoId)) as ApiVideo;

        if (!video) {
          setError('動画データが見つかりませんでした');
          setLoading(false);
          return;
        }

        // キーポイントをSummaryPoint形式に変換
        const keyPointsFormatted = (video.key_points || []).map((point) => ({
          id: point.id,
          text: `${point.title}: ${point.description}`,
        }));

        // 質問をSummaryPoint形式に変換
        const questionsFormatted = (video.questions || []).map((q) => ({
          id: q.id,
          text: q.question,
        }));

        // APIから取得したデータをVideoDetailLayoutに必要な形式に変換
        const detailData: VideoDetailData = {
          videoId: video.id,
          videoUrl: video.file_url || undefined,
          videoTitle: video.title || '無題',
          videoDescription: video.description || '',
          uploadDate: video.created_at
            ? new Date(video.created_at).toLocaleDateString('ja-JP')
            : undefined,
          transcript: video.transcript || [],
          summary: video.summary || '要約はまだ生成されていません。',
          keyPoints: keyPointsFormatted,
          keywords: video.tags || [],
          questions: questionsFormatted,
          duration: video.duration || 0,
        };

        setVideoData(detailData);
        setLoading(false);
      } catch (err) {
        console.error('動画データの取得に失敗しました:', err);
        setError(
          err instanceof Error ? err.message : '動画データの取得に失敗しました'
        );
        setLoading(false);
      }
    };

    loadVideoData();
  }, [videoId]);

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Box maxW="800px" mx="auto" py={8} px={4}>
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
        <Button colorScheme="blue" onClick={() => router.push('/videos')}>
          動画一覧に戻る
        </Button>
      </Box>
    );
  }

  if (!videoData) {
    return (
      <Box maxW="800px" mx="auto" py={8} px={4}>
        <Alert status="error" mb={4}>
          <AlertIcon />
          動画が見つかりませんでした
        </Alert>
        <Button colorScheme="blue" onClick={() => router.push('/videos')}>
          動画一覧に戻る
        </Button>
      </Box>
    );
  }

  return <VideoDetailLayout {...videoData} />;
}
