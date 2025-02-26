'use client';

import {
  Box,
  VStack,
  Flex,
  Divider,
  Image,
  useColorModeValue,
  type BoxProps,
} from '@chakra-ui/react';
import {
  FiHome,
  FiUpload,
  FiBarChart2,
  FiSettings,
  FiSearch,
} from 'react-icons/fi';
import { NavItem } from '@/components/molecules/NavItem';
import { Text } from '@/components/atoms/Text';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export interface SidebarProps extends BoxProps {
  isCollapsed?: boolean;
}

export const Sidebar = ({ isCollapsed = false, ...props }: SidebarProps) => {
  const pathname = usePathname();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const navItems = [
    { label: 'ホーム', icon: FiHome, href: '/' },
    { label: '検索', icon: FiSearch, href: '/search' },
    { label: 'アップロード', icon: FiUpload, href: '/upload' },
    { label: 'ダッシュボード', icon: FiBarChart2, href: '/dashboard' },
    { label: '設定', icon: FiSettings, href: '/settings' },
  ];

  return (
    <Box
      as="nav"
      position="fixed"
      left={0}
      top={0}
      h="100vh"
      w={isCollapsed ? '72px' : '240px'}
      bg={bgColor}
      borderRightWidth="1px"
      borderRightColor={borderColor}
      transition="width 0.2s"
      zIndex={10}
      {...props}
    >
      <VStack h="full" spacing={0} align="start">
        {/* ロゴ */}
        <Box p={4} w="full">
          <Link href="/" passHref>
            <Flex align="center" h="40px">
              {isCollapsed ? (
                <Image
                  src="/logo-icon.svg"
                  alt="Teamind"
                  h="32px"
                  fallback={
                    <Box fontSize="xl" fontWeight="bold">
                      T
                    </Box>
                  }
                />
              ) : (
                <Image
                  src="/logo.svg"
                  alt="Teamind"
                  h="32px"
                  fallback={
                    <Box fontSize="xl" fontWeight="bold">
                      Teamind
                    </Box>
                  }
                />
              )}
            </Flex>
          </Link>
        </Box>

        <Divider />

        {/* ナビゲーションアイテム */}
        <VStack
          spacing={1}
          align={isCollapsed ? "center" : "start"}
          w="100%"
          pt={4}
        >
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={isCollapsed ? '' : item.label}
              href={item.href}
              isActive={pathname === item.href}
              justifyContent={isCollapsed ? 'center' : 'flex-start'}
              w={isCollapsed ? 'autp' : '100%'}
              px={isCollapsed ? 2 : 4}
            />
          ))}
        </VStack>

        <Box flex={1} />

        {/* ユーザー情報（オプション） */}
        <Box
          px={4}
          py={4}
          w="100%"
          borderTopWidth="1px"
          borderTopColor={borderColor}
        >
          {!isCollapsed && (
            <Flex align="center">
              <Image
                src="/avatar-placeholder.png"
                alt="User"
                boxSize="32px"
                borderRadius="full"
                fallback={
                  <Box
                    boxSize="32px"
                    borderRadius="full"
                    bg="blue.500"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    U
                  </Box>
                }
              />
              <Text ml={3} fontWeight="medium" noOfLines={1}>
                ユーザー名
              </Text>
            </Flex>
          )}
        </Box>
      </VStack>
    </Box>
  );
};
