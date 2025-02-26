'use client';

import { Box, Container } from '@chakra-ui/react';
import { MainLayout } from '@/components/templates/MainLayout';
import { UploadForm } from '@/components/organisms/UploadForm';

export interface UploadLayoutProps {
  onFormSubmit?: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
}

export const UploadLayout = ({
  onFormSubmit,
  isLoading = false,
}: UploadLayoutProps) => {
  return (
    <MainLayout showSearchBar={false}>
      <Container maxW="container.md" py={8}>
        <UploadForm onFormSubmit={onFormSubmit} isLoading={isLoading} />
      </Container>
    </MainLayout>
  );
};
