'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { VideoDetailLayout } from '@/components/templates/VideoDetailLayout';

// モックデータ
const MOCK_TRANSCRIPT = Array.from({ length: 20 }, (_, i) => ({
  id: `transcript-${i}`,
  text: `これはサンプルの文字起こしテキストです。このテキストは${
    i + 1
  }番目のセグメントです。実際の文字起こしでは、話者の発言内容がここに表示されます。`,
  startTime: i * 30,
  endTime: (i + 1) * 30,
  speakerName: i % 2 === 0 ? '話者A' : '話者B',
}));

const MOCK_CHAPTERS = [
  { id: 'chapter-1', title: 'イントロダクション', startTime: 0 },
  { id: 'chapter-2', title: '主要なポイント', startTime: 120 },
  { id: 'chapter-3', title: '事例紹介', startTime: 300 },
  { id: 'chapter-4', title: '結論', startTime: 480 },
];

const MOCK_SUMMARY = `
これはサンプルの要約テキストです。実際の要約では、動画の内容を簡潔にまとめた文章が表示されます。
要約は動画の主要なポイントを把握するのに役立ちます。長い動画でも、要約を読むことで内容を素早く理解できます。
この例では、架空の会議やプレゼンテーションの要約を想定しています。実際のアプリケーションでは、AIによって生成された要約が表示されます。
`;

const MOCK_KEY_POINTS = [
  { id: 'point-1', text: '重要ポイント1: サンプルの重要なポイントです。' },
  { id: 'point-2', text: '重要ポイント2: 動画内で強調されていた内容です。' },
  { id: 'point-3', text: '重要ポイント3: 視聴者が覚えておくべき情報です。' },
  { id: 'point-4', text: '重要ポイント4: 動画の結論に関連する内容です。' },
];

const MOCK_KEYWORDS = [
  'サンプル',
  'デモ',
  'テスト',
  '例示',
  'プレゼンテーション',
  '会議',
  'レポート',
];

const MOCK_QUESTIONS = [
  {
    id: 'question-1',
    text: 'この内容についてさらに詳しく知るにはどうすればよいですか？',
  },
  {
    id: 'question-2',
    text: 'プレゼンテーションで使用されていたツールは何ですか？',
  },
  { id: 'question-3', text: '主要な課題は何でしたか？' },
];

const MOCK_RELATED_VIDEOS = Array.from({ length: 8 }, (_, i) => ({
  id: `related-${i + 1}`,
  title: `関連動画 ${i + 1}`,
  thumbnailUrl: `https://picsum.photos/seed/related-${i + 1}/400/225`,
  duration: Math.floor(Math.random() * 1800) + 300, // 5分〜35分
  uploadDate: new Date(
    Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
  ).toISOString(),
  viewCount: Math.floor(Math.random() * 50000),
  channelName: `チャンネル ${(i % 5) + 1}`,
  description: `これは関連動画 ${
    i + 1
  } の説明です。実際のアプリケーションでは、動画の詳細な説明がここに表示されます。`,
}));

export default function VideoPage() {
  const params = useParams();
  const videoId = params.id as string;

  const [videoData, setVideoData] = useState({
    videoId,
    videoUrl:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // サンプル動画URL
    videoTitle: `サンプル動画 ${videoId}`,
    videoDescription:
      'これはサンプルの動画説明です。実際のアプリケーションでは、動画の詳細な説明がここに表示されます。',
    uploadDate: '2023年4月1日',
    viewCount: 12345,
    transcript: MOCK_TRANSCRIPT,
    chapters: MOCK_CHAPTERS,
    summary: MOCK_SUMMARY,
    keyPoints: MOCK_KEY_POINTS,
    keywords: MOCK_KEYWORDS,
    questions: MOCK_QUESTIONS,
    relatedVideos: MOCK_RELATED_VIDEOS,
  });

  // 実際のアプリケーションでは、ここでAPIからデータを取得
  useEffect(() => {
    // APIリクエストのシミュレーション
    const fetchData = async () => {
      // 実際のAPIリクエストの代わりに、タイムアウトを使用
      await new Promise((resolve) => setTimeout(resolve, 500));

      // データは既に設定済みなので、ここでは何もしない
    };

    fetchData();
  }, []); // videoIdを依存配列から削除

  return (
    <VideoDetailLayout
      videoId={videoData.videoId}
      videoUrl={videoData.videoUrl}
      videoTitle={videoData.videoTitle}
      videoDescription={videoData.videoDescription}
      uploadDate={videoData.uploadDate}
      viewCount={videoData.viewCount}
      transcript={videoData.transcript}
      chapters={videoData.chapters}
      summary={videoData.summary}
      keyPoints={videoData.keyPoints}
      keywords={videoData.keywords}
      questions={videoData.questions}
      relatedVideos={videoData.relatedVideos}
    />
  );
}
