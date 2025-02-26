'use client';

import { Flex, Box, type FlexProps } from '@chakra-ui/react';
import { Text } from '@/components/atoms/Text';
import { Heading } from '@/components/atoms/Heading';

export interface ChapterItemProps extends FlexProps {
  title: string;
  timestamp: number;
  isActive?: boolean;
  onClick?: () => void;
}

export const ChapterItem = ({
  title,
  timestamp,
  isActive = false,
  onClick,
  ...props
}: ChapterItemProps) => {
  // 秒数を時:分:秒の形式に変換
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    }

    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Flex
      p={3}
      borderRadius="md"
      bg={isActive ? 'blue.50' : 'transparent'}
      borderLeftWidth={isActive ? '4px' : '0'}
      borderLeftColor="blue.500"
      cursor="pointer"
      _hover={{ bg: isActive ? 'blue.50' : 'gray.50' }}
      onClick={onClick}
      align="center"
      {...props}
    >
      <Box minW="60px">
        <Text fontWeight="medium" color={isActive ? 'blue.600' : 'gray.600'}>
          {formatTime(timestamp)}
        </Text>
      </Box>

      <Heading
        size="xs"
        ml={4}
        flex={1}
        color={isActive ? 'blue.700' : 'gray.800'}
        noOfLines={1}
      >
        {title}
      </Heading>
    </Flex>
  );
};
