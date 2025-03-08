import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

serve(async (req) => {
  // 許可するオリジンを環境変数から取得するか、デフォルト値を使用
  const allowedOrigin =
    Deno.env.get('ALLOWED_ORIGIN') || 'http://localhost:3000';

  // ヘッダーをtryブロックの外で定義
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    // OPTIONSリクエストの処理
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    // Cloudinaryの設定を取得
    const cloudinaryUrl = Deno.env.get('CLOUDINARY_URL');
    if (!cloudinaryUrl) {
      console.error('Cloudinary設定が見つかりません');
      return new Response(
        JSON.stringify({
          error: 'サーバー設定エラー: Cloudinary設定が不足しています',
        }),
        { status: 500, headers }
      );
    }

    const match = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
    if (!match) {
      console.error('Cloudinary URLの形式が不正です:', cloudinaryUrl);
      return new Response(
        JSON.stringify({
          error: 'サーバー設定エラー: Cloudinary URLの形式が不正です',
        }),
        { status: 500, headers }
      );
    }

    const [_, api_key, api_secret, cloud_name] = match;
    console.log('Cloudinary設定を読み込みました:', {
      cloud_name,
      api_key: '***',
      api_secret: '***',
    });

    // リクエストボディの解析
    const { videoId, filePath } = await req.json();

    if (!videoId || !filePath) {
      return new Response(
        JSON.stringify({ error: '必須パラメータが不足しています' }),
        { status: 400, headers }
      );
    }

    console.log(`サムネイル生成開始: videoId=${videoId}, filePath=${filePath}`);

    // 認証ヘッダーからトークンを取得
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
        headers,
      });
    }

    // 環境変数からSupabase認証情報を取得
    const supabaseUrl = Deno.env.get('TEAMIND_SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get(
      'TEAMIND_SUPABASE_SERVICE_ROLE_KEY'
    );

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase設定が見つかりません');
      return new Response(
        JSON.stringify({
          error: 'サーバー設定エラー: Supabase設定が不足しています',
        }),
        { status: 500, headers }
      );
    }

    // Supabaseクライアントの初期化（サービスロールキーを使用し、RLSをバイパス）
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'X-Client-Info': 'edge-function-thumbnail',
        },
      },
    });

    // 動画のユーザーIDを取得
    const { data: videoData, error: videoError } = await supabase
      .from('videos')
      .select('user_id')
      .eq('id', videoId)
      .single();

    if (videoError || !videoData) {
      console.error('動画データ取得エラー:', videoError);
      return new Response(
        JSON.stringify({ error: '動画データの取得に失敗しました' }),
        { status: 500, headers }
      );
    }

    const userId = videoData.user_id;

    // サービスロールキーを使用して管理者として操作
    console.log('サービスロールキーを使用して管理者として操作します');

    // 動画の署名付きURLを取得（管理者権限で）
    const { data: urlData, error: urlError } = await supabase.storage
      .from('videos')
      .createSignedUrl(filePath, 60 * 5); // 5分間有効

    if (urlError || !urlData?.signedUrl) {
      console.error('動画URL取得エラー:', urlError);
      return new Response(
        JSON.stringify({ error: '動画URLの取得に失敗しました' }),
        { status: 500, headers }
      );
    }

    console.log('動画URL取得成功:', urlData.signedUrl.substring(0, 50) + '...');

    // Cloudinaryの直接アップロードAPIを使用
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = await generateSignature(timestamp, api_secret);

    const formData = new FormData();
    formData.append('file', urlData.signedUrl);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', api_key);
    formData.append('signature', signature);
    formData.append('resource_type', 'video');

    console.log('Cloudinaryにアップロード中...');
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await cloudinaryResponse.json();
    if (!cloudinaryResponse.ok) {
      console.error('Cloudinaryエラー:', result);
      return new Response(
        JSON.stringify({
          error: `Cloudinaryエラー: ${JSON.stringify(result)}`,
        }),
        { status: 500, headers }
      );
    }

    console.log('Cloudinaryアップロード成功:', {
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type,
    });

    // サムネイルのパスを生成
    const uniqueId = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    const thumbnailPath = `thumbnails/${userId}/${uniqueId}.jpg`;

    // Cloudinaryから生成されたサムネイルをSupabaseに保存
    const thumbnailUrl = result.secure_url.replace(
      '/upload/',
      '/upload/w_480,f_jpg/'
    );
    console.log('サムネイルURL:', thumbnailUrl.substring(0, 50) + '...');

    console.log('サムネイル画像を取得中...');
    const thumbnailResponse = await fetch(thumbnailUrl);
    if (!thumbnailResponse.ok) {
      console.error('サムネイル取得エラー:', thumbnailResponse.status);
      return new Response(
        JSON.stringify({ error: 'サムネイル画像の取得に失敗しました' }),
        { status: 500, headers }
      );
    }

    const thumbnailBuffer = await thumbnailResponse.arrayBuffer();
    console.log(
      'サムネイル画像取得成功:',
      `${thumbnailBuffer.byteLength} バイト`
    );

    // サムネイルをSupabaseにアップロード（管理者権限で）
    console.log('サムネイルをSupabaseにアップロード中...');
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(thumbnailPath, thumbnailBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: true, // 既存のファイルを上書き
      });

    if (uploadError) {
      console.error('サムネイルアップロードエラー:', uploadError);

      // エラーメッセージを抽出
      let errorMessage = '不明なエラー';
      if (typeof uploadError === 'object' && uploadError !== null) {
        const unknownError = uploadError as unknown;
        errorMessage = isErrorWithMessage(unknownError)
          ? unknownError.message
          : String(uploadError);
      } else {
        errorMessage = String(uploadError);
      }

      return new Response(
        JSON.stringify({
          error: `サムネイルアップロードエラー: ${errorMessage}`,
        }),
        { status: 500, headers }
      );
    }

    console.log('サムネイルアップロード成功:', thumbnailPath);

    // サムネイルの公開URLを取得（署名なし）
    const { data: publicUrl } = supabase.storage
      .from('videos')
      .getPublicUrl(thumbnailPath);

    console.log(
      'サムネイル公開URL:',
      publicUrl.publicUrl.substring(0, 50) + '...'
    );

    // 動画メタデータを更新（RLSをバイパス）
    console.log('動画メタデータを更新中...');
    const { error: updateError } = await supabase
      .from('videos')
      .update({
        thumbnail_path: thumbnailPath,
        thumbnail_url: publicUrl.publicUrl, // 署名なしの公開URLを使用
      })
      .eq('id', videoId)
      .throwOnError(); // エラーが発生した場合は例外をスロー

    if (updateError) {
      console.error('メタデータ更新エラー:', updateError);

      // エラーメッセージを抽出
      let errorMessage = '不明なエラー';
      if (typeof updateError === 'object' && updateError !== null) {
        const unknownError = updateError as unknown;
        errorMessage = isErrorWithMessage(unknownError)
          ? unknownError.message
          : String(updateError);
      } else {
        errorMessage = String(updateError);
      }

      return new Response(
        JSON.stringify({
          error: `メタデータ更新エラー: ${errorMessage}`,
        }),
        { status: 500, headers }
      );
    }

    console.log('メタデータ更新成功');

    return new Response(
      JSON.stringify({
        success: true,
        thumbnailPath,
        thumbnailUrl: publicUrl.publicUrl,
      }),
      { headers }
    );
  } catch (error: unknown) {
    console.error('サムネイル生成エラー:', error);

    // エラーメッセージを抽出
    let errorMessage = '不明なエラー';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      const unknownError = error as unknown;
      errorMessage = isErrorWithMessage(unknownError)
        ? unknownError.message
        : String(error);
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      errorMessage = String(error);
    }

    return new Response(
      JSON.stringify({
        error: `サムネイル生成エラー: ${errorMessage}`,
      }),
      { status: 500, headers }
    );
  }
});

// Cloudinaryの署名を生成する関数
async function generateSignature(timestamp: number, apiSecret: string) {
  const str = `timestamp=${timestamp}${apiSecret}`;
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ErrorWithMessage).message === 'string'
  );
}
