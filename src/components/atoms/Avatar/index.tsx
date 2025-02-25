'use client';

import { Avatar as ChakraAvatar, type AvatarProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>((props, ref) => {
  return <ChakraAvatar ref={ref} {...props} />;
});

Avatar.displayName = 'Avatar';
