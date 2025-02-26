'use client';

import { Icon as ChakraIcon, type IconProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Icon = forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  return <ChakraIcon ref={ref} {...props} />;
});

Icon.displayName = 'Icon';
