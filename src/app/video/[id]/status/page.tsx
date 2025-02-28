'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Heading,
  Text,
  Progress,
  VStack,
  Button,
  Alert,
  AlertIcon,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { MainLayout } from '@/components/templates/MainLayout';
import { fetchVideoStatus } from '@/lib/api/videos';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function VideoStatusPage() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;

  const [status, setStatus] = useState<string>('uploading');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getStatusMessage = () => {
    switch (status) {
      case 'uploading':
        return 'ファイルをアップロード中...';
      case 'processing':
        return '動画を処理中...';
      case 'completed':
        return '処理が完了しました！';
      case 'failed':
        return '処理に失敗しました';
      default:
        return 'ステータスを確認中...';
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const statusData = await fetchVideoStatus(videoId);
        setStatus(statusData.status);
        setProgress(statusData.progress);

        if (statusData.error) {
          setError(statusData.error);
        }

        // 処理が完了したら動画ページに遷移
        if (statusData.status === 'completed') {
          router.push(`/videos/${videoId}`);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '状態の取得に失敗しました'
        );
      } finally {
        setLoading(false);
      }
    };

    console.log(`Initializing status check for video ID: ${videoId}`);
    checkStatus();

    // 進捗が0の場合は頻繁にチェック、それ以外は通常間隔
    const checkInterval = 2000; // 2秒ごとに更新（より頻繁に）
    const interval = setInterval(() => {
      console.log(`Periodic status check for video ID: ${videoId}`);
      checkStatus();
    }, checkInterval);

    return () => {
      console.log('Clearing status check interval');
      clearInterval(interval);
    };
  }, [videoId, router]);

  // 認証チェック中はローディング表示
  if (authLoading) {
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

  // 動画ステータスのロード中
  if (loading) {
    return (
      <MainLayout>
        <Center h="50vh">
          <Spinner size="xl" />
        </Center>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box maxW="800px" mx="auto" py={8} px={4}>
        <VStack spacing={6} align="stretch">
          <Heading size="lg">動画処理状況</Heading>

          <Text fontSize="lg">{getStatusMessage()}</Text>

          {error ? (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          ) : (
            <>
              <Progress
                value={progress}
                size="lg"
                colorScheme={status === 'completed' ? 'green' : 'blue'}
                hasStripe={status !== 'completed'}
                isAnimated={status !== 'completed'}
              />

              <Text>
                進捗: {progress === 0 ? '処理の準備中...' : `${progress}%`}
              </Text>

              {progress === 0 && status !== 'completed' && (
                <Alert status="info" mt={4}>
                  <AlertIcon />
                  処理の開始を待っています。これには数分かかる場合があります。ブラウザを閉じても処理は継続されます。
                </Alert>
              )}

              {status === 'completed' && (
                <Button
                  colorScheme="blue"
                  onClick={() => router.push(`/video/${videoId}`)}
                >
                  動画ページへ移動
                </Button>
              )}

              {status === 'failed' && (
                <Button
                  colorScheme="red"
                  onClick={() => router.push('/upload')}
                >
                  再アップロード
                </Button>
              )}
            </>
          )}
        </VStack>
      </Box>
    </MainLayout>
  );
}
