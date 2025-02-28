'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast, Progress, Box } from '@chakra-ui/react';
import { UploadLayout } from '@/components/templates/UploadLayout';
import { uploadVideo, fetchVideoStatus } from '@/lib/api/videos';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Spinner, Center } from '@chakra-ui/react';

export default function UploadPage() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const toast = useToast();

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

  const pollVideoStatus = async (videoId: string, toastId: number | string) => {
    try {
      console.log(`Polling status for video ID: ${videoId}`);
      const statusData = await fetchVideoStatus(videoId);
      console.log('Status response:', statusData);

      if (statusData.status === 'completed') {
        console.log('Video processing completed');
        toast.update(toastId, {
          title: '処理完了',
          description: '動画の処理が完了しました',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        router.push(`/videos/${videoId}`);
        return;
      }

      if (statusData.status === 'failed') {
        console.error('Video processing failed:', statusData.error);
        toast.update(toastId, {
          title: '処理失敗',
          description: statusData.error || '動画の処理に失敗しました',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // uploaded状態の場合も処理中として扱う
      if (
        statusData.status === 'uploaded' ||
        statusData.status === 'processing'
      ) {
        console.log(
          `Video status: ${statusData.status}, Progress: ${statusData.progress}%`
        );

        // 進捗が0の場合は特別なメッセージを表示
        const progressMessage =
          statusData.progress === 0
            ? '処理の準備中...'
            : `${statusData.progress}%`;

        toast.update(toastId, {
          render: () => (
            <Box bg="white" p={3} rounded="md" shadow="lg">
              <Progress
                value={statusData.progress}
                size="sm"
                colorScheme="blue"
                rounded="md"
                isAnimated
              />
              <Box mt={2} color="gray.600">
                {statusData.status === 'uploaded'
                  ? '処理開始待ち...'
                  : '動画処理中...'}{' '}
                {progressMessage}
              </Box>
            </Box>
          ),
        });

        // 次のポーリングをスケジュール
        console.log('Scheduling next status check in 3 seconds');
        setTimeout(() => pollVideoStatus(videoId, toastId), 3000);
      }
    } catch (error) {
      console.error('Status check error:', error);

      // エラーが発生しても継続してポーリング
      console.log('Continuing polling despite error');
      setTimeout(() => pollVideoStatus(videoId, toastId), 5000); // エラー時は少し長めの間隔
    }
  };

  const handleUpload = async (formData: FormData) => {
    console.log('Starting upload process');
    setIsLoading(true);
    setUploadProgress(0);

    // プログレストーストを表示
    const toastId = toast({
      position: 'bottom',
      duration: null,
      render: () => (
        <Box bg="white" p={3} rounded="md" shadow="lg" width="full">
          <Progress
            value={uploadProgress}
            size="sm"
            colorScheme="blue"
            rounded="md"
          />
          <Box mt={2} color="gray.600">
            アップロード中...{' '}
            {uploadProgress === 0 ? '準備中...' : `${uploadProgress}%`}
          </Box>
        </Box>
      ),
    });

    try {
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const videoFile = formData.get('video') as File;

      console.log(
        `Uploading video: "${title}", Size: ${videoFile.size} bytes, Type: ${videoFile.type}`
      );

      // タグの処理（もしフォームにタグ入力があれば）
      const tagsString = formData.get('tags') as string;
      const tags = tagsString
        ? tagsString
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      // プログレスコールバック関数
      const progressCallback = (progress: number) => {
        console.log(`Upload progress update: ${progress}%`);
        setUploadProgress(progress);

        // トーストも更新
        toast.update(toastId, {
          render: () => (
            <Box bg="white" p={3} rounded="md" shadow="lg" width="full">
              <Progress
                value={progress}
                size="sm"
                colorScheme="blue"
                rounded="md"
              />
              <Box mt={2} color="gray.600">
                アップロード中...{' '}
                {progress === 0 ? '準備中...' : `${progress}%`}
              </Box>
            </Box>
          ),
        });
      };

      // APIを使用して動画をアップロード
      console.log('Calling uploadVideo API');
      const video = await uploadVideo(
        {
          title,
          description,
          tags,
          video: videoFile,
        },
        progressCallback
      );

      console.log('Upload completed successfully, video ID:', video.id);

      // プログレストーストを閉じる
      toast.close(toastId);

      // アップロード完了後、処理状態のポーリングを開始
      console.log('Starting video processing status polling');
      const processingToastId = toast({
        position: 'bottom',
        duration: null,
        render: () => (
          <Box bg="white" p={3} rounded="md" shadow="lg">
            <Progress
              value={0}
              size="sm"
              colorScheme="blue"
              rounded="md"
              isAnimated
            />
            <Box mt={2} color="gray.600">
              動画処理中... 準備中...
            </Box>
          </Box>
        ),
      });

      pollVideoStatus(video.id, processingToastId);
    } catch (error) {
      // プログレストーストを閉じる
      toast.close(toastId);

      console.error('アップロードエラー:', error);

      // エラーの詳細情報を取得
      let errorMessage =
        'アップロード中にエラーが発生しました。もう一度お試しください。';
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Error details:', error.stack);
      }

      // エラーメッセージを表示
      toast({
        title: 'アップロードエラー',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      console.log('Upload process completed (success or failure)');
    }
  };

  return (
    <UploadLayout
      onFormSubmit={handleUpload}
      isLoading={isLoading}
      uploadProgress={uploadProgress}
    />
  );
}
