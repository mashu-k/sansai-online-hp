# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

アルパインクライミングチーム「山菜採りオンライン（SANSAI ONLINE）」の公式サイト。Next.js 15 (App Router) + React 19 + Firebase。ブログ、メンバー紹介、ギャラリー、お問い合わせ、および管理者向けダッシュボード（記事管理・コメント管理・アクセス解析・ユーザー管理）を持つ。

## コマンド

パッケージマネージャは **pnpm**（`packageManager` 固定）。

```bash
pnpm dev      # 開発サーバー（next dev）
pnpm build    # 本番ビルド
pnpm start    # 本番サーバー
pnpm lint     # ESLint（eslint .）
```

テストランナーは未導入（`test` スクリプトなし）。

## 言語・記述スタイル

- ソースは **JSX/JS（.jsx, .js）** で記述。TypeScript設定は存在するが `allowJs: true` / `strict: false` で、実コードは JS。新規ファイルも既存に合わせて JSX を使う。
- UI文言・コメント・コミットメッセージはすべて日本語。
- import エイリアス `@/*` → `src/*`。

## アーキテクチャ

### ページとコンポーネントの分離パターン（重要）

App Router の `page.jsx` は薄いラッパーに徹し、実装は `src/components/pages/*.jsx` のクライアントコンポーネントに置く。
- 例: `src/app/(site)/blog/page.jsx` は metadata（SEO）を定義し `<Blog />`（`components/pages/Blog.jsx`）を `<Suspense>` で描画するだけ。
- 全ページは `(site)` ルートグループ配下。ルートレイアウト `src/app/layout.jsx` が `AuthProvider` → `ThemeProvider` → `Navigation` / `Footer` を提供し、Noto Sans/Serif JP フォントと GA を読み込む。

### 認証（src/contexts/AuthContext.jsx）

- Firebase Auth。`useAuth()` フックで `user` / `userProfile` / 各種メソッドにアクセス。
- ログイン方式は **Googleログイン**（デスクトップ=popup、モバイル=redirect で自動分岐）と **メールリンク認証**。
- Firebase の各モジュールは **動的 import** で遅延ロードし、初期化自体も `requestIdleCallback` で後回しにして初期表示を優先している。この遅延ロード方針を踏襲すること。
- ユーザーには公開プロフィール（`users/{uid}`）と非公開プロフィール（`users/{uid}/private/profile`）の2層がある。
- 管理者判定は **メールアドレスのホワイトリスト**（`src/lib/admin-config.js` の `ADMIN_EMAILS`）。管理者は初回ログイン時に `role: "admin"` のプロフィールが自動生成される。

### 管理画面（src/app/(site)/admin/）

- `admin/layout.jsx` がクライアント側でガードを行う：未ログインは `/login` へ、`ADMIN_EMAILS` 非該当はアクセス拒否画面を表示。
- 記事の作成・編集の正規ルートは **`/admin/posts/new`** と **`/admin/posts/edit/[id]`**（実装は `components/pages/AdminEdit.jsx`）。`/admin/new`・`/admin/edit/[id]` は旧ルートで、`router.replace` で正規ルートへリダイレクトするだけのスタブ。新規実装は正規ルート側に。

### データモデル（Firestore）

- `posts/{postId}` — ブログ記事。`status`（`"published"` 等）、`title`、`category`（**日本語名で保存**）、`createdAt`、`likeCount`、`commentCount`。公開記事は `where("status", "==", "published")` で絞る。
- `posts/{postId}/likes/{uid}` — いいね（1ユーザー1ドキュメント）。
- `posts/{postId}/comments/{commentId}` — コメント。`parentId` が `null` でトップレベル、string で返信。論理削除は `isDeleted` フラグ。
- `users/{uid}` — 公開プロフィール（`nickname`, `avatar`, `role`, `isBanned`）。`users/{uid}/private/{doc}` — 非公開情報。
- `analytics/{docId}` — GA4 同期データ。

カテゴリは `src/lib/categories.js` でスラッグ ↔ 日本語名を変換（`toSlug` / `toJaName`）。**Firestore上は日本語名**、URL等ではスラッグを使う。

### Firestore セキュリティルール（firestore.rules）

権限ロジックの本体はルール側にある。実装時は必ず整合を確認すること。要点：
- 一般ユーザーが `posts` で更新できるのは `likeCount`, `commentCount` のみ。記事本体の CRUD は管理者（`role == 'admin'`）のみ。
- `role` / `isBanned` はユーザー自身では変更不可（管理者のみ `isBanned` 変更可）。
- BAN されたユーザー（`isBanned == true`）はいいね・コメント作成不可。
- 変更時は `firestore.rules` をデプロイする必要がある（`firebase deploy --only firestore:rules`）。

### Firebase の2系統

- **クライアントSDK**: `src/lib/firebase.js`（`db`, `storage`）。設定は `src/lib/firebase-config.js`（公開APIキー）。
- **Admin SDK**: `src/lib/firebase-admin.js`（`getAdminDb()`）。サーバー専用、サービスアカウント認証情報を環境変数から読む。API route 内でのみ使用。

### API Routes（src/app/api/）

- `api/send-mail` — お問い合わせフォーム。nodemailer + Gmail でチーム宛に送信（**実装済み・実稼働**）。
- `api/analytics/sync` — GA4 (`@google-analytics/data`) からアクセスデータを取得し Firestore の `analytics` に同期（GET=読み取り、POST=同期）。Admin SDK 使用。
- `api/posts`, `api/posts/[id]` — **現状モック実装**（空配列やステータスコードを返すだけ）。ブログの実データ読み書きはクライアントから直接 Firestore に対して行っている。ここを実装する場合は既存のクライアント側ロジックとの整合に注意。

### ログ

`console.*` を直接使わず `src/lib/logger.js` の `logger`（`warn`/`error`/`info`）を使う。本番（`NODE_ENV === "production"`）では出力を抑制する。

## UI / スタイリング

- **Tailwind CSS v4** + **shadcn/ui**（`components.json`、`src/components/ui/`）+ Radix UI。
- アイコンは `lucide-react`、アニメーションは `framer-motion`、グラフは `recharts`。
- ダークモード対応（`next-themes` / `ThemeProvider`）。色は `bg-background`, `text-foreground`, `text-accent` 等の **セマンティックトークン**を使う。
- 画像最適化: `next.config.js` で Firebase Storage (`firebasestorage.googleapis.com`) を `remotePatterns` に許可済み。

## 環境変数（.env.local）

サーバー専用（API route / Admin SDK）。`.env.local` は gitignore 済み。

- `FIREBASE_PROJECT_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY` — Firebase Admin SDK のサービスアカウント。
- `GA4_PROPERTY_ID` — GA4 アクセス解析。
- `GMAIL_USER`, `GMAIL_PASS` — お問い合わせメール送信（Gmailアプリパスワード）。

クライアント側 Firebase 設定は公開値のため `firebase-config.js` にハードコードされている。

詳細は `FIREBASE_SETUP.md` を参照。

## GitHub Issue / 自動化

`.github/workflows/issue-auto-label.yml` が Issue 本文をパースして自動ラベル付けする（優先度・発生環境・「Claude 自動着手OK」チェックボックス）。Issue テンプレートは `.github/ISSUE_TEMPLATE/` にある。
