'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@chakra-ui/react';
import { UploadLayout } from '@/components/templates/UploadLayout';

export default function UploadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  // アップロード処理
  const handleUpload = async (formData: FormData) => {
    setIsLoading(true);

    try {
      // 実際のAPIリクエストの代わりに、タイムアウトを使用
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 成功メッセージを表示
      toast({
        title: 'アップロード成功',
        description:
          '動画が正常にアップロードされました。処理が完了するまでしばらくお待ちください。',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // ホームページにリダイレクト
      router.push('/');
    } catch (error) {
      // エラーメッセージを表示
      toast({
        title: 'アップロードエラー',
        description:
          'アップロード中にエラーが発生しました。もう一度お試しください。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return <UploadLayout onFormSubmit={handleUpload} isLoading={isLoading} />;
}
