# サムネイル生成 Edge Function

この Edge Function は、動画ファイルからサムネイルを生成するためのものです。FFmpeg の WASM バージョンを使用して、動画の特定のフレームをキャプチャし、JPEG として保存します。

## 機能

- 動画ファイルからサムネイルを抽出
- 抽出したサムネイルを Supabase ストレージにアップロード
- 動画メタデータを更新してサムネイル情報を保存

## 使用方法

### ローカルでの実行

1. `.env.example`ファイルを`.env`にコピーし、必要な環境変数を設定します。

```bash
cp .env.example .env
# .envファイルを編集して、必要な値を設定
```

2. ローカルで Edge Function を実行します。

```bash
supabase functions serve generate-thumbnail --env-file ./supabase/functions/generate-thumbnail/.env
```

3. 別のターミナルから、以下のようにリクエストを送信してテストします。

```bash
curl -X POST http://localhost:54321/functions/v1/generate-thumbnail \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-supabase-anon-key" \
  -d '{"videoId":"your-video-id","filePath":"path/to/video.mp4","userId":"user-id","supabaseUrl":"https://your-project-id.supabase.co","supabaseKey":"your-service-role-key"}'
```

### デプロイ

Supabase CLI を使用してデプロイします。

```bash
supabase functions deploy generate-thumbnail --project-ref your-project-ref
```

デプロイ後、環境変数を Supabase ダッシュボードから設定します。

## パラメータ

リクエストボディには以下の JSON パラメータが必要です：

- `videoId`: 動画の ID（データベース内）
- `filePath`: Supabase ストレージ内の動画ファイルのパス
- `userId`: ユーザー ID
- `supabaseUrl`: Supabase プロジェクトの URL
- `supabaseKey`: Supabase のサービスロールキー（重要な権限を持つため、安全に扱ってください）

## レスポンス

成功時のレスポンス：

```json
{
  "success": true,
  "thumbnailPath": "thumbnails/user-id/timestamp-random.jpg",
  "thumbnailUrl": "https://your-project-id.supabase.co/storage/v1/object/public/videos/thumbnails/user-id/timestamp-random.jpg"
}
```

エラー時のレスポンス：

```json
{
  "error": "エラーメッセージ"
}
```

## 注意事項

- FFmpeg の WASM バージョンはメモリ使用量が多いため、大きな動画ファイルの処理には注意が必要です。
- Edge Functions の実行時間は最大 50 秒です。大きな動画ファイルの処理には時間がかかる場合があります。
- サービスロールキーは非常に強力な権限を持つため、安全に管理してください。
