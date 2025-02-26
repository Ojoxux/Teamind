'use client';

import { useState, type ReactNode } from 'react';
import { Box, Flex, useBreakpointValue } from '@chakra-ui/react';
import { Sidebar } from '@/components/organisms/Sidebar';
import { Header } from '@/components/organisms/Header';

export interface MainLayoutProps {
  children: ReactNode;
  showSearchBar?: boolean;
  onSearch?: (query: string) => void;
}

export const MainLayout = ({
  children,
  showSearchBar = true,
  onSearch,
}: MainLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  // モバイル表示ではサイドバーを自動的に折りたたむ
  const isCollapsed = isMobile || isSidebarCollapsed;

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Flex h="100vh" overflow="hidden">
      {/* サイドバー */}
      <Sidebar isCollapsed={isCollapsed} />

      {/* メインコンテンツエリア */}
      <Box
        flex="1"
        ml={isCollapsed ? '72px' : '240px'}
        transition="margin-left 0.2s"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        {/* ヘッダー */}
        <Header
          onMenuClick={toggleSidebar}
          showSearchBar={showSearchBar}
          onSearch={onSearch}
        />

        {/* コンテンツ */}
        <Box flex="1" p={4} overflowY="auto">
          {children}
        </Box>
      </Box>
    </Flex>
  );
};
