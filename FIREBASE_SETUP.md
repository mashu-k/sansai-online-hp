# Firebase セットアップガイド

## 問題: 「記事がありません」と表示される

記事が表示されない場合、以下の原因が考えられます：

### 1. Firestoreセキュリティルールの設定

Firebaseコンソールで、読み取り・書き込み権限を設定する必要があります。

#### 手順:

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. プロジェクト「sansaionlinehp」を選択
3. 左メニューから「Firestore Database」を選択
4. 「ルール」タブをクリック
5. 以下のルールを設定：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 記事コレクションのルール
    match /posts/{postId} {
      // 誰でも公開記事を読み取り可能
      allow read: if true;
      // 認証済みユーザーのみ書き込み可能（後で認証を追加する場合）
      allow write: if true; // 本番環境では認証を追加してください
    }
  }
}
```

**注意**: `allow write: if true;` は開発中のみ使用してください。本番環境では認証を追加することを強く推奨します。

6. 「公開」ボタンをクリック

### 2. Firestoreインデックスの作成

`where` と `orderBy` を組み合わせたクエリには、複合インデックスが必要です。

#### 手順:

1. Firebase Console で「Firestore Database」→「インデックス」タブを開く
2. 以下のインデックスを作成：

**インデックス 1: status + createdAt**
- コレクションID: `posts`
- フィールド:
  - `status` (昇順)
  - `createdAt` (降順)

**インデックス 2: status + category**
- コレクションID: `posts`
- フィールド:
  - `status` (昇順)
  - `category` (昇順)

#### 自動的にインデックスを作成する方法:

1. ブラウザの開発者ツール（F12）でコンソールを開く
2. アプリケーションを操作する
3. エラーメッセージに表示されるリンクをクリック
4. 自動的にインデックスが作成されます（数分かかる場合があります）

例：
```
The query requires an index. You can create it here: https://console.firebase.google.com/...
```

### 3. Firebase Storageのルール設定

画像アップロードを有効にするため、Storageのルールも設定してください。

#### 手順:

1. Firebase Console で「Storage」を選択
2. 「ルール」タブをクリック
3. 以下のルールを設定：

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // posts と thumbnails フォルダへのアクセス
    match /posts/{allPaths=**} {
      allow read: if true;
      allow write: if true; // 本番環境では認証を追加してください
    }
    match /thumbnails/{allPaths=**} {
      allow read: if true;
      allow write: if true; // 本番環境では認証を追加してください
    }
  }
}
```

4. 「公開」ボタンをクリック

## デバッグ方法

### ブラウザのコンソールでエラーを確認:

1. F12キーを押して開発者ツールを開く
2. 「Console」タブを選択
3. エラーメッセージを確認:
   - `permission-denied`: セキュリティルールの問題
   - `failed-precondition`: インデックスが必要
   - `取得した記事数: 0`: データベースが空（記事を作成してください）

### 記事の作成方法:

1. `/admin/new` にアクセス
2. 記事の情報を入力:
   - タイトル
   - 概要
   - 本文（Markdownで記述可能）
   - カテゴリー
   - タグ
   - サムネイル画像
3. 「公開」ボタンをクリック
4. `/admin` で記事が表示されることを確認
5. `/blog` や `/` (ホーム) でも表示されることを確認

## よくある質問

### Q: 「保存に失敗しました: Missing or insufficient permissions」と表示される

A: Firestoreのセキュリティルールで書き込み権限が許可されていません。上記の「1. Firestoreセキュリティルールの設定」を確認してください。

### Q: 「The query requires an index」というエラーが出る

A: 複合インデックスが必要です。エラーメッセージに表示されるリンクをクリックして、自動的にインデックスを作成してください。

### Q: 画像のアップロードに失敗する

A: Firebase Storageのルールを確認してください。上記の「3. Firebase Storageのルール設定」を参照してください。

### Q: 記事を作成したのに表示されない

A: 以下を確認してください：
1. ステータスが「公開」になっているか（「下書き」は公開ページに表示されません）
2. ブラウザのコンソールにエラーが表示されていないか
3. ページをリロードしてみる

## 本番環境への移行

開発が完了したら、セキュリティルールを強化してください：

```javascript
// Firestoreルール（本番環境）
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true; // 誰でも読み取り可能
      allow create, update, delete: if request.auth != null; // 認証済みユーザーのみ
    }
  }
}

// Storageルール（本番環境）
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null; // 認証済みユーザーのみ
    }
    match /thumbnails/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null; // 認証済みユーザーのみ
    }
  }
}
```

認証機能を実装する場合は、Firebase Authenticationを使用してください。
