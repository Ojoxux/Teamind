'use client';

import { Heading as ChakraHeading, type HeadingProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (props, ref) => {
    return <ChakraHeading ref={ref} {...props} />;
  }
);

Heading.displayName = 'Heading';
