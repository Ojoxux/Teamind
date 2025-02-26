'use client';

import { useState, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Flex,
  Progress,
  useColorModeValue,
  useToast,
  type BoxProps,
} from '@chakra-ui/react';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { FormField } from '@/components/molecules/FormField';
import { Input } from '@/components/atoms/Input';

export interface UploadFormProps extends BoxProps {
  onFormSubmit?: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
}

export const UploadForm = ({
  onFormSubmit,
  isLoading = false,
  ...props
}: UploadFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const dropzoneBg = useColorModeValue('gray.50', 'gray.700');

  // ファイルの選択
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // 動画ファイルかどうかチェック
    if (!selectedFile.type.startsWith('video/')) {
      toast({
        title: 'エラー',
        description: '動画ファイルを選択してください',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setFile(selectedFile);

    // ファイル名をタイトルに設定（タイトルが空の場合）
    if (!title) {
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, ''); // 拡張子を除去
      setTitle(fileName);
    }
  };

  // ファイルのドラッグ&ドロップ
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    // 動画ファイルかどうかチェック
    if (!droppedFile.type.startsWith('video/')) {
      toast({
        title: 'エラー',
        description: '動画ファイルを選択してください',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setFile(droppedFile);

    // ファイル名をタイトルに設定（タイトルが空の場合）
    if (!title) {
      const fileName = droppedFile.name.replace(/\.[^/.]+$/, ''); // 拡張子を除去
      setTitle(fileName);
    }
  };

  // ドラッグオーバー時のデフォルト動作を防止
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // ファイルの削除
  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // フォームの検証
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'タイトルを入力してください';
    }

    if (!file) {
      newErrors.file = '動画ファイルを選択してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォームの送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (file) {
      formData.append('video', file);
    }

    try {
      // アップロードの進捗をシミュレート
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          if (progress >= 100) {
            clearInterval(interval);
          }
          setUploadProgress(progress);
        }, 300);

        return () => clearInterval(interval);
      };

      const clearProgress = simulateProgress();

      // 実際のアップロード処理
      if (onFormSubmit) {
        await onFormSubmit(formData);
      }

      clearProgress();

      toast({
        title: 'アップロード完了',
        description: '動画が正常にアップロードされました',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // フォームをリセット
      setTitle('');
      setDescription('');
      setFile(null);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('アップロードエラー:', error);

      toast({
        title: 'エラー',
        description: 'アップロード中にエラーが発生しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      setUploadProgress(0);
    }
  };

  // ファイルサイズのフォーマット
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      p={6}
      {...props}
    >
      <Heading size="lg" mb={6}>
        動画のアップロード
      </Heading>

      <VStack spacing={6} align="stretch">
        {/* タイトル */}
        <FormField label="タイトル" isRequired error={errors.title}>
          <Input
            placeholder="動画のタイトルを入力"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormField>

        {/* 説明 */}
        <FormField label="説明" helperText="動画の内容について説明してください">
          <Input
            as="textarea"
            placeholder="動画の説明を入力"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minH="100px"
          />
        </FormField>

        {/* ファイルアップロード */}
        <FormField label="動画ファイル" isRequired error={errors.file}>
          {!file ? (
            <Box
              border="2px dashed"
              borderColor={borderColor}
              borderRadius="md"
              p={10}
              bg={dropzoneBg}
              textAlign="center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />

              <VStack spacing={3}>
                <Box as={FiUpload} size="48px" color="blue.500" />
                <Text fontWeight="medium">
                  ここにファイルをドラッグ&ドロップ
                </Text>
                <Text fontSize="sm" color="gray.500">
                  または
                </Text>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  colorScheme="blue"
                >
                  ファイルを選択
                </Button>
                <Text fontSize="xs" color="gray.500">
                  最大ファイルサイズ: 1GB
                </Text>
              </VStack>
            </Box>
          ) : (
            <Box
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="md"
              p={4}
            >
              <Flex justify="space-between" align="center">
                <HStack>
                  <Box as={FiFile} color="blue.500" />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">{file.name}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {formatFileSize(file.size)}
                    </Text>
                  </VStack>
                </HStack>
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={handleRemoveFile}
                  leftIcon={<FiX />}
                >
                  削除
                </Button>
              </Flex>
            </Box>
          )}
        </FormField>

        {/* アップロード進捗 */}
        {uploadProgress > 0 && (
          <Box>
            <Text fontSize="sm" mb={1}>
              アップロード中... {uploadProgress}%
            </Text>
            <Progress value={uploadProgress} size="sm" colorScheme="blue" />
          </Box>
        )}

        {/* 送信ボタン */}
        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          isLoading={isLoading}
          loadingText="アップロード中..."
          isDisabled={!file || isLoading}
        >
          アップロード
        </Button>
      </VStack>
    </Box>
  );
};
