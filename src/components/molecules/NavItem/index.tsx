'use client';

import { Box, Flex, Icon, type BoxProps } from '@chakra-ui/react';
import { Text } from '@/components/atoms/Text';
import Link from 'next/link';
import type { IconType } from 'react-icons';

export interface NavItemProps extends BoxProps {
  icon: IconType;
  label: string;
  href: string;
  isActive?: boolean;
  isFolded?: boolean;  // 追加
}

export const NavItem = ({
  icon,
  label,
  href,
  isActive = false,
  isFolded = false,  // 追加
  ...props
}: NavItemProps) => {
  return (
    <Box
      as={Link}
      href={href}
      w="100%"
      py={3}
      px={4}
      borderRadius="md"
      bg={isActive ? 'blue.50' : 'transparent'}
      color={isActive ? 'blue.600' : 'gray.700'}
      textAlign="center"
      display="flex"
      justifyContent="center"
      alignItems="center"
      _hover={{
        bg: isActive ? 'blue.50' : 'gray.100',
        transform: 'scale(1.05)',
      }}
      transition="all 0.2s"
      {...props}
    >
      <Flex 
        align="center" 
        justify={isFolded ? "center" : "flex-start"} 
        w="full"
      >
        <Icon as={icon} fontSize="xl" mr={isFolded ? 0 : 3} />
        {!isFolded && (
          <Text fontWeight={isActive ? 'semibold' : 'medium'}>{label}</Text>
        )}
      </Flex>
    </Box>

  );
};
