'use client';

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  type FormControlProps,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';
export interface FormFieldProps extends FormControlProps {
  label?: string;
  helperText?: string;
  error?: string;
  isRequired?: boolean;
  children: ReactNode;
}

export const FormField = ({
  label,
  helperText,
  error,
  isRequired,
  children,
  ...props
}: FormFieldProps) => {
  return (
    <FormControl isInvalid={!!error} isRequired={isRequired} {...props}>
      {label && <FormLabel>{label}</FormLabel>}
      {children}
      {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
