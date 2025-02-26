'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Flex,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { FiFilter } from 'react-icons/fi';
import { MainLayout } from '@/components/templates/MainLayout';
import { VideoGrid } from '@/components/organisms/VideoGrid';
import {
  FilterPanel,
  type FilterState,
  type FilterCategory,
} from '@/components/organisms/FilterPanel';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import {
  VideoCard,
  type VideoCardProps,
} from '@/components/molecules/VideoCard';

export interface SearchLayoutProps {
  searchQuery?: string;
  videos: Omit<VideoCardProps, 'onClick'>[];
  isLoading?: boolean;
  filterCategories: FilterCategory[];
  keywords?: string[];
  initialFilters?: FilterState;
  totalResults?: number;
  currentPage?: number;
  totalPages?: number;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: FilterState) => void;
  onPageChange?: (page: number) => void;
}

export const SearchLayout = ({
  searchQuery = '',
  videos = [],
  isLoading = false,
  filterCategories = [],
  keywords = [],
  initialFilters,
  totalResults,
  currentPage = 1,
  totalPages = 1,
  onSearch,
  onFilterChange,
  onPageChange,
}: SearchLayoutProps) => {
  // initialFiltersが変更されたときだけ内部状態を更新するために、useRefを使用
  const prevInitialFiltersRef = useRef(initialFilters);
  const [filters, setFilters] = useState<FilterState | undefined>(
    initialFilters
  );

  // initialFiltersが変更されたときだけ内部状態を更新
  useEffect(() => {
    if (
      JSON.stringify(prevInitialFiltersRef.current) !==
      JSON.stringify(initialFilters)
    ) {
      setFilters(initialFilters);
      prevInitialFiltersRef.current = initialFilters;
    }
  }, [initialFilters]);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  // フィルターの変更を親コンポーネントに通知
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // 親コンポーネントに通知するが、内部状態の更新は行わない
    if (onFilterChange) {
      // setTimeout を使って非同期にすることで、レンダリングサイクルを分離
      setTimeout(() => {
        onFilterChange(newFilters);
      }, 0);
    }
  };

  // 検索クエリの変更を親コンポーネントに通知
  const handleSearch = (query: string) => {
    onSearch?.(query);
  };

  return (
    <MainLayout onSearch={handleSearch}>
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Box>
            {searchQuery && (
              <Heading size="lg" mb={2}>
                「{searchQuery}」の検索結果
              </Heading>
            )}
            {totalResults !== undefined && (
              <Text color="gray.500">
                {totalResults}件の動画が見つかりました
              </Text>
            )}
          </Box>

          {isMobile && (
            <Button leftIcon={<FiFilter />} onClick={onOpen} variant="outline">
              フィルター
            </Button>
          )}
        </Flex>

        <Grid templateColumns={{ base: '1fr', md: '250px 1fr' }} gap={6}>
          {/* フィルターパネル（モバイルではドロワー、デスクトップではサイドバー） */}
          {isMobile ? (
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>フィルター</DrawerHeader>
                <DrawerBody>
                  <FilterPanel
                    categories={filterCategories}
                    keywords={keywords}
                    initialFilters={filters}
                    onFilterChange={handleFilterChange}
                  />
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          ) : (
            <GridItem>
              <FilterPanel
                categories={filterCategories}
                keywords={keywords}
                initialFilters={filters}
                onFilterChange={handleFilterChange}
                position="sticky"
                top="20px"
              />
            </GridItem>
          )}

          {/* 検索結果 */}
          <GridItem>
            <VideoGrid
              videos={videos}
              isLoading={isLoading}
              emptyMessage={
                searchQuery
                  ? `「${searchQuery}」に一致する動画は見つかりませんでした`
                  : '動画が見つかりませんでした'
              }
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </GridItem>
        </Grid>
      </Box>
    </MainLayout>
  );
};
