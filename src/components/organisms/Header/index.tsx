'use client';

import {
  Box,
  Flex,
  IconButton,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  type BoxProps,
} from '@chakra-ui/react';
import { FiMenu, FiBell, FiChevronDown } from 'react-icons/fi';
import { SearchBar } from '@/components/molecules/SearchBar';
import { Text } from '@/components/atoms/Text';

export interface HeaderProps extends BoxProps {
  onMenuClick?: () => void;
  showSearchBar?: boolean;
  onSearch?: (query: string) => void;
  userName?: string;
  userAvatarUrl?: string;
}

export const Header = ({
  onMenuClick,
  showSearchBar = true,
  onSearch,
  userName = 'ユーザー',
  userAvatarUrl,
  ...props
}: HeaderProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={5}
      bg={bgColor}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
      py={3}
      px={4}
      {...props}
    >
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <IconButton
            aria-label="メニュー"
            icon={<FiMenu />}
            variant="ghost"
            onClick={onMenuClick}
            mr={4}
          />

          {showSearchBar && (
            <Box w={{ base: 'auto', md: '320px', lg: '400px' }}>
              <SearchBar onSearch={onSearch} />
            </Box>
          )}
        </Flex>

        <Flex align="center">
          <IconButton
            aria-label="通知"
            icon={<FiBell />}
            variant="ghost"
            mr={2}
          />

          <Menu>
            <MenuButton as={Box} cursor="pointer" ml={4}>
              <Flex align="center">
                <Avatar size="sm" src={userAvatarUrl} name={userName} />
                <Text ml={2} display={{ base: 'none', md: 'block' }}>
                  {userName}
                </Text>
                <Box ml={1} display={{ base: 'none', md: 'block' }}>
                  <FiChevronDown />
                </Box>
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem>プロフィール</MenuItem>
              <MenuItem>設定</MenuItem>
              <MenuDivider />
              <MenuItem>ログアウト</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};
