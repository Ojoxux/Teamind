'use client';

import { Spinner as ChakraSpinner, type SpinnerProps } from '@chakra-ui/react';

export const Spinner = (props: SpinnerProps) => {
  return <ChakraSpinner {...props} />;
};
