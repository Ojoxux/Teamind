# Teamind

Teams 会議の録画内容を AI で解析し、効率的な学習・復習を支援するアプリケーション

## 概要

Teamind は、Microsoft Teams などのオンライン会議ツールで録画された授業や会議の動画を自動的に解析し、学習・復習を効率化するアプリケーションです。以下の機能を提供します：

- 動画の文字起こし（トランスクリプト）
- 会議内容の要約
- 重要なキーポイントの抽出
- 関連キーワードの抽出
- 理解度を確認するための質問生成
- 動画内容に基づいた検索機能

これにより、長時間の授業や会議の内容を効率的に復習し、重要なポイントを素早く把握することができます。

## 主な機能

### 動画アップロードと解析

- Teams 会議の録画動画をアップロード
- AI による自動文字起こし
- 内容の要約と重要ポイントの抽出
- キーワード抽出と索引作成
- 理解度確認のための質問生成

### 動画検索と閲覧

- キーワードによる動画検索
- カテゴリー、長さ、キーワードによるフィルタリング
- 検索結果の一覧表示

### 動画学習支援

- 動画再生
- 文字起こし（トランスクリプト）表示
- チャプター表示とジャンプ機能
- 要約、キーポイント、キーワード、質問の表示
- 関連動画の推奨

### 学習管理

- 視聴履歴の管理
- 学習進捗の追跡
- 重要なポイントのブックマーク
- 個人メモの追加

## 技術スタック

- **フロントエンド**: Next.js 15.3.1(App Router), TypeScript 5.8.3, Chakra UI 2.10.7
- **バックエンド/API**: Supabase
- **AI/ML**: Whisper API, Anthropic API
- **データベース**: Supabase
- **ホスティング**: Vercel
- **コード品質**: Biome 1.9.4

## 開発環境のセットアップ

### 前提条件

- Node.js 18.x 以上
- npm または yarn

### インストール手順

1. リポジトリをクローン

   ```bash
   git clone https://github.com/Ojoxux/teamind.git
   cd teamind
   ```

2. 依存関係のインストール

   ```bash
   npm install
   # または
   yarn install
   ```

3. 開発サーバーの起動

   ```bash
   npm run dev
   # または
   yarn dev
   ```

4. ブラウザで http://localhost:3000 にアクセス

## 環境変数

### アプリケーションルート（.env）

アプリケーションのルートディレクトリに`.env`ファイルを作成し、以下の環境変数を設定してください：

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# AI/ML Services
OPENAI_API_KEY="your_openai_api_key"
ANTHROPIC_API_KEY="your_anthropic_api_key"
```

### エッジファンクション（/supabase/.env）

エッジファンクション用の環境変数は`/supabase`ディレクトリに`.env`ファイルを作成し、以下の環境変数を設定してください：

```
# Supabase (Edge Functions)
TEAMIND_SUPABASE_PROJECT_REF="your_supabase_project_ref"
TEAMIND_SUPABASE_URL="your_supabase_url"
TEAMIND_SUPABASE_ANON_KEY="your_supabase_anon_key"
TEAMIND_SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# Cloudinary
CLOUDINARY_URL="cloudinary://your_api_key:your_api_secret@your_cloud_name"
```