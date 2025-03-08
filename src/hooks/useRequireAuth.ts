import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from './useSupabaseAuth';
import { translateAuthError } from '@/utils/authErrors';

export function useRequireAuth(redirectUrl = '/login') {
  const { user, isLoading: authLoading, getToken } = useSupabaseAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1秒

    const checkAuth = async () => {
      try {
        // 認証チェックが完了し、ユーザーが存在しない場合
        if (!authLoading && !user && mounted) {
          console.log('認証されていないユーザー、リダイレクトします');
          setIsRedirecting(true);
          router.push(redirectUrl);
        } else if (user && mounted) {
          console.log('認証済みユーザー:', user.id);
          setIsRedirecting(false);

          // Supabaseのデータベース接続を確認
          try {
            const token = await getToken();
            console.log('有効なトークン:', token ? 'あり' : 'なし');

            if (!token && retryCount < maxRetries) {
              // トークンがない場合、再試行
              retryCount++;
              console.log(
                `トークン取得を再試行します (${retryCount}/${maxRetries})...`
              );
              setTimeout(checkAuth, retryDelay * retryCount);
              return;
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : '不明なエラーが発生しました';
            const translatedError = translateAuthError(errorMessage);
            console.error('トークン確認エラー:', translatedError);

            if (retryCount < maxRetries) {
              // エラーが発生した場合、再試行
              retryCount++;
              console.log(
                `トークン取得を再試行します (${retryCount}/${maxRetries})...`
              );
              setTimeout(checkAuth, retryDelay * retryCount);
              return;
            } else {
              // 最大再試行回数を超えた場合、ログインページにリダイレクト
              setIsRedirecting(true);
              router.push(`${redirectUrl}?error=token_error`);
              return;
            }
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '不明なエラーが発生しました';
        const translatedError = translateAuthError(errorMessage);
        console.error('認証チェックエラー:', translatedError);

        if (mounted) {
          if (retryCount < maxRetries) {
            // エラーが発生した場合、再試行
            retryCount++;
            console.log(
              `認証チェックを再試行します (${retryCount}/${maxRetries})...`
            );
            setTimeout(checkAuth, retryDelay * retryCount);
            return;
          }

          setIsRedirecting(true);
          // エラーの種類に応じてクエリパラメータを設定
          const errorParam = errorMessage.includes('Token')
            ? 'token_expired'
            : errorMessage.includes('auth')
            ? 'auth_failed'
            : 'session_error';
          router.push(`${redirectUrl}?error=${errorParam}`);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [user, authLoading, router, redirectUrl, getToken]);

  // 認証チェック中またはリダイレクト中はローディング状態とする
  const isLoading = authLoading || isRedirecting;

  return { user, isLoading };
}
