# 提出ドキュメント

## チーム名 タンクお兄ちゃん

## チームメンバー

- 奥山
- 中村
- 吉田
- 内田
- 小野沢

## 開発したアプリ（サービス）名

- Teamind

## 開発したアプリの概要（エレベーターピッチ）

【Teams の授業録画を効率よく振り返り、確認・復習】したい【学生】向けの
【Teamind】というアプリは【AI 動画要約・タグ付けツール】です。
これは【録画データを自動で文字起こしし、AI 要約と文字起こし、インデックス（見出し）の自動生成する】ことができて、
【Otter.ai や Fireflies.ai、Microsoft Stream】とは違って【Teams の録画に特化し、タグごとに目次を作成して簡単に振り返れる機能と、AI による高度な要約・キーワード抽出】が備わっています

## 使用した技術

- **フロントエンド**

  - Next.js（React フレームワーク）
  - TypeScript（型付き言語）
  - Chakra UI（UI コンポーネントライブラリ）

- **ホスティング**
  　 -Vercel（Next.js のホスティングサービス）

## 今後導入予定の技術

- **AI/API**
  - Anthropic API（文字起こし・要約生成）
- **バックエンド**
  - Hono（軽量 Web フレームワーク）
  - TypeScript
  - Cloudflare Workers（サーバーレスプラットフォーム）
- **認証**
  - NextAuth.js（認証ライブラリ）
- **データベース**
  - Supabase（BaaS）
- **状態管理**
  - Jotai（React の状態管理ライブラリ）
- **CI/CD**
  - GitHub Actions（CI/CD ツール）

## どのように AI を活用したか

Cursor 内での AI を使ったコーディング支援を用いながら開発を行いました。
今後、AI を使って動画の文字起こしをし、その文を要約して、インデックス（見出し）の自動生成とキーワード抽出を行う予定です。これにより、ユーザーは必要な部分を素早く見つけて効率的に学習・復習ができるようになります。

<!-- T-小田賞に密接に関わります🥺 -->

## 機能面でアピールしたいこと

- Teams での録画見返しが見にくいと感じ録画した動画を AI に投げることで、その動画で何が起きているかわかるようにタグ付けをしてくれる Web アプリを開発中
- Microsoft Stream と違い、AI による高度な要約機能とキーワード抽出で重要ポイントを素早く把握できます
- 文字起こしと同時に要約も生成するため、内容を素早く把握できます
- インデックス（見出し）機能により、必要な部分に直接ジャンプできます
- キーワード抽出により、重要なポイントを見逃しません
- 教科別の動画一覧で整理されており、検索機能も実装予定です

## コーディング面でアピールしたいこと

- Next.js と TypeScript を使用した堅牢なフロントエンド設計
- Atomic Design パターンを採用したコンポーネント設計で保守性と再利用性を向上
- Anthropic API を活用した高精度な文字起こしと要約生成（実装予定）
- 効率的な動画処理パイプラインの実装
- レスポンシブデザインによる様々なデバイスへの対応

<!-- T-小田賞に密接に関わります🥺 -->

## その他アピールしたいこと

- 学習効率の向上に直接貢献するツール
- シンプルで使いやすい UI デザイン
- 将来的な拡張性（教師向け分析機能など）
