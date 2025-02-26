'use client';

import {
  Box,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  List,
  ListItem,
  ListIcon,
  Divider,
  useColorModeValue,
  type BoxProps,
} from '@chakra-ui/react';
import { FiCheckCircle, FiCopy, FiDownload } from 'react-icons/fi';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { KeywordTag } from '@/components/molecules/KeywordTag';

export interface SummaryPoint {
  id: string;
  text: string;
}

export interface SummaryPanelProps extends BoxProps {
  summary: string;
  keyPoints?: SummaryPoint[];
  keywords?: string[];
  questions?: SummaryPoint[];
}

export const SummaryPanel = ({
  summary,
  keyPoints = [],
  keywords = [],
  questions = [],
  ...props
}: SummaryPanelProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // テキストをコピー
  const copyText = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert('テキストをクリップボードにコピーしました');
      })
      .catch((err) => {
        console.error('コピーに失敗しました:', err);
      });
  };

  // 要約をダウンロード
  const downloadSummary = () => {
    let text = `# 要約\n\n${summary}\n\n`;

    if (keyPoints.length > 0) {
      text += '# 重要ポイント\n\n';
      for (const point of keyPoints) {
        text += `- ${point.text}\n`;
      }
      text += '\n';
    }

    if (keywords.length > 0) {
      text += '# キーワード\n\n';
      for (const keyword of keywords) {
        text += `- ${keyword}\n`;
      }
      text += '\n';
    }

    if (questions.length > 0) {
      text += '# 質問\n\n';
      for (const question of questions) {
        text += `- ${question.text}\n`;
      }
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      overflow="hidden"
      h="100%"
      display="flex"
      flexDirection="column"
      {...props}
    >
      <Box p={4} borderBottomWidth="1px" borderBottomColor={borderColor}>
        <Heading size="md" mb={4}>
          要約
        </Heading>

        <Box mb={3}>
          <Button
            size="sm"
            leftIcon={<FiCopy />}
            onClick={() => copyText(summary)}
            variant="outline"
            mr={2}
          >
            コピー
          </Button>
          <Button
            size="sm"
            leftIcon={<FiDownload />}
            onClick={downloadSummary}
            variant="outline"
          >
            ダウンロード
          </Button>
        </Box>
      </Box>

      <Box flex="1" overflowY="auto">
        <Tabs isFitted variant="enclosed">
          <TabList>
            <Tab>要約</Tab>
            <Tab>重要ポイント</Tab>
            <Tab>キーワード</Tab>
            {questions.length > 0 && <Tab>質問</Tab>}
          </TabList>

          <TabPanels>
            {/* 要約タブ */}
            <TabPanel>
              <Text whiteSpace="pre-wrap">{summary}</Text>
            </TabPanel>

            {/* 重要ポイントタブ */}
            <TabPanel>
              <List spacing={3}>
                {keyPoints.map((point) => (
                  <ListItem key={point.id} display="flex">
                    <ListIcon as={FiCheckCircle} color="green.500" mt={1} />
                    <Text>{point.text}</Text>
                  </ListItem>
                ))}
              </List>
            </TabPanel>

            {/* キーワードタブ */}
            <TabPanel>
              <Box>
                {keywords.map((keyword) => (
                  <KeywordTag key={keyword} keyword={keyword} m={1} />
                ))}
              </Box>
            </TabPanel>

            {/* 質問タブ */}
            {questions.length > 0 && (
              <TabPanel>
                <List spacing={3}>
                  {questions.map((question) => (
                    <ListItem key={question.id}>
                      <Text fontWeight="medium">{question.text}</Text>
                    </ListItem>
                  ))}
                </List>
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};
