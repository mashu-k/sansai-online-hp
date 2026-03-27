# コメント・いいね機能 実装方針書

## 概要

ブログ記事にコメント機能といいねボタンを追加する。
認証はGoogle認証 + メールリンク認証の2本立て。
ユーザーのプライバシーを保護しつつ、低摩擦でアカウント作成できる設計とする。

---

## 1. 認証設計

### 1.1 認証方式

| 方式 | 用途 | 備考 |
|------|------|------|
| **Google OAuth** | メインのログイン手段 | 既存のAuthContext.jsxを拡張 |
| **メールリンク認証（パスワードレス）** | Googleアカウントを持たないユーザー向け | Firebase Auth標準機能 |

### 1.2 ユーザーフロー

```
① ユーザーが「コメントする」or「いいね」ボタンを押す
② 未ログインの場合 → ログインモーダルを表示
   ┌──────────────────────────────────┐
   │  SANSAI ONLINE にログイン          │
   │                                    │
   │  [🔵 Googleでログイン]              │
   │                                    │
   │  ── または ──                       │
   │                                    │
   │  メールアドレス: [              ]    │
   │  [📧 ログインリンクを送信]           │
   └──────────────────────────────────┘
③ 初回ログイン時 → プロフィール設定モーダル
   ┌──────────────────────────────────┐
   │  プロフィール設定                   │
   │                                    │
   │  ニックネーム: [              ]     │
   │  アイコン: (プリセットから選択)      │
   │  ☑ 利用規約・プライバシーポリシーに同意 │
   │  [アカウント作成]                   │
   └──────────────────────────────────┘
④ 以降はログイン済み状態で即操作可能
```

### 1.3 AuthContext.jsx の拡張

既存の `src/contexts/AuthContext.jsx` に以下を追加：

- `signInWithEmailLink(email)` — メールリンク送信
- `completeEmailLinkSignIn(email, url)` — メールリンクからの復帰時にサインイン完了
- `userProfile` — Firestoreから取得した公開プロフィール（nickname, avatar）
- `isProfileComplete` — 初回プロフィール設定が完了しているか
- ログイン後に `users/{uid}` ドキュメントの存在チェック → なければプロフィール設定に誘導

---

## 2. Firestore データ設計

### 2.1 users コレクション（公開プロフィール）

```
users/{uid}
├── nickname: string          ← 公開表示名（必須、2〜20文字）
├── avatar: string            ← プリセットアイコンID（例: "kinoko", "warabi", "taranome"）
├── createdAt: Timestamp
├── role: "user" | "admin"    ← 管理者判定用
└── isBanned: boolean         ← 管理者がBAN可能（デフォルト: false）
```

### 2.2 users/{uid}/private コレクション（非公開情報）

```
users/{uid}/private/profile
├── email: string             ← メールアドレス
├── googleDisplayName: string ← Google表示名（Google認証の場合）
├── googlePhotoURL: string    ← Googleアイコン（Google認証の場合）
├── authProvider: "google" | "emailLink"
└── lastLoginAt: Timestamp
```

**重要**: emailや実名は `private` サブコレクションに隔離し、公開コレクションには絶対に入れない。

### 2.3 posts コレクション（既存を拡張）

```
posts/{postId}
├── (既存フィールドはそのまま)
├── likeCount: number         ← いいね数の集計値（リアルタイム表示用）
└── commentCount: number      ← コメント数の集計値
```

### 2.4 likes サブコレクション

```
posts/{postId}/likes/{uid}
└── createdAt: Timestamp
```

- ドキュメントIDをUIDにすることで**1ユーザー1いいね**を構造的に保証
- いいね取り消し = ドキュメント削除

### 2.5 comments サブコレクション

```
posts/{postId}/comments/{commentId}
├── uid: string               ← 投稿者のUID
├── nickname: string          ← 投稿時のニックネーム（表示用にコピー）
├── avatar: string            ← 投稿時のアイコン
├── content: string           ← コメント本文（最大500文字）
├── createdAt: Timestamp
├── isDeleted: boolean        ← 論理削除フラグ（デフォルト: false）
└── deletedBy: string | null  ← 削除した人（"self" | "admin"）
```

---

## 3. Firestoreセキュリティルール

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // === 公開プロフィール ===
    match /users/{uid} {
      // 誰でもニックネームとアイコンを読める
      allow read: if true;

      // 本人のみ作成可能（必須フィールドのバリデーション付き）
      allow create: if request.auth != null
                    && request.auth.uid == uid
                    && request.resource.data.keys().hasAll(['nickname', 'avatar', 'createdAt', 'role'])
                    && request.resource.data.nickname is string
                    && request.resource.data.nickname.size() >= 2
                    && request.resource.data.nickname.size() <= 20
                    && request.resource.data.role == 'user'
                    && !('email' in request.resource.data)
                    && !('googleDisplayName' in request.resource.data);

      // 本人のみ nickname, avatar を更新可能
      allow update: if request.auth != null
                    && request.auth.uid == uid
                    && !('role' in request.resource.data.diff(resource.data))
                    && !('isBanned' in request.resource.data.diff(resource.data))
                    && !('email' in request.resource.data)
                    && !('googleDisplayName' in request.resource.data);
    }

    // === 非公開プロフィール ===
    match /users/{uid}/private/{doc} {
      // 本人のみ読み書き可能
      allow read, write: if request.auth != null
                         && request.auth.uid == uid;
    }

    // === いいね ===
    match /posts/{postId}/likes/{likeUid} {
      allow read: if true;
      // 本人のみ作成・削除可能（BANされていないこと）
      allow create: if request.auth != null
                    && request.auth.uid == likeUid
                    && !get(/databases/$(database)/documents/users/$(request.auth.uid)).data.get('isBanned', false);
      allow delete: if request.auth != null
                    && request.auth.uid == likeUid;
    }

    // === コメント ===
    match /posts/{postId}/comments/{commentId} {
      allow read: if true;

      // ログイン済み＋BANされていないユーザーが投稿可能
      allow create: if request.auth != null
                    && request.resource.data.uid == request.auth.uid
                    && request.resource.data.content is string
                    && request.resource.data.content.size() >= 1
                    && request.resource.data.content.size() <= 500
                    && request.resource.data.isDeleted == false
                    && !get(/databases/$(database)/documents/users/$(request.auth.uid)).data.get('isBanned', false);

      // 論理削除: 本人またはadminのみ
      allow update: if request.auth != null
                    && (
                      resource.data.uid == request.auth.uid
                      || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
                    )
                    && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['isDeleted', 'deletedBy']);
    }

    // === 投稿（既存ルールを維持、likeCount/commentCountの更新を追加） ===
    match /posts/{postId} {
      allow read: if true;
      // likeCount, commentCountの更新はCloud Functionsで行うため
      // クライアントからの直接更新は禁止
    }
  }
}
```

---

## 4. 実装ファイル一覧

### 4.1 新規作成ファイル

| ファイル | 役割 |
|---------|------|
| `src/components/blog/CommentSection.jsx` | コメント一覧表示 + 投稿フォーム |
| `src/components/blog/LikeButton.jsx` | いいねボタン（トグル式） |
| `src/components/auth/LoginModal.jsx` | ログインモーダル（Google + メールリンク） |
| `src/components/auth/ProfileSetupModal.jsx` | 初回ニックネーム・アイコン設定モーダル |
| `src/components/auth/UserMenu.jsx` | ログイン済みユーザーのメニュー（ニックネーム表示、ログアウト） |
| `src/lib/avatar-presets.js` | プリセットアイコン定義（山菜テーマ） |
| `src/app/(site)/privacy/page.jsx` | プライバシーポリシーページ |
| `src/app/(site)/terms/page.jsx` | 利用規約ページ |

### 4.2 修正ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/contexts/AuthContext.jsx` | メールリンク認証追加、userProfile管理追加 |
| `src/components/pages/BlogPost.jsx` | 記事下にCommentSectionとLikeButtonを配置 |
| `src/components/pages/Admin.jsx` | コメント管理機能（BAN、コメント削除） |

---

## 5. いいね機能の詳細設計

### 5.1 動作仕様

- ログイン済みユーザーがボタンを押すといいねON/OFF
- 未ログイン時はログインモーダルを表示
- いいね数はリアルタイム表示（Firestoreリスナー or 楽観的UI更新）
- **楽観的UI更新**: ボタン押下時に即座にUIを更新し、バックグラウンドでFirestore操作

### 5.2 likeCount の整合性

`posts/{postId}.likeCount` は以下のいずれかで管理：

**方式A: クライアント側 increment（シンプル）**
```javascript
// いいね追加時
await setDoc(doc(db, 'posts', postId, 'likes', uid), { createdAt: serverTimestamp() });
await updateDoc(doc(db, 'posts', postId), { likeCount: increment(1) });

// いいね取り消し時
await deleteDoc(doc(db, 'posts', postId, 'likes', uid));
await updateDoc(doc(db, 'posts', postId), { likeCount: increment(-1) });
```

**方式B: Cloud Functions（厳密）**
- likes サブコレクションの onCreate/onDelete トリガーで likeCount を自動更新
- 不整合が起きない

→ **方式Aで開始し、不整合が問題になれば方式Bに移行**する。
  posts のセキュリティルールで likeCount, commentCount の更新を
  認証済みユーザーに限定すれば、方式Aでも十分安全。

---

## 6. コメント機能の詳細設計

### 6.1 動作仕様

- 記事下にコメント一覧を表示（新しい順）
- ログイン済みユーザーのみ投稿可能
- 最大500文字
- 本人は自分のコメントを削除可能
- 管理者は任意のコメントを削除可能
- 削除は論理削除（「このコメントは削除されました」と表示）
- XSS対策: コメントはテキストのみ、HTMLレンダリングしない

### 6.2 commentCount の管理

likeCount と同様、クライアント側 increment で管理。

### 6.3 スパム対策

- Google認証 or メールリンク認証必須（匿名投稿不可）
- 連続投稿の制限（フロントエンドで投稿後10秒間はボタン無効化）
- 管理者によるBAN機能
- コメント文字数制限（500文字）

---

## 7. プリセットアイコン

山菜・自然テーマのアイコンをプリセットとして用意：

```javascript
// src/lib/avatar-presets.js
export const avatarPresets = [
  { id: "warabi",    label: "わらび",       emoji: "🌿" },
  { id: "kinoko",    label: "きのこ",       emoji: "🍄" },
  { id: "taranome",  label: "たらの芽",     emoji: "🌱" },
  { id: "yama",      label: "山",          emoji: "🏔️" },
  { id: "ki",        label: "木",          emoji: "🌲" },
  { id: "sakura",    label: "桜",          emoji: "🌸" },
  { id: "momiji",    label: "もみじ",       emoji: "🍁" },
  { id: "donguri",   label: "どんぐり",     emoji: "🌰" },
  { id: "kuma",      label: "くま",         emoji: "🐻" },
  { id: "usagi",     label: "うさぎ",       emoji: "🐰" },
  { id: "tori",      label: "鳥",          emoji: "🐦" },
  { id: "kaeru",     label: "かえる",       emoji: "🐸" },
];
```

---

## 8. プライバシー・法的対応

### 8.1 プライバシーポリシーに記載する事項

1. **収集する情報**: Googleアカウント情報（メール、表示名）またはメールアドレス
2. **利用目的**: アカウント管理、スパム防止、不正利用対策のみ
3. **公開される情報**: ユーザーが設定したニックネームとアイコンのみ
4. **非公開情報**: メールアドレス、実名は他のユーザーに公開されない
5. **第三者提供**: 行わない（Firebase/Google Cloudの利用は明記）
6. **データ保持**: アカウント削除依頼により削除可能
7. **Cookie**: Firebase Authのセッション管理に使用

### 8.2 利用規約に記載する事項

1. 誹謗中傷・スパムの禁止
2. 管理者による削除・BANの権限
3. コメントの著作権
4. 免責事項

---

## 9. 実装順序

### Phase 1: 基盤（認証とデータ構造）
1. Firestoreセキュリティルール設定
2. AuthContext.jsx拡張（メールリンク認証追加、userProfile管理）
3. LoginModal.jsx 作成
4. ProfileSetupModal.jsx 作成
5. avatar-presets.js 作成

### Phase 2: いいね機能
1. LikeButton.jsx 作成
2. BlogPost.jsx にいいねボタン配置
3. 動作確認・テスト

### Phase 3: コメント機能
1. CommentSection.jsx 作成
2. BlogPost.jsx にコメントセクション配置
3. 動作確認・テスト

### Phase 4: 管理機能
1. Admin.jsx にコメント管理・ユーザーBAN機能追加
2. UserMenu.jsx 作成（ヘッダーにログイン状態表示）

### Phase 5: 法的ページ
1. プライバシーポリシーページ作成
2. 利用規約ページ作成
3. フッターにリンク追加

---

## 10. 技術的注意事項

- Firebase Authのメールリンク認証は `actionCodeSettings` に正しいURLを設定すること
- メールリンク認証のリダイレクト先でサインイン完了処理が必要（URLからemailを復元する）
- `likeCount` / `commentCount` を更新する際は `increment()` を使い、race conditionを防ぐ
- コメント表示時は `isDeleted === true` のものを「削除済み」として表示する
- プリセットアイコンはemoji文字列で保存し、画像ファイル管理を不要にする
- BANされたユーザーのコメント投稿をセキュリティルールレベルでブロックする
