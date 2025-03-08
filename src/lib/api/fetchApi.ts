import { supabaseClient } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

export async function fetchApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  try {
    // セッションを取得し、リトライメカニズムを追加
    let retryCount = 0;
    const maxRetries = 3; // リトライ回数を増やす
    let token = null;

    while (retryCount <= maxRetries) {
      try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        token = sessionData.session?.access_token;

        if (token || endpoint.includes('/auth/')) {
          break;
        }
      } catch (sessionError) {
        console.error('セッション取得エラー:', sessionError);
      }

      console.log(
        `認証トークンの取得を再試行中... (${retryCount + 1}/${maxRetries + 1})`
      );
      retryCount++;

      // 少し待機してからリトライ（待機時間を増やす）
      if (retryCount <= maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1500 * retryCount));
      }
    }

    if (!token && !endpoint.includes('/auth/')) {
      console.error('認証トークンがありません。認証が必要です。');
      throw new Error('認証が必要です。ログインしてください。');
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

    // リクエストのリトライ
    let requestRetryCount = 0;
    const maxRequestRetries = 2;
    let response;

    while (requestRetryCount <= maxRequestRetries) {
      try {
        response = await fetch(url, {
          ...options,
          headers,
        });

        // 成功したらループを抜ける
        if (response.ok) break;

        // 401/403エラーの場合はリトライしない（認証エラー）
        if (response.status === 401 || response.status === 403) break;

        console.log(
          `APIリクエスト失敗 (${response.status})、再試行中... (${
            requestRetryCount + 1
          }/${maxRequestRetries + 1})`
        );
      } catch (fetchError) {
        console.error('フェッチエラー:', fetchError);
      }

      requestRetryCount++;
      if (requestRetryCount <= maxRequestRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * requestRetryCount)
        );
      }
    }

    if (!response) {
      throw new Error('APIサーバーに接続できません');
    }

    // レスポンスのステータスコードが2xxでない場合はエラーをスロー
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`APIエラー (${response.status}):`, errorData);
      // 認証エラーの場合はエラーをログに記録するが、エラーはスローしない
      if (response.status === 401) {
        console.warn('認証エラーが発生しましたが、処理を続行します');
        return { error: '認証エラー', status: 401, data: [] };
      }

      // サーバーエラーの場合もエラーをログに記録するが、エラーはスローしない
      if (response.status === 500) {
        console.warn('サーバーエラーが発生しましたが、処理を続行します');
        return { error: 'サーバーエラー', status: 500, data: [] };
      }

      // その他のエラーの場合はエラーをスロー
      throw new Error(
        errorData.error || `APIリクエストエラー: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    console.error('API呼び出し中のエラー:', error);

    // エラーをそのままスロー（リダイレクトは行わない）
    // useRequireAuthフックがリダイレクトを処理する
    throw error;
  }
}
