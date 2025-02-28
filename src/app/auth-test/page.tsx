'use client';

import { Box, Button, Text, VStack, Code, useToast } from '@chakra-ui/react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { MainLayout } from '@/components/templates/MainLayout';

export default function AuthTest() {
  const { user, session, isLoading, signOut } = useSupabaseAuth();
  const toast = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'ログアウト成功',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'ログアウトエラー',
        description:
          error instanceof Error ? error.message : '不明なエラーが発生しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <MainLayout>
      <Box p={8} maxW="800px" mx="auto">
        <VStack spacing={6} align="start">
          <Text fontSize="2xl">認証テスト</Text>

          {isLoading ? (
            <Text>ロード中...</Text>
          ) : user ? (
            <>
              <Text color="green.500">認証済み ✓</Text>
              <Text>ユーザー: {user.email}</Text>
              <Text>認証方法: {user.app_metadata.provider || 'email'}</Text>
              <Code p={4} borderRadius="md" width="100%" overflowX="auto">
                {JSON.stringify(session, null, 2)}
              </Code>
              <Button colorScheme="red" onClick={handleSignOut}>
                ログアウト
              </Button>
            </>
          ) : (
            <>
              <Text color="red.500">未認証</Text>
              <Button
                colorScheme="blue"
                onClick={() => (window.location.href = '/login')}
              >
                ログインページへ
              </Button>
            </>
          )}
        </VStack>
      </Box>
    </MainLayout>
  );
}
