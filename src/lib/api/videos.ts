import { supabaseClient } from '@/lib/supabase';
import { fetchApi } from './fetchApi';

// 動画のタイプ定義
export interface Video {
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
}

// アップロード用のデータ型
export interface VideoUploadData {
  title: string;
  description?: string;
  tags?: string[];
  video: File;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

// 認証トークンの取得
const getAuthToken = async () => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  return session?.access_token;
};

// 動画一覧の取得
export async function fetchVideos() {
  try {
    return await fetchApi('/api/videos');
  } catch (error) {
    console.error('動画一覧の取得に失敗しました:', error);
    throw error;
  }
}

// 動画詳細の取得
export const fetchVideo = async (id: string): Promise<Video> => {
  const token = await getAuthToken();

  if (!token) {
    throw new Error('認証が必要です');
  }

  const response = await fetch(`${API_URL}/api/videos/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '動画の取得に失敗しました');
  }

  const data = await response.json();
  return data.video;
};

// 動画のアップロード
export const uploadVideo = async (
  videoData: VideoUploadData,
  onProgress?: (progress: number) => void
): Promise<Video> => {
  const token = await getAuthToken();

  if (!token) {
    throw new Error('認証が必要です');
  }

  const formData = new FormData();
  formData.append('video', videoData.video);
  formData.append('title', videoData.title);

  if (videoData.description) {
    formData.append('description', videoData.description);
  }

  if (videoData.tags && videoData.tags.length > 0) {
    formData.append('tags', JSON.stringify(videoData.tags));
  }

  // プログレスを追跡するためのXHRを使用
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', `${API_URL}/api/videos`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    // タイムアウトを設定（大きなファイル用に長めに設定）
    xhr.timeout = 300000; // 5分

    // レスポンスタイプを設定
    xhr.responseType = 'json';

    console.log(
      'Starting upload for file:',
      videoData.video.name,
      'Size:',
      videoData.video.size,
      'bytes'
    );

    // プログレスイベントのリスナー
    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        console.log('Upload progress event:', event);
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          console.log(
            `Upload progress: ${progress}% (${event.loaded}/${event.total} bytes)`
          );
          onProgress(progress);
        } else {
          console.log('Upload progress event not computable');
        }
      };
    }

    xhr.onload = () => {
      console.log('Upload completed with status:', xhr.status);

      if (xhr.status >= 200 && xhr.status < 300) {
        let data;

        // レスポンスの解析
        if (xhr.responseType === 'json' && xhr.response) {
          data = xhr.response;
        } else {
          try {
            data = JSON.parse(xhr.responseText);
          } catch (e) {
            console.error('Failed to parse response:', e);
            reject(new Error('レスポンスの解析に失敗しました'));
            return;
          }
        }

        console.log('Upload response data:', data);

        if (data && data.video) {
          resolve(data.video);
        } else {
          console.error('Invalid response format:', data);
          reject(new Error('無効なレスポンス形式です'));
        }
      } else {
        console.error('Upload failed with status:', xhr.status);
        try {
          let errorData;
          if (xhr.responseType === 'json' && xhr.response) {
            errorData = xhr.response;
          } else {
            errorData = JSON.parse(xhr.responseText);
          }
          console.error('Error details:', errorData);
          reject(
            new Error(
              errorData.error || `アップロードに失敗しました (${xhr.status})`
            )
          );
        } catch (e) {
          console.error('Failed to parse error response:', e);
          reject(new Error(`アップロードに失敗しました (${xhr.status})`));
        }
      }
    };

    xhr.onerror = (error) => {
      console.error('XHR error:', error);
      reject(new Error('ネットワークエラーが発生しました'));
    };

    xhr.ontimeout = () => {
      console.error('XHR timeout');
      reject(new Error('リクエストがタイムアウトしました'));
    };

    xhr.onabort = () => {
      console.error('XHR aborted');
      reject(new Error('リクエストが中断されました'));
    };

    xhr.send(formData);
  });
};

// 動画の削除
export const deleteVideo = async (id: string): Promise<void> => {
  const token = await getAuthToken();

  if (!token) {
    throw new Error('認証が必要です');
  }

  const response = await fetch(`${API_URL}/api/videos/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '削除に失敗しました');
  }
};

// 動画処理状態の取得
export const fetchVideoStatus = async (
  id: string
): Promise<{
  status: string;
  progress: number;
  error?: string;
}> => {
  const token = await getAuthToken();

  if (!token) {
    throw new Error('認証が必要です');
  }

  const response = await fetch(`${API_URL}/api/videos/${id}/status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '状態の取得に失敗しました');
  }

  const data = await response.json();
  return data;
};
