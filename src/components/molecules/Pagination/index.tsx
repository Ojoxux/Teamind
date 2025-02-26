'use client';

import { HStack, Button, IconButton, type StackProps } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export interface PaginationProps extends StackProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  ...props
}: PaginationProps) => {
  // ページ番号の配列を生成
  const generatePages = () => {
    const pages: (number | string)[] = [];

    // 先頭のページ
    pages.push(1);

    // 現在のページの前後のページ
    const startPage = Math.max(2, currentPage - siblingCount);
    const endPage = Math.min(totalPages - 1, currentPage + siblingCount);

    // 省略記号を表示するかどうか
    if (startPage > 2) {
      pages.push('...');
    }

    // ページ番号を追加
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // 省略記号を表示するかどうか
    if (endPage < totalPages - 1) {
      pages.push('...');
    }

    // 最後のページ
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <HStack spacing={2} {...props}>
      <IconButton
        aria-label="前のページ"
        icon={<FiChevronLeft />}
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        variant="outline"
      />

      {pages.map((page, index) =>
        typeof page === 'number' ? (
          <Button
            key={`page-${page}`}
            variant={page === currentPage ? 'solid' : 'outline'}
            colorScheme={page === currentPage ? 'blue' : 'gray'}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ) : (
          <Button
            key={`ellipsis-${pages.indexOf(page)}`}
            variant="ghost"
            isDisabled
          >
            {page}
          </Button>
        )
      )}

      <IconButton
        aria-label="次のページ"
        icon={<FiChevronRight />}
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        variant="outline"
      />
    </HStack>
  );
};
