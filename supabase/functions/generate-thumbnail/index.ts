import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// FFmpegのWASMバージョンをインポート
import { createFFmpeg, fetchFile } from "https://esm.sh/@ffmpeg/ffmpeg@0.11.6";

serve(async (req) => {
  try {
    // CORSヘッダーを設定
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // OPTIONSリクエスト（プリフライト）の処理
    if (req.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    // リクエストからJSONを取得
    const { videoId, filePath, userId, supabaseUrl, supabaseKey } = await req.json();

    if (!videoId || !filePath || !userId || !supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: "必須パラメータが不足しています" }),
        { status: 400, headers }
      );
    }

    console.log(`サムネイル生成開始: videoId=${videoId}, filePath=${filePath}`);

    // 環境変数の取得（TEAMINDプレフィックスを使用）
    const teamindUrl = Deno.env.get("TEAMIND_URL") || supabaseUrl;
    const teamindKey = Deno.env.get("TEAMIND_SERVICE_ROLE_KEY") || supabaseKey;

    console.log("環境変数確認:", {
      teamindUrl: teamindUrl ? "設定済み" : "未設定",
      teamindKey: teamindKey ? "設定済み" : "未設定",
      supabaseUrl: supabaseUrl ? "設定済み" : "未設定",
      supabaseKey: supabaseKey ? "設定済み" : "未設定"
    });

    // Supabaseクライアントの初期化（環境変数またはリクエストパラメータを使用）
    const supabase = createClient(teamindUrl, teamindKey);

    // 動画ファイルのURLを取得
    const { data: urlData, error: urlError } = await supabase.storage
      .from("videos")
      .createSignedUrl(filePath, 60); // 60秒間有効なURL

    if (urlError || !urlData?.signedUrl) {
      console.error("動画URL取得エラー:", urlError);
      return new Response(
        JSON.stringify({ error: "動画URLの取得に失敗しました" }),
        { status: 500, headers }
      );
    }

    console.log("動画URL取得成功:", urlData.signedUrl);

    // FFmpegインスタンスの作成
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    console.log("FFmpeg読み込み完了");

    // 動画ファイルをダウンロード
    console.log("動画ファイルのダウンロード開始");
    const videoData = await fetchFile(urlData.signedUrl);
    ffmpeg.FS("writeFile", "input.mp4", videoData);
    console.log("動画ファイルのダウンロード完了");

    // 動画の最初のフレームをサムネイルとして抽出（1秒目のフレーム）
    console.log("サムネイル抽出開始");
    await ffmpeg.run(
      "-i", "input.mp4",
      "-ss", "00:00:01.000",
      "-vframes", "1",
      "-vf", "scale=480:-1",
      "-f", "image2",
      "thumbnail.jpg"
    );
    console.log("サムネイル抽出完了");

    // 生成されたサムネイルを読み込む
    const thumbnailData = ffmpeg.FS("readFile", "thumbnail.jpg");
    console.log(`サムネイルデータ取得: ${thumbnailData.length} bytes`);

    // サムネイルのパスを生成
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    const thumbnailPath = `thumbnails/${userId}/${uniqueId}.jpg`;

    // サムネイルをSupabaseのストレージにアップロード
    console.log("サムネイルアップロード開始:", thumbnailPath);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("videos")
      .upload(thumbnailPath, thumbnailData, {
        contentType: "image/jpeg",
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("サムネイルアップロードエラー:", uploadError);
      return new Response(
        JSON.stringify({ error: "サムネイルのアップロードに失敗しました" }),
        { status: 500, headers }
      );
    }

    console.log("サムネイルアップロード成功");

    // サムネイルの署名付きURLを取得
    const { data: thumbnailUrlData, error: thumbnailUrlError } = await supabase.storage
      .from("videos")
      .createSignedUrl(thumbnailPath, 60 * 60); // 1時間有効

    if (thumbnailUrlError || !thumbnailUrlData?.signedUrl) {
      console.error("サムネイルURL生成エラー:", thumbnailUrlError);
      return new Response(
        JSON.stringify({ error: "サムネイルURLの生成に失敗しました" }),
        { status: 500, headers }
      );
    }

    console.log("サムネイルURL生成成功:", thumbnailUrlData.signedUrl);

    // 動画テーブルを更新してサムネイル情報を保存
    console.log("動画メタデータ更新開始");
    const { error: updateError } = await supabase
      .from("videos")
      .update({
        thumbnail_path: thumbnailPath,
        thumbnail_url: thumbnailUrlData.signedUrl,
      })
      .eq("id", videoId);

    if (updateError) {
      console.error("動画メタデータ更新エラー:", updateError);
      return new Response(
        JSON.stringify({ error: "動画メタデータの更新に失敗しました" }),
        { status: 500, headers }
      );
    }

    console.log("動画メタデータ更新成功");

    // 成功レスポンスを返す
    return new Response(
      JSON.stringify({
        success: true,
        thumbnailPath,
        thumbnailUrl: thumbnailUrlData.signedUrl,
      }),
      { headers }
    );
  } catch (error) {
    console.error("サムネイル生成エラー:", error);
    return new Response(
      JSON.stringify({ error: `サムネイル生成エラー: ${error.message}` }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        }
      }
    );
  }
});
