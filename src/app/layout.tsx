'use client';

import { ChakraProvider, Box } from '@chakra-ui/react';
import { theme } from '@/theme';
import ErrorBoundary from '@/utils/ErrorBoundary';
import { QueryProvider } from '@/providers/QueryProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <title>Teamind</title>
        <meta
          name="description"
          content="動画の文字起こしと要約を自動生成するアプリケーション"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <QueryProvider>
          <ErrorBoundary>
            <ChakraProvider theme={theme}>
              <Box minH="100vh">{children}</Box>
            </ChakraProvider>
          </ErrorBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
