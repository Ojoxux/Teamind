'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Flex, useToast, VStack, Text } from '@chakra-ui/react';
import { MainLayout } from '@/components/templates/MainLayout';
import { VideoGrid } from '@/components/organisms/VideoGrid';
import { Heading } from '@/components/atoms/Heading';
import { Button } from '@/components/atoms/Button';
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';

export default function Home() {
  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} textAlign="center">
        <Heading as="h1" size="2xl">
          Teamind
        </Heading>
        <Text fontSize="xl">
          Teams会議の録画内容をAIで解析し、効率的な学習・復習を支援するアプリケーション
        </Text>
        <Box>
          <Link href="/dashboard">
            <Button colorScheme="brand" size="lg">
              始める
            </Button>
          </Link>
        </Box>
      </VStack>
    </Container>
  );
}
