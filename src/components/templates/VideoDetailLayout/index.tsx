'use client';

import { useState } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useBreakpointValue,
} from '@chakra-ui/react';
import { MainLayout } from '@/components/templates/MainLayout';
import { VideoPlayer } from '@/components/organisms/VideoPlayer';
import {
  TranscriptPanel,
  type TranscriptItem,
} from '@/components/organisms/TranscriptPanel';
import {
  SummaryPanel,
  type SummaryPoint,
} from '@/components/organisms/SummaryPanel';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import {
  VideoCard,
  type VideoCardProps,
} from '@/components/molecules/VideoCard';

export interface VideoDetailLayoutProps {
  videoId: string;
  videoUrl: string;
  videoTitle: string;
  videoDescription?: string;
  uploadDate?: string;
  viewCount?: number;
  transcript: TranscriptItem[];
  chapters?: { id: string; title: string; startTime: number }[];
  summary: string;
  keyPoints?: SummaryPoint[];
  keywords?: string[];
  questions?: SummaryPoint[];
  relatedVideos?: Omit<VideoCardProps, 'onClick'>[];
}

export const VideoDetailLayout = ({
  videoId,
  videoUrl,
  videoTitle,
  videoDescription = '',
  uploadDate,
  viewCount,
  transcript,
  chapters = [],
  summary,
  keyPoints = [],
  keywords = [],
  questions = [],
  relatedVideos = [],
}: VideoDetailLayoutProps) => {
  const [currentTime, setCurrentTime] = useState(0);
  const isMobile = useBreakpointValue({ base: true, lg: false });

  // 動画の時間が更新されたときの処理
  const handleVideoTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  // 文字起こしの時間がクリックされたときの処理
  const handleTimeClick = (time: number) => {
    // ビデオプレーヤーのrefを使って時間を設定する実装が必要
    // 現在はステートを更新するだけ
    setCurrentTime(time);

    // ここで実際のビデオプレーヤーの時間を設定する処理が必要
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.currentTime = time;
    }
  };

  return (
    <MainLayout showSearchBar={false}>
      <Box mb={8}>
        {/* ビデオプレーヤー */}
        <Box mb={4}>
          <VideoPlayer
            src={videoUrl}
            title={videoTitle}
            onVideoTimeUpdate={handleVideoTimeUpdate}
            w="100%"
            borderRadius="md"
            overflow="hidden"
          />
        </Box>

        {/* ビデオ情報 */}
        <Box mb={6}>
          <Heading size="lg" mb={2}>
            {videoTitle}
          </Heading>
          {(uploadDate || viewCount !== undefined) && (
            <Text color="gray.500" mb={2}>
              {uploadDate && `アップロード日: ${uploadDate}`}
              {uploadDate && viewCount !== undefined && ' • '}
              {viewCount !== undefined &&
                `視聴回数: ${viewCount.toLocaleString()}回`}
            </Text>
          )}
          {videoDescription && <Text>{videoDescription}</Text>}
        </Box>

        {isMobile ? (
          // モバイル表示の場合はタブで切り替え
          <Tabs isFitted variant="enclosed">
            <TabList mb={4}>
              <Tab>文字起こし</Tab>
              <Tab>要約</Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0}>
                <TranscriptPanel
                  transcript={transcript}
                  chapters={chapters}
                  currentTime={currentTime}
                  onTimeClick={handleTimeClick}
                />
              </TabPanel>
              <TabPanel p={0}>
                <SummaryPanel
                  summary={summary}
                  keyPoints={keyPoints}
                  keywords={keywords}
                  questions={questions}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        ) : (
          // デスクトップ表示の場合はグリッドレイアウト
          <Grid templateColumns="1fr 1fr" gap={4}>
            <GridItem>
              <TranscriptPanel
                transcript={transcript}
                chapters={chapters}
                currentTime={currentTime}
                onTimeClick={handleTimeClick}
                h="600px"
              />
            </GridItem>
            <GridItem>
              <SummaryPanel
                summary={summary}
                keyPoints={keyPoints}
                keywords={keywords}
                questions={questions}
                h="600px"
              />
            </GridItem>
          </Grid>
        )}

        {/* 関連動画 */}
        {relatedVideos.length > 0 && (
          <Box mt={8}>
            <Heading size="md" mb={4}>
              関連動画
            </Heading>
            <Grid
              templateColumns={{
                base: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
              gap={4}
            >
              {relatedVideos.map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
};
