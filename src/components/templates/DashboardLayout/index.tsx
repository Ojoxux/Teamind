'use client';

import {
  Box,
  Grid,
  GridItem,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
} from '@chakra-ui/react';
import { VideoGrid } from '@/components/organisms/VideoGrid';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import {
  VideoCard,
  type VideoCardProps,
} from '@/components/molecules/VideoCard';

export interface StatCardProps {
  label: string;
  value: number | string;
  helpText?: string;
  change?: number;
  isIncreased?: boolean;
}

export interface DashboardLayoutProps {
  stats: StatCardProps[];
  recentVideos: Omit<VideoCardProps, 'onClick'>[];
  popularVideos: Omit<VideoCardProps, 'onClick'>[];
  isLoading?: boolean;
}

export const DashboardLayout = ({
  stats = [],
  recentVideos = [],
  popularVideos = [],
  isLoading = false,
}: DashboardLayoutProps) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box mb={8}>
      <Heading size="lg" mb={6}>
        ダッシュボード
      </Heading>

      {/* 統計カード */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} mb={8}>
        {stats.map((stat) => (
          <Card
            key={stat.label}
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
          >
            <CardBody>
              <Stat>
                <StatLabel>{stat.label}</StatLabel>
                <StatNumber>{stat.value}</StatNumber>
                {(stat.helpText || stat.change !== undefined) && (
                  <StatHelpText>
                    {stat.change !== undefined && (
                      <StatArrow
                        type={stat.isIncreased ? 'increase' : 'decrease'}
                      />
                    )}
                    {stat.helpText || `${stat.change}%`}
                  </StatHelpText>
                )}
              </Stat>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* 最近の動画と人気の動画 */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={8}>
        <GridItem>
          <Card
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            h="100%"
          >
            <CardHeader>
              <Heading size="md">最近の動画</Heading>
            </CardHeader>
            <CardBody>
              <VideoGrid videos={recentVideos} isLoading={isLoading} />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            h="100%"
          >
            <CardHeader>
              <Heading size="md">人気の動画</Heading>
            </CardHeader>
            <CardBody>
              <VideoGrid videos={popularVideos} isLoading={isLoading} />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
};
