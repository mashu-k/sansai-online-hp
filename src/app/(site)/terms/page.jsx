import React from "react";

export const metadata = {
  title: "利用規約 | SANSAI ONLINE",
  description: "SANSAI ONLINEの利用規約",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
        <h1 className="text-3xl font-bold mb-8">利用規約</h1>
        <p className="text-sm text-muted-foreground mb-8">最終更新日: 2026年3月20日</p>

        <p>
          この利用規約（以下「本規約」）は、SANSAI ONLINE（以下「当サイト」）が提供するコメント・いいね機能（以下「本サービス」）の利用条件を定めるものです。
          本サービスをご利用いただくことにより、本規約に同意したものとみなします。
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">1. アカウント</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>本サービスの利用にはアカウント登録が必要です。</li>
          <li>ユーザーは正確な情報を提供し、アカウントの管理責任を負います。</li>
          <li>1人につき1つのアカウントを作成できます。</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">2. 禁止事項</h2>
        <p>以下の行為を禁止します。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>他のユーザーへの誹謗中傷、嫌がらせ</li>
          <li>スパム行為（同一内容の繰り返し投稿など）</li>
          <li>虚偽の情報の投稿</li>
          <li>他人のプライバシーを侵害する情報の投稿</li>
          <li>わいせつな内容、暴力的な内容の投稿</li>
          <li>法令に違反する行為</li>
          <li>当サイトの運営を妨害する行為</li>
          <li>他のユーザーになりすます行為</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">3. コメントについて</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>コメントの著作権は投稿者に帰属します。</li>
          <li>投稿者は、当サイトがコメントを表示・保存することを許諾するものとします。</li>
          <li>管理者は、本規約に違反するコメントを予告なく削除する権利を有します。</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">4. アカウントの停止</h2>
        <p>
          当サイトは、本規約に違反したユーザーのアカウントを予告なく停止（BAN）する権利を有します。
          アカウントが停止された場合、コメントの投稿やいいねができなくなります。
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">5. 免責事項</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>ユーザー間のトラブルについて、当サイトは責任を負いません。</li>
          <li>当サイトは、本サービスの中断・停止について責任を負いません。</li>
          <li>コメント内容の正確性について、当サイトは保証しません。</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">6. 規約の変更</h2>
        <p>
          当サイトは、必要に応じて本規約を変更することがあります。
          変更後の規約は、当サイト上に掲載した時点で効力を生じるものとします。
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">7. お問い合わせ</h2>
        <p>
          本規約に関するお問い合わせは、
          <a href="/contact" className="text-accent hover:underline">お問い合わせページ</a>
          よりご連絡ください。
        </p>
      </div>
    </div>
  );
}
