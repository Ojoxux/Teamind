'use client';

import { SimpleGrid, Box, Flex, type BoxProps } from '@chakra-ui/react';
import {
  VideoCard,
  type VideoCardProps,
} from '@/components/molecules/VideoCard';
import { Pagination } from '@/components/molecules/Pagination';
import { Text } from '@/components/atoms/Text';
import { Spinner } from '@/components/atoms/Spinner';

export interface VideoGridProps extends BoxProps {
  videos: Omit<VideoCardProps, 'onClick'>[];
  isLoading?: boolean;
  emptyMessage?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const VideoGrid = ({
  videos,
  isLoading = false,
  emptyMessage = '動画がありません',
  currentPage,
  totalPages,
  onPageChange,
  ...props
}: VideoGridProps) => {
  // ローディング中
  if (isLoading) {
    return (
      <Box textAlign="center" py={10} {...props}>
        <Spinner size="xl" />
        <Text mt={4} color="gray.500">
          読み込み中...
        </Text>
      </Box>
    );
  }

  // 動画がない場合
  if (videos.length === 0) {
    return (
      <Box textAlign="center" py={10} {...props}>
        <Text color="gray.500">{emptyMessage}</Text>
      </Box>
    );
  }

  return (
    <Box {...props}>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6} mb={6}>
        {videos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </SimpleGrid>

      {currentPage && totalPages && totalPages > 1 && onPageChange && (
        <Flex justify="center" mt={8}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </Flex>
      )}
    </Box>
  );
};
