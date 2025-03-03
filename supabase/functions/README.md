# Supabase Edge Functions

このディレクトリには、Supabase Edge Functions が含まれています。Edge Functions は、Deno ランタイム上で実行されるサーバーレス関数です。

## 環境変数の設定

Edge Functions を使用するには、以下の環境変数を設定する必要があります。

### バックエンド（Cloudflare Workers）の環境変数

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_PROJECT_REF=your-project-ref
```

これらの環境変数は、Cloudflare Workers のダッシュボードから設定します。

### Edge Functions の環境変数

Edge Functions の環境変数は、Supabase ダッシュボードから設定します。

1. Supabase ダッシュボードにログイン
2. プロジェクトを選択
3. 「Settings」→「Functions」→「Environment variables」
4. 以下の環境変数を追加：
   - `SUPABASE_URL`: Supabase プロジェクトのエンドポイント
   - `SUPABASE_ANON_KEY`: 匿名キー
   - `SUPABASE_SERVICE_ROLE_KEY`: サービスロールキー

## Edge Functions の開発

### ローカル開発

1. Supabase CLI をインストール

```bash
npm install -g supabase
```

2. ローカルで実行

```bash
supabase functions serve generate-thumbnail --env-file ./supabase/functions/generate-thumbnail/.env
```

### デプロイ

```bash
supabase functions deploy generate-thumbnail --project-ref your-project-ref
```

## 利用可能な Edge Functions

### generate-thumbnail

動画ファイルからサムネイルを生成する Edge Function です。FFmpeg の WASM バージョンを使用して、動画の特定のフレームをキャプチャし、JPEG として保存します。

#### 使用方法

```typescript
// バックエンドコードからの呼び出し例
const edgeFunctionService = new EdgeFunctionThumbnailService(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const thumbnailResult = await edgeFunctionService.generateThumbnail(
  videoId,
  filePath,
  userId
);

if (thumbnailResult) {
  console.log('サムネイル生成成功:', thumbnailResult);
  // サムネイル情報を更新
  await supabase
    .from('videos')
    .update({
      thumbnail_path: thumbnailResult.thumbnailPath,
      thumbnail_url: thumbnailResult.thumbnailUrl,
    })
    .eq('id', videoId);
}
```

#### パラメータ

- `videoId`: 動画の ID（データベース内）
- `filePath`: Supabase ストレージ内の動画ファイルのパス
- `userId`: ユーザー ID
- `supabaseUrl`: Supabase プロジェクトの URL
- `supabaseKey`: Supabase のサービスロールキー

#### レスポンス

```json
{
  "success": true,
  "thumbnailPath": "thumbnails/user-id/timestamp-random.jpg",
  "thumbnailUrl": "https://your-project-id.supabase.co/storage/v1/object/public/videos/thumbnails/user-id/timestamp-random.jpg"
}
```
