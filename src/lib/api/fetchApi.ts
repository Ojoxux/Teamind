import { supabaseClient } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

export async function fetchApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  try {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token && !endpoint.includes('/auth/')) {
      console.error('認証トークンがありません');
      throw new Error('認証が必要です');
    }

    const url = `${API_URL}${endpoint}`;
    console.log(`APIリクエスト: ${url}`);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('認証トークンをヘッダーに設定しました');
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // レスポンスのステータスコードが2xxでない場合はエラーをスロー
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`APIエラー (${response.status}):`, errorData);

      // 認証エラーの場合はログインページにリダイレクト
      if (response.status === 401 && typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath !== '/login') {
          window.location.href = '/login';
        }
      }

      throw new Error(
        errorData.error || `APIリクエストエラー: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    console.error('API呼び出し中のエラー:', error);

    // 認証エラーの場合はログインページにリダイレクト
    if (
      error instanceof Error &&
      error.message.includes('認証が必要です') &&
      typeof window !== 'undefined'
    ) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        window.location.href = '/login';
      }
    }

    throw error;
  }
}
