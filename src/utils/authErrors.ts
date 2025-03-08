/**
 * 認証エラーメッセージの日本語翻訳ユーティリティ
 */

/**
 * Supabaseの認証エラーメッセージを日本語に翻訳する
 * @param errorMessage 英語のエラーメッセージ
 * @returns 日本語に翻訳されたエラーメッセージ
 */
export const translateAuthError = (errorMessage: string): string => {
  const errorTranslations: Record<string, string> = {
    'Invalid login credentials':
      'メールアドレスまたはパスワードが正しくありません',
    'Email not confirmed':
      'メールアドレスが確認されていません。確認メールをご確認ください',
    'Invalid email or password':
      'メールアドレスまたはパスワードが正しくありません',
    'User already registered': 'このメールアドレスはすでに登録されています',
    'Password should be at least 6 characters':
      'パスワードは6文字以上である必要があります',
    'Password recovery requires an email':
      'パスワード回復にはメールアドレスが必要です',
    'Rate limit exceeded':
      'リクエスト回数の制限を超えました。しばらく時間をおいてから再試行してください',
    'Email rate limit exceeded':
      'メール送信回数の制限を超えました。しばらく時間をおいてから再試行してください',
    'User not found': 'ユーザーが見つかりません',
    'Email link is invalid or has expired':
      'メールリンクが無効または期限切れです',
    'Token has expired or is invalid': 'トークンが期限切れまたは無効です',
    session_expired:
      'セッションの有効期限が切れました。再度ログインしてください',
    auth_failed: '認証に失敗しました。再度ログインしてください',
    token_error: 'トークンの取得に失敗しました。再度ログインしてください',
    token_expired: 'トークンの有効期限が切れました。再度ログインしてください',
    session_error: 'セッションエラーが発生しました。再度ログインしてください',
  };

  // エラーメッセージの一部を検索して一致するものを探す
  for (const [englishError, japaneseError] of Object.entries(
    errorTranslations
  )) {
    if (errorMessage.includes(englishError)) {
      return japaneseError;
    }
  }

  // 一致するものがない場合はそのまま返す
  return errorMessage;
};

/**
 * パスワードの強度をチェックする
 * @param password チェックするパスワード
 * @returns エラーメッセージの配列（空の場合はパスワードが有効）
 */
export const checkPasswordStrength = (password: string): string[] => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  const passwordStrengthErrors = [];
  if (!isLongEnough) passwordStrengthErrors.push('8文字以上');
  if (!hasUpperCase) passwordStrengthErrors.push('大文字を含む');
  if (!hasLowerCase) passwordStrengthErrors.push('小文字を含む');
  if (!hasNumbers) passwordStrengthErrors.push('数字を含む');
  if (!hasSpecialChar) passwordStrengthErrors.push('特殊文字を含む');

  return passwordStrengthErrors;
};
