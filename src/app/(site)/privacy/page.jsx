import React from "react";

export const metadata = {
  title: "プライバシーポリシー | SANSAI ONLINE",
  description: "SANSAI ONLINEのプライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
        <h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>
        <p className="text-sm text-muted-foreground mb-8">最終更新日: 2026年3月20日</p>

        <p>
          SANSAI ONLINE（以下「当サイト」）は、ユーザーの個人情報の保護を重要と考え、
          以下のとおりプライバシーポリシーを定めます。
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">1. 収集する情報</h2>
        <p>当サイトでは、コメント・いいね機能のご利用にあたり、以下の情報を収集します。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Googleアカウント経由のログイン:</strong> メールアドレス、Google表示名</li>
          <li><strong>メールリンク認証によるログイン:</strong> メールアドレス</li>
          <li><strong>ユーザーが設定する情報:</strong> ニックネーム、アイコン</li>
          <li><strong>投稿したコンテンツ:</strong> コメント内容</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">2. 情報の利用目的</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>ユーザーアカウントの管理・認証</li>
          <li>コメント・いいね機能の提供</li>
          <li>スパムや不正利用の防止</li>
          <li>サービスの改善・運営</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">3. 公開される情報</h2>
        <p>以下の情報のみが他のユーザーに公開されます。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>ユーザーが設定したニックネーム</li>
          <li>ユーザーが選択したアイコン</li>
          <li>投稿したコメントの内容</li>
        </ul>
        <p className="mt-2">
          <strong>メールアドレス、Google表示名、Googleプロフィール画像は他のユーザーに公開されません。</strong>
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">4. 情報の保管</h2>
        <p>
          収集した情報は Google Firebase（Google Cloud Platform）上に保管されます。
          非公開情報（メールアドレス等）はアクセス制限されたコレクションに保管し、
          本人以外がアクセスできない設計としています。
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">5. 第三者提供</h2>
        <p>
          当サイトは、法令に基づく場合を除き、ユーザーの個人情報を第三者に提供することはありません。
          ただし、サービスの提供にあたり以下のサービスを利用しています。
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Google Firebase（認証・データベース）</li>
          <li>Google Analytics（アクセス解析）</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">6. Cookieの使用</h2>
        <p>
          当サイトでは、Firebase Authenticationのセッション管理およびGoogle Analyticsのアクセス解析のためにCookieを使用しています。
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">7. データの削除</h2>
        <p>
          ユーザーはアカウントおよび関連データの削除を依頼することができます。
          削除をご希望の場合は、お問い合わせフォームよりご連絡ください。
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">8. お問い合わせ</h2>
        <p>
          プライバシーに関するお問い合わせは、
          <a href="/contact" className="text-accent hover:underline">お問い合わせページ</a>
          よりご連絡ください。
        </p>
      </div>
    </div>
  );
}
