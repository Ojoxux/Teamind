export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  duration: number;
  uploadDate: string;
  createdAt: string;
  updatedAt: string;
}

// APIから返される動画データの型
export interface ApiVideo {
  id: string;
  title: string;
  description: string;
  file_path: string;
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: string;
  status: string;
  duration: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  transcript?: TranscriptItem[];
  summary?: string;
  key_points?: KeyPoint[];
  questions?: Question[];
}

export interface TranscriptItem {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
}

export interface KeyPoint {
  id: string;
  title: string;
  description: string;
}

// SummaryPanelコンポーネントで使用される型と互換性を持たせるためのマッピング
export interface SummaryPoint {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  question: string;
  answer: string;
}

// VideoDetailLayoutに必要なデータの型
export interface VideoDetailData {
  videoId: string;
  videoUrl?: string;
  videoTitle: string;
  videoDescription?: string;
  uploadDate?: string;
  viewCount?: number;
  transcript: TranscriptItem[];
  chapters?: { id: string; title: string; startTime: number }[];
  summary: string;
  keyPoints?: SummaryPoint[];
  keywords?: string[];
  questions?: SummaryPoint[];
  duration: number;
}
