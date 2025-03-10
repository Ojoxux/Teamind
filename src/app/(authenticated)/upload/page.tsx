'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast, Progress, Box } from '@chakra-ui/react';
import { UploadForm } from '@/components/organisms/UploadForm';
import { uploadVideo } from '@/lib/api/videos';
import { generateThumbnail } from '@/lib/api/thumbnails';
import { useRefreshVideos } from '@/hooks/useVideos';

export default function UploadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const toast = useToast();
  const refreshVideos = useRefreshVideos();

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

      // アップロード成功後、サムネイル生成を要求
      if (video.id && video.file_path) {
        console.log('サムネイル生成を開始します:', {
          videoId: video.id,
          filePath: video.file_path,
          userId: video.user_id,
        });

        try {
          // バックエンドAPIを使用してサムネイル生成
          console.log('バックエンドAPIを使用してサムネイル生成を開始します');
          const thumbnailResult = await generateThumbnail(
            video.id,
            video.file_path
          );
          console.log('サムネイル生成成功:', thumbnailResult);

          toast({
            title: '成功',
            description: 'サムネイルを生成しました',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } catch (error) {
          console.error('サムネイル生成エラー:', error);
          toast({
            title: '警告',
            description:
              'サムネイルの生成に失敗しましたが、動画のアップロードは完了しました',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
        }
      }

      // プログレストーストを閉じる
      toast.close(toastId);

      // 動画一覧を更新
      console.log('動画一覧を更新します');
      await refreshVideos();

      // アップロード完了のトーストを表示
      toast({
        title: 'アップロード完了',
        description: '動画のアップロードが完了しました',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // 動画一覧ページにリダイレクト
      router.push('/videos');
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
    <Box maxW="800px" mx="auto" py={8} px={4}>
      <UploadForm
        onFormSubmit={handleUpload}
        isLoading={isLoading}
        uploadProgress={uploadProgress}
      />
    </Box>
  );
}
