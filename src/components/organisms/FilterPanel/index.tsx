'use client';

import {
  Box,
  VStack,
  HStack,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Checkbox,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  useColorModeValue,
  type BoxProps,
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { KeywordTag } from '@/components/molecules/KeywordTag';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterCategory {
  id: string;
  name: string;
  options: FilterOption[];
}

export interface FilterState {
  categories: Record<string, string[]>; // カテゴリーID -> 選択されたオプションIDの配列
  duration: [number, number]; // [最小秒数, 最大秒数]
  keywords: string[]; // 選択されたキーワード
}

export interface FilterPanelProps extends BoxProps {
  categories: FilterCategory[];
  keywords?: string[];
  initialFilters?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
  maxDuration?: number;
}

export const FilterPanel = ({
  categories,
  keywords = [],
  initialFilters,
  onFilterChange,
  maxDuration = 3600, // デフォルトは1時間（秒単位）
  ...props
}: FilterPanelProps) => {
  const [filters, setFilters] = useState<FilterState>(() => {
    return (
      initialFilters || {
        categories: {},
        duration: [0, maxDuration],
        keywords: [],
      }
    );
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // フィルターの変更を親コンポーネントに通知
  // 無限ループを防ぐために、初回レンダリング時は通知しない
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    onFilterChange?.(filters);
  }, [filters, onFilterChange]);

  // カテゴリーオプションの選択状態を切り替え
  const toggleCategoryOption = (categoryId: string, optionId: string) => {
    setFilters((prev) => {
      const currentOptions = prev.categories[categoryId] || [];
      const newOptions = currentOptions.includes(optionId)
        ? currentOptions.filter((id) => id !== optionId)
        : [...currentOptions, optionId];

      return {
        ...prev,
        categories: {
          ...prev.categories,
          [categoryId]: newOptions,
        },
      };
    });
  };

  // 時間範囲の変更
  const handleDurationChange = (values: number[]) => {
    setFilters((prev) => ({
      ...prev,
      duration: [0, values[1]],
    }));
  };

  // キーワードの選択状態を切り替え
  const toggleKeyword = (keyword: string) => {
    setFilters((prev) => {
      const isSelected = prev.keywords.includes(keyword);

      return {
        ...prev,
        keywords: isSelected
          ? prev.keywords.filter((k) => k !== keyword)
          : [...prev.keywords, keyword],
      };
    });
  };

  // フィルターをリセット
  const resetFilters = () => {
    setFilters({
      categories: {},
      duration: [0, maxDuration],
      keywords: [],
    });
  };

  // 選択されているフィルターの数を計算
  const getSelectedFiltersCount = () => {
    let count = 0;

    // カテゴリーオプションの数
    for (const options of Object.values(filters.categories)) {
      count += options.length;
    }

    // 時間範囲が変更されている場合
    if (filters.duration[0] > 0 || filters.duration[1] < maxDuration) {
      count += 1;
    }

    // キーワードの数
    count += filters.keywords.length;

    return count;
  };

  // 時間のフォーマット（秒 → MM:SS）
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedFiltersCount = getSelectedFiltersCount();

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      overflow="hidden"
      {...props}
    >
      <Flex
        justify="space-between"
        align="center"
        p={4}
        borderBottomWidth="1px"
        borderBottomColor={borderColor}
      >
        <HStack>
          <Box as={FiFilter} />
          <Heading size="md">フィルター</Heading>
          {selectedFiltersCount > 0 && (
            <Text fontSize="sm" color="blue.500" fontWeight="medium">
              ({selectedFiltersCount})
            </Text>
          )}
        </HStack>

        {selectedFiltersCount > 0 && (
          <Button
            size="sm"
            variant="ghost"
            colorScheme="blue"
            leftIcon={<FiX />}
            onClick={resetFilters}
          >
            リセット
          </Button>
        )}
      </Flex>

      <Box p={4}>
        <VStack spacing={6} align="stretch">
          {/* カテゴリーフィルター */}
          <Accordion allowMultiple defaultIndex={[0]}>
            {categories.map((category) => (
              <AccordionItem key={category.id} border="none">
                <h2>
                  <AccordionButton px={1} _hover={{ bg: 'transparent' }}>
                    <Box flex="1" textAlign="left" fontWeight="medium">
                      {category.name}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} px={1}>
                  <VStack align="start" spacing={2}>
                    {category.options.map((option) => (
                      <Checkbox
                        key={option.id}
                        isChecked={(
                          filters.categories[category.id] || []
                        ).includes(option.id)}
                        onChange={() =>
                          toggleCategoryOption(category.id, option.id)
                        }
                      >
                        <Flex
                          align="center"
                          justify="space-between"
                          width="100%"
                        >
                          <Text fontSize="sm">{option.label}</Text>
                          {option.count !== undefined && (
                            <Text fontSize="xs" color="gray.500" ml={2}>
                              ({option.count})
                            </Text>
                          )}
                        </Flex>
                      </Checkbox>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}

            {/* 時間範囲フィルター */}
            <AccordionItem border="none">
              <h2>
                <AccordionButton px={1} _hover={{ bg: 'transparent' }}>
                  <Box flex="1" textAlign="left" fontWeight="medium">
                    動画の長さ
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} px={1}>
                <Box px={2} pt={4} pb={2}>
                  <RangeSlider
                    aria-label={['最小時間', '最大時間']}
                    value={[0, filters.duration[1]]}
                    min={0}
                    max={maxDuration}
                    onChange={handleDurationChange}
                  >
                    <RangeSliderTrack>
                      <RangeSliderFilledTrack />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} />
                    <RangeSliderThumb index={1} />
                  </RangeSlider>
                </Box>

                <Flex justify="space-between" px={2}>
                  <Text fontSize="sm">{formatTime(0)}</Text>
                  <Text fontSize="sm">{formatTime(filters.duration[1])}</Text>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          {/* キーワードフィルター */}
          {keywords.length > 0 && (
            <Box>
              <Text fontWeight="medium" mb={3}>
                キーワード
              </Text>
              <Flex flexWrap="wrap" gap={2}>
                {keywords.map((keyword) => (
                  <KeywordTag
                    key={keyword}
                    keyword={keyword}
                    onClick={() => toggleKeyword(keyword)}
                    colorScheme={
                      filters.keywords.includes(keyword) ? 'blue' : 'gray'
                    }
                    variant={
                      filters.keywords.includes(keyword) ? 'solid' : 'outline'
                    }
                  />
                ))}
              </Flex>
            </Box>
          )}
        </VStack>
      </Box>
    </Box>
  );
};
