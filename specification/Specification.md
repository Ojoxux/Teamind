## Teamind システム仕様書（簡略版）

### プロダクト概要

**Teamind** は、Teams 会議の録画内容を AI で解析し、効率的な学習・復習を支援するアプリケーションです。  
動画をアップロードすると、AI が自動で以下の処理を行います：

- **音声の文字起こし**
- **内容の要約生成**
- **インデックス（見出し）の自動生成**
- **キーワードの抽出**

---

### 1. ユーザー区分と権限

| ユーザー区分             | 権限                   |
| ------------------------ | ---------------------- |
| **管理者（教職員）**     | 動画管理、ユーザー管理 |
| **一般ユーザー（生徒）** | 動画閲覧、検索         |

---

### 2. 主要機能

#### **認証機能**

- ログイン/ログアウト

#### **動画管理機能**

- 動画アップロード（MP4, MOV, AVI）
- メタデータ設定（タイトル、カテゴリー等）

#### **AI 解析機能**

- 文字起こし
- 要約生成
- インデックス自動生成
- キーワード抽出

#### **動画視聴機能**

- 教科別動画一覧
- 文字起こしテキスト表示
- インデックスからのジャンプ
- 要約閲覧

---

### 3. 技術要件

#### **対応環境**

- **ブラウザ**: Chrome, Safari（最新版）
- **デバイス**: PC 必須、スマートフォン対応（PWA）

#### **UI 構成**

- **動画一覧画面**
- **動画再生画面**（動画プレーヤー + 文字起こし/インデックス）
- **検索機能**

---

### 4. MVP（最小実行製品）の範囲

- **動画アップロード**
- **AI による文字起こしと要約**
- **インデックス自動生成**
- **基本的な検索機能**
- **シンプルな UI**

---

### 5. 開発優先度

1. **動画アップロードと基本再生機能**
2. **AI 解析機能（文字起こし、要約）**
3. **インデックス生成と検索機能**
4. **UI/UX の改善**
5. **レスポンシブ対応**

### 6. 画面構成

#### 画面一覧
- **総画面数**: 5ページ

#### 共通コンポーネント: サイドバー
すべての画面で共通して左側に配置されるナビゲーション
- ロゴ (Teamind のロゴ ホーム画面へ遷移)
- Homeボタン (ホーム画面へ遷移)
- Uploadボタン (動画アップロード画面へ遷移)
- Dashboardボタン (ダッシュボード画面へ遷移)
- Settingsボタン (設定画面へ遷移)

#### 各画面詳細

##### Home画面
メインとなる動画一覧表示画面
- **ヘッダー**
  - 検索バー
  - フィルター機能 (教科選択 カテゴリ選択)
  - 表示切替（グリッド/リスト）
- **メインコンテンツ**
  - 動画カードグリッド表示
    - サムネイル
    - タイトル
    - 概要
    - アップロード日
  - ページネーション

##### Upload画面
動画のアップロードと設定を行う画面
- **アップロードエリア**
  - ドラッグ&ドロップゾーン
  - ファイル選択ボタン
  - アップロード進捗表示
- **メタデータ設定**
  - タイトル入力
  - 説明文入力
  - カテゴリー選択
  - タグ設定

##### Player画面
動画再生と学習支援機能を提供する画面
- **プレイヤーセクション**
  - 動画プレイヤー
  - 再生コントロール
- **コンテンツセクション**
  - インデックス（目次）
  - 文字起こしテキスト
  - 要約表示
  - キーワード表示
  - メモ機能

##### Dashboard画面
学習分析と進捗管理を行う画面
- **分析セクション**
  - 学習時間グラフ
    - 日次/週次/月次表示
    - 教科別学習時間
  - 視聴進捗状況
    - 完了率
    - 未視聴コンテンツ
  - 視聴履歴
    - 視聴日時
    - 視聴ページ
- **レポートセクション**
  - キーワード分析
    - 頻出キーワードクラウド
    - 理解度チェック
  - 学習ログ
    - 視聴履歴
    - メモ・ハイライト履歴

##### Settings画面
アプリケーション設定と個人設定を管理する画面
- **アカウント設定**
  - プロフィール編集
    - ユーザー名
    - プロフィール画像
    - メールアドレス
  - パスワード変更
- **アプリ設定**
  - 表示設定
    - 言語選択
    - ダークモード切替
    - フォントサイズ
  - 通知設定
    - メール通知
    - アプリ内通知
- **管理者専用設定**
  - ユーザー管理
  - カテゴリー管理
  - システム設定

#### レスポンシブ対応
- **デスクトップ** (1200px~)
  - サイドバー常時表示
  - 2カラムレイアウト
- **タブレット** (768px~1199px)
  - サイドバー収納可能
  - レイアウト最適化