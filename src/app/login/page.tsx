'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  useToast,
  Divider,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Link,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Container,
  Flex,
  Image,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } =
    useSupabaseAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  // エラーメッセージの取得
  const errorMessage = searchParams.get('error');
  const verified = searchParams.get('verified') === 'true';
  const tabIndex = searchParams.get('tab') === 'register' ? 1 : 0;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle(
        `${window.location.origin}/videos`
      );
      if (error) throw error;
    } catch (error) {
      toast({
        title: 'ログインエラー',
        description:
          error instanceof Error ? error.message : '不明なエラーが発生しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      toast({
        title: '入力エラー',
        description: 'メールアドレスとパスワードを入力してください',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await signInWithEmail(email, password);
      if (error) throw error;

      // ログイン成功メッセージ
      toast({
        title: 'ログイン成功',
        description: 'ログインに成功しました',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // 少し遅延を入れてからリダイレクト
      setTimeout(() => {
        router.push('/videos');
      }, 500);
    } catch (error) {
      toast({
        title: 'ログインエラー',
        description:
          error instanceof Error ? error.message : '不明なエラーが発生しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    if (!email || !password) {
      toast({
        title: '入力エラー',
        description: 'メールアドレスとパスワードを入力してください',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: '入力エラー',
        description: 'パスワードは6文字以上で入力してください',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUpWithEmail(email, password);
      if (error) throw error;

      toast({
        title: '登録完了',
        description:
          '確認メールを送信しました。メールを確認してアカウントを有効化してください。',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: '登録エラー',
        description:
          error instanceof Error ? error.message : '不明なエラーが発生しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Container
        maxW="md"
        py={12}
        px={6}
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
      >
        <VStack spacing={6} align="center" mb={6}>
          <NextLink href="/" passHref>
            <Image
              src="/logo.svg"
              alt="Teamind"
              h="40px"
              fallback={<Heading size="lg">Teamind</Heading>}
            />
          </NextLink>
        </VStack>

        <VStack spacing={8} align="stretch">
          <Tabs isFitted variant="enclosed" defaultIndex={tabIndex}>
            <TabList mb="1em">
              <Tab>ログイン</Tab>
              <Tab>新規登録</Tab>
            </TabList>

            <TabPanels>
              {/* ログインタブ */}
              <TabPanel>
                <VStack spacing={4}>
                  <Heading size="lg" textAlign="center">
                    ログイン
                  </Heading>

                  {verified && (
                    <Alert status="success">
                      <AlertIcon />
                      メールアドレスの確認が完了しました。ログインしてください。
                    </Alert>
                  )}

                  {errorMessage === 'session_expired' && (
                    <Alert status="warning">
                      <AlertIcon />
                      セッションの有効期限が切れました。再度ログインしてください。
                    </Alert>
                  )}

                  <FormControl>
                    <FormLabel>メールアドレス</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>パスワード</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={
                            showPassword
                              ? 'パスワードを隠す'
                              : 'パスワードを表示'
                          }
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                          size="sm"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Button
                    colorScheme="blue"
                    width="full"
                    onClick={handleEmailLogin}
                    isLoading={isLoading}
                  >
                    ログイン
                  </Button>

                  <Link
                    as={NextLink}
                    href="/forgot-password"
                    color="blue.500"
                    alignSelf="flex-end"
                  >
                    パスワードをお忘れですか？
                  </Link>

                  <Divider />

                  <Text textAlign="center">または</Text>

                  <Button
                    variant="outline"
                    width="full"
                    onClick={handleGoogleLogin}
                    isLoading={isLoading}
                  >
                    Googleでログイン
                  </Button>
                </VStack>
              </TabPanel>

              {/* 新規登録タブ */}
              <TabPanel>
                <VStack spacing={4}>
                  <Heading size="lg" textAlign="center">
                    新規登録
                  </Heading>

                  <FormControl>
                    <FormLabel>メールアドレス</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>パスワード</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={
                            showPassword
                              ? 'パスワードを隠す'
                              : 'パスワードを表示'
                          }
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                          size="sm"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Button
                    colorScheme="blue"
                    width="full"
                    onClick={handleEmailSignUp}
                    isLoading={isLoading}
                  >
                    登録する
                  </Button>

                  <Divider />

                  <Text textAlign="center">または</Text>

                  <Button
                    variant="outline"
                    width="full"
                    onClick={handleGoogleLogin}
                    isLoading={isLoading}
                  >
                    Googleで登録
                  </Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Text fontSize="sm" textAlign="center" color="gray.500">
            ログイン・登録することで、利用規約とプライバシーポリシーに同意したことになります。
          </Text>
        </VStack>
      </Container>
    </Flex>
  );
}
