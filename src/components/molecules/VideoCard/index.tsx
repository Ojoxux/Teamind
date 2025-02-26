'use client';

import { Box, Image, VStack, HStack, AspectRatio } from '@chakra-ui/react';
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
  // 動画の長さをフォーマット（秒 → MM:SS）
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      as={Link}
      href={`/videos/${id}`}
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
          <Image src={thumbnailUrl} alt={title} objectFit="cover" />
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
