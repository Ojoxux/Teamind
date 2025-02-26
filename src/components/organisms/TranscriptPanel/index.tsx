'use client';

import {
  Box,
  VStack,
  HStack,
  Flex,
  Divider,
  useColorModeValue,
  type BoxProps,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FiSearch, FiDownload, FiCopy } from 'react-icons/fi';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { SearchBar } from '@/components/molecules/SearchBar';
import { ChapterItem } from '@/components/molecules/ChapterItem';

export interface TranscriptItem {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  speakerName?: string;
}

export interface Chapter {
  id: string;
  title: string;
  startTime: number;
}

export interface TranscriptPanelProps extends BoxProps {
  transcript: TranscriptItem[];
  chapters?: Chapter[];
  currentTime?: number;
  onTimeClick?: (time: number) => void;
}

export const TranscriptPanel = ({
  transcript,
  chapters = [],
  currentTime = 0,
  onTimeClick,
  ...props
}: TranscriptPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTranscript, setFilteredTranscript] =
    useState<TranscriptItem[]>(transcript);
  const [activeChapter, setActiveChapter] = useState<string | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const highlightBg = useColorModeValue('blue.50', 'blue.900');

  // 検索クエリに基づいて文字起こしをフィルタリング
  useEffect(() => {
    if (!searchQuery) {
      setFilteredTranscript(transcript);
      return;
    }

    const filtered = transcript.filter((item) =>
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredTranscript(filtered);
  }, [searchQuery, transcript]);

  // 現在の再生時間に基づいてアクティブなチャプターを設定
  useEffect(() => {
    if (chapters.length === 0 || currentTime === undefined) return;

    // 現在の時間より前で最も近いチャプターを見つける
    let activeChapterId = null;
    let closestTime = Number.NEGATIVE_INFINITY;

    for (const chapter of chapters) {
      if (chapter.startTime <= currentTime && chapter.startTime > closestTime) {
        closestTime = chapter.startTime;
        activeChapterId = chapter.id;
      }
    }

    setActiveChapter(activeChapterId);
  }, [currentTime, chapters]);

  // 文字起こしをコピー
  const copyTranscript = () => {
    const text = transcript.map((item) => item.text).join('\n');
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert('文字起こしをクリップボードにコピーしました');
      })
      .catch((err) => {
        console.error('コピーに失敗しました:', err);
      });
  };

  // 文字起こしをダウンロード
  const downloadTranscript = () => {
    const text = transcript
      .map((item) => {
        const time = formatTime(item.startTime);
        return `[${time}] ${item.speakerName ? `${item.speakerName}: ` : ''}${
          item.text
        }`;
      })
      .join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 時間のフォーマット（秒 → MM:SS）
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // 現在アクティブな文字起こしアイテムを判定
  const isActiveTranscriptItem = (item: TranscriptItem) => {
    return currentTime >= item.startTime && currentTime < item.endTime;
  };

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      overflow="hidden"
      h="100%"
      display="flex"
      flexDirection="column"
      {...props}
    >
      <Box p={4} borderBottomWidth="1px" borderBottomColor={borderColor}>
        <Heading size="md" mb={4}>
          文字起こし
        </Heading>

        <SearchBar
          placeholder="文字起こしを検索..."
          onChange={setSearchQuery}
          mb={3}
        />

        <HStack spacing={2}>
          <Button
            size="sm"
            leftIcon={<FiCopy />}
            onClick={copyTranscript}
            variant="outline"
          >
            コピー
          </Button>
          <Button
            size="sm"
            leftIcon={<FiDownload />}
            onClick={downloadTranscript}
            variant="outline"
          >
            ダウンロード
          </Button>
        </HStack>
      </Box>

      {chapters.length > 0 && (
        <Box p={4} borderBottomWidth="1px" borderBottomColor={borderColor}>
          <Heading size="sm" mb={3}>
            チャプター
          </Heading>
          <VStack align="stretch" spacing={1} maxH="200px" overflowY="auto">
            {chapters.map((chapter) => (
              <ChapterItem
                key={chapter.id}
                title={chapter.title}
                timestamp={chapter.startTime}
                isActive={chapter.id === activeChapter}
                onClick={() => onTimeClick?.(chapter.startTime)}
              />
            ))}
          </VStack>
        </Box>
      )}

      <Box flex="1" overflowY="auto" p={0}>
        <VStack align="stretch" spacing={0} w="100%">
          {filteredTranscript.map((item) => (
            <Box
              key={item.id}
              p={3}
              bg={isActiveTranscriptItem(item) ? highlightBg : 'transparent'}
              borderLeftWidth={isActiveTranscriptItem(item) ? '4px' : '0'}
              borderLeftColor="blue.500"
              cursor="pointer"
              _hover={{
                bg: isActiveTranscriptItem(item) ? highlightBg : 'gray.50',
              }}
              onClick={() => onTimeClick?.(item.startTime)}
            >
              <Flex justify="space-between" mb={1}>
                <Text fontWeight="medium" fontSize="sm" color="gray.500">
                  {formatTime(item.startTime)}
                </Text>
                {item.speakerName && (
                  <Text fontWeight="bold" fontSize="sm">
                    {item.speakerName}
                  </Text>
                )}
              </Flex>
              <Text>{item.text}</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};
