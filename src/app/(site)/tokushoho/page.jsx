import React from "react";

export const metadata = {
  title: "特定商取引法に基づく表記 | SANSAI ONLINE",
  description: "SANSAI ONLINEの特定商取引法に基づく表記",
};

const rows = [
  {
    label: "事業者名",
    content: <>山菜採りオンライン</>,
  },
  {
    label: "代表者",
    content: <>橋本 哲</>,
  },
  {
    label: "所在地",
    content: (
      <>
        〒107-0061
        <br />
        東京都港区北青山1-3-3 三橋ビル 3階
      </>
    ),
  },
  {
    label: "お問い合わせ先",
    content: (
      <>
        メール：
        <a href="mailto:sansaitorionline@gmail.com" className="text-accent hover:underline">
          sansaitorionline@gmail.com
        </a>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
          <li>お問い合わせはメールにてお受け付けしております</li>
          <li>電話番号はご請求があった場合に遅滞なく開示いたします</li>
        </ul>
      </>
    ),
  },
  {
    label: "商品等の販売価格",
    content: <>各商品ページに税込金額を記載</>,
  },
  {
    label: "送料などの商品代金以外の付帯費用",
    content: <>各商品ページに記載の内容に準じます</>,
  },
  {
    label: "代金の支払時期及び方法",
    content: (
      <>
        お支払時期：注文時に即時決済
        <br />
        お支払方法：クレジットカード（Stripe）
      </>
    ),
  },
  {
    label: "商品等の引き渡し時期",
    content: (
      <>
        各商品ページに記載の内容に準じます
        <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
          <li>商品により異なります。詳細は各商品ページをご確認ください</li>
        </ul>
      </>
    ),
  },
  {
    label: "返品・キャンセル等",
    content: (
      <>
        注文確定後のキャンセル・返品・交換はお受けできません。
        商品に不備があった場合は対応いたします。
      </>
    ),
  },
  {
    label: "その他",
    content: (
      <ul className="list-disc pl-6 space-y-1">
        <li>
          本サイトの住所はバーチャルオフィスを利用しています。消費者からの請求があった場合は遅滞なく開示いたします
        </li>
        <li>販売する商品・サービスの詳細は各商品ページをご確認ください</li>
        <li>日本国内への販売に限ります</li>
      </ul>
    ),
  },
];

export default function TokushohoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">特定商取引法に基づく表記</h1>

        <dl className="border-t border-border/50">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex flex-col sm:flex-row gap-2 sm:gap-6 py-5 border-b border-border/50"
            >
              <dt className="sm:w-56 flex-shrink-0 font-semibold">{row.label}</dt>
              <dd className="flex-1 text-muted-foreground leading-relaxed">{row.content}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
