'use client';

import { Box } from '@chakra-ui/react';
import { UploadForm } from '@/components/organisms/UploadForm';

interface UploadLayoutProps {
  onFormSubmit?: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
  uploadProgress?: number;
}

export const UploadLayout = ({
  onFormSubmit,
  isLoading = false,
  uploadProgress = 0,
}: UploadLayoutProps) => {
  return (
    <Box maxW="800px" mx="auto" py={8} px={4}>
      <UploadForm
        onFormSubmit={onFormSubmit}
        isLoading={isLoading}
        uploadProgress={uploadProgress}
      />
    </Box>
  );
};
