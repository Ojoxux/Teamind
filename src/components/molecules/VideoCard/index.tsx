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

const PLACEHOLDER_IMAGE = '/images/video-thumbnail-placeholder.jpg';

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
  const [imgSrc, setImgSrc] = useState(thumbnailUrl || PLACEHOLDER_IMAGE);

  // 動画の長さをフォーマット（秒 → MM:SS）
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!thumbnailUrl) {
      console.log('サムネイルURLがありません');
      setImgSrc(PLACEHOLDER_IMAGE);
      setLoading(false);
      return;
    }

    console.log('サムネイルURL:', thumbnailUrl);

    const isImageUrl = /\.(jpe?g|png|webp|gif|bmp)(\?.*)?$/i.test(thumbnailUrl);
    console.log('画像URLか:', isImageUrl);

    if (!isImageUrl) {
      console.log('画像URLではないため、プレースホルダーを使用します');
      setImgSrc(PLACEHOLDER_IMAGE);
    }

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
              src={imgSrc}
              alt={title}
              objectFit="cover"
              onLoad={() => {
                console.log('サムネイル画像の読み込みが完了しました:', imgSrc);
                setLoading(false);
              }}
              onError={(e) => {
                console.error(
                  'サムネイル画像の読み込みに失敗しました:',
                  imgSrc
                );
                if (imgSrc !== PLACEHOLDER_IMAGE) {
                  setImgSrc(PLACEHOLDER_IMAGE);
                }
              }}
              fallback={<Skeleton />}
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
