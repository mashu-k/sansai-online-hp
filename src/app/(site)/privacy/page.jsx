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
        <p className="text-sm text-muted-foreground mb-8">最終更新日: 2026年6月19日</p>

        <p>
          山菜採りオンライン（以下「当サイト」）は、以下の通り個人情報保護方針を定め、
          個人情報保護に取り組みます。
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">1. 個人情報保護方針</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>個人情報保護に関する法令、国が定める指針、その他の規範を遵守します。</li>
          <li>
            個人情報の利用目的を明示し、適切に個人情報の取得、利用および提供を行います。
            取得した個人情報は、法令で定める場合を除き、明示した利用目的の範囲内でのみ利用します。
          </li>
          <li>
            取得した個人情報は、法令で定める場合を除き、本人の同意なしに第三者への提供は行いません。
          </li>
          <li>
            個人情報保護に関して、組織的、物理的、人的、技術的に適切な対策を実施し、安全管理措置を行います。
          </li>
          <li>
            本人の求めによる個人情報の開示、訂正、追加、削除、もしくは利用目的の通知を法令に従い行うとともに、
            ご意見、ご相談に関して適切に対応します。
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">2. 個人情報の取扱い</h2>

        <h3 className="text-lg font-semibold mt-6 mb-3">2.1. 個人情報の管理について</h3>
        <p>
          当サイトは、お客様の個人情報を正確かつ最新の状態に保ち、個人情報への不正アクセス・紛失・破損・改ざん・漏洩などを防止するため、
          セキュリティの維持・管理体制の整備等の必要な措置を講じ、安全対策を実施し個人情報の厳重な管理を行います。
        </p>
        <p className="mt-2">
          収集した情報は Google Firebase（Google Cloud Platform）上に保管されます。
          非公開情報（メールアドレス等）はアクセス制限されたコレクションに保管し、本人以外がアクセスできない設計としています。
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">2.2. 個人情報の利用目的について</h3>
        <p>当サイトは、お客様からお預かりした個人情報を、以下の目的に限り利用いたします。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>商品の梱包・発送業務</li>
          <li>ご注文内容の確認・課金計算・料金請求</li>
          <li>ユーザーアカウントの管理・認証</li>
          <li>コメント・いいね機能の提供</li>
          <li>スパムや不正利用の防止</li>
          <li>各種お問い合わせ、アフターサービス対応</li>
          <li>本ウェブサイトの運営上必要な事項の通知（電子メールによるものを含む）</li>
          <li>マーケティングデータの調査・分析、サービスの改善および新たなサービスの開発</li>
          <li>契約や法律等に基づく権利の行使や義務の履行</li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-3">2.3. 収集する個人情報について</h3>
        <p>当サイトでは、以下の情報を収集します。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Googleアカウント経由のログイン:</strong> メールアドレス、Google表示名</li>
          <li><strong>メールリンク認証によるログイン:</strong> メールアドレス</li>
          <li><strong>ユーザーが設定する情報:</strong> ニックネーム、アイコン</li>
          <li><strong>投稿したコンテンツ:</strong> コメント内容</li>
          <li>
            <strong>商品購入に関する情報:</strong> ご注文内容、お届け先の氏名・住所・連絡先など
          </li>
        </ul>
        <p className="mt-2 text-sm text-muted-foreground">
          ※クレジットカード情報は決済代行サービス（Stripe）にて処理され、当サイトでは保持しません。
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">2.4. 公開される情報について</h3>
        <p>以下の情報のみが他のユーザーに公開されます。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>ユーザーが設定したニックネーム</li>
          <li>ユーザーが選択したアイコン</li>
          <li>投稿したコメントの内容</li>
        </ul>
        <p className="mt-2">
          <strong>メールアドレス、Google表示名、Googleプロフィール画像、商品購入に関する情報は他のユーザーに公開されません。</strong>
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">2.5. 個人情報の第三者提供について</h3>
        <p>
          当サイトは、法令に基づく場合を除き、本人の同意なしにユーザーの個人情報を第三者に提供することはありません。
          ただし、サービスの提供にあたり以下のサービスを利用しています。
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Google Firebase（認証・データベース）</li>
          <li>Google Analytics（アクセス解析）</li>
          <li>Stripe（決済処理）</li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-3">2.6. Cookieの使用について</h3>
        <p>
          当サイトでは、Firebase Authenticationのセッション管理およびGoogle Analyticsのアクセス解析のためにCookieを使用しています。
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">2.7. 個人情報の開示・訂正・削除について</h3>
        <p>
          当サイトは、本人の求めに応じて、個人情報の開示、訂正、追加、削除、もしくは利用目的の通知を法令に従い行います。
          アカウントおよび関連データの削除をご希望の場合は、お問い合わせフォームよりご連絡ください。
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">3. 事業者情報・お問い合わせ窓口</h2>
        <p>個人情報の取扱いに関するお問い合わせ・ご相談は、下記までご連絡ください。</p>
        <ul className="list-none pl-0 space-y-1">
          <li><strong>事業者名:</strong> 山菜採りオンライン</li>
          <li><strong>代表者:</strong> 橋本 哲</li>
          <li>
            <strong>所在地:</strong> 〒107-0061 東京都港区北青山1-3-3 三橋ビル 3階（バーチャルオフィス）
          </li>
          <li>
            <strong>メール:</strong>{" "}
            <a href="mailto:sansaitorionline@gmail.com" className="text-accent hover:underline">
              sansaitorionline@gmail.com
            </a>
          </li>
        </ul>
        <p className="mt-2">
          プライバシーに関するお問い合わせは、
          <a href="/contact" className="text-accent hover:underline">お問い合わせページ</a>
          よりご連絡いただくこともできます。
        </p>
      </div>
    </div>
  );
}
