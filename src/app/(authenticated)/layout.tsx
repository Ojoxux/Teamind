'use client';

import { useRequireAuth } from '@/hooks/useRequireAuth';
import { MainLayout } from '@/components/templates/MainLayout';
import { Center, Spinner } from '@chakra-ui/react';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useRequireAuth();

  // 認証チェック中もMainLayoutを表示し、コンテンツ部分のみをローディング表示
  if (isLoading) {
    return (
      <MainLayout>
        <Center h="calc(100vh - 80px)">
          <Spinner size="xl" />
        </Center>
      </MainLayout>
    );
  }

  // 認証されていない場合は何も表示しない（リダイレクト処理中）
  if (!user) {
    return null;
  }

  return <MainLayout>{children}</MainLayout>;
}
