'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Image,
  VStack,
  HStack,
  AspectRatio,
  Skeleton,
} from '@chakra-ui/react';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Badge } from '@/components/atoms/Badge';
import Link from 'next/link';

export interface VideoCardProps {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  uploadDate: string;
  category?: string;
}

export const VideoCard = ({
  id,
  title,
  description,
  thumbnailUrl,
  duration,
  uploadDate,
  category,
}: VideoCardProps) => {
  const [loading, setLoading] = useState(true);

  // 動画の長さをフォーマット（秒 → MM:SS）
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // コンポーネントがマウントされたら、ローディング状態を解除
  useEffect(() => {
    // サムネイルURLがない場合は、ローディング状態を解除
    if (!thumbnailUrl) {
      setLoading(false);
      return;
    }

    // サムネイルが画像URLの場合（.jpg, .png, .webp, .gifなど）
    const isImageUrl = /\.(jpe?g|png|webp|gif|bmp)(\?.*)?$/i.test(thumbnailUrl);

    // 画像URLの場合は、Image コンポーネントの onLoad イベントで処理するため、
    // ここではローディング状態を維持
    if (isImageUrl) {
      return;
    }

    // 画像URLでない場合（動画URLなど）は、ローディング状態を解除
    setLoading(false);
  }, [thumbnailUrl]);

  return (
    <Box
      as={Link}
      href={`/video/${id}`}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'md',
      }}
    >
      <Box position="relative">
        <AspectRatio ratio={16 / 9}>
          {loading ? (
            <Skeleton height="100%" width="100%" />
          ) : (
            <Image
              src={thumbnailUrl}
              alt={title}
              objectFit="cover"
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
              fallback={<Skeleton height="100%" width="100%" />}
            />
          )}
        </AspectRatio>
        <Box
          position="absolute"
          bottom="2"
          right="2"
          bg="blackAlpha.700"
          color="white"
          px="2"
          py="1"
          borderRadius="md"
          fontSize="xs"
        >
          {formatDuration(duration)}
        </Box>
      </Box>

      <VStack align="start" p="4" spacing="2">
        <Heading size="md" noOfLines={1}>
          {title}
        </Heading>
        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {description}
        </Text>

        <HStack justify="space-between" width="100%">
          <Text fontSize="xs" color="gray.500">
            {new Date(uploadDate).toLocaleDateString('ja-JP')}
          </Text>
          {category && (
            <Badge colorScheme="blue" variant="subtle">
              {category}
            </Badge>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};
