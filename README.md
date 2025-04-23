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

## 開発ワークフロー

### ブランチ戦略

- `main`: 本番環境用のリリースブランチ。直接コミットは禁止。
- `feature/[機能名]`: 新機能の開発用ブランチ。`main`から分岐し、完了後`main`にマージ。
- `fix/[バグ内容]`: バグ修正用ブランチ。`main`から分岐。
- `chore/[タスク内容]`: ビルドプロセスやツール、依存関係の変更。
- `test/[テスト内容]`: テストの追加・修正。
- `refactor/[リファクタ内容]`: コードリファクタリング。
- `style/[スタイル変更]`: コードスタイルの変更。

### ブランチ命名規則

- 小文字、ハイフン、アンダースコアを使用（例: `feature/#xx_add-search-function`）
- 機能やタスクを簡潔に表現する文章をケバブケースで記述
- Issue と関連付ける場合は、Issue 番号を含める（例: `feature/#[Issue番号]_hoge-hoge`）

### コミットメッセージのルール

```
feat: 変更内容の要約（50文字以内）
```

タイプ:

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響を与えない変更（空白、フォーマット、セミコロンの欠落など）
- `refactor`: バグ修正や機能追加ではないコード変更
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツール、依存関係の変更

例:

```
feat: ユーザー認証機能の実装
fix: ログイン画面のバリデーションエラーを修正
docs: READMEにデプロイ手順を追加
```

### Issues 管理

- 新機能、バグ修正、改善などはすべて Issue として登録
- Issue には適切なラベルを付ける（`enhancement`, `bug`, `documentation`など）
- Issue には担当者、期限、関連するマイルストーンを設定
- 作業開始時に Issue を自分にアサインし、ブランチを作成

### プルリクエスト（PR）のルール

- PR のタイトルは変更内容を簡潔に表現
- PR 説明には以下を含める:
  - 変更内容の詳細
  - 関連する Issue 番号（`Closes #123`の形式）
  - テスト方法
  - スクリーンショット（UI 変更がある場合）
- コードレビュー後、承認されたらマージ

## コーディング規約

- Biome の設定に従う
- コンポーネントはアトミックデザインの原則に基づいて構成
- TypeScript の型定義を適切に行う

## デプロイ

[デプロイ方法の説明]

## コントリビューション

1. このリポジトリをクローン
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成
