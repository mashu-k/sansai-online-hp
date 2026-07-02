// LP計測の設定。シリーズ第2弾以降はここにエントリを追加すれば
// LP側のイベント送信・GA4同期・管理画面（LP解析）にそのまま反映される。
// eventPrefix はGA4のイベント名の先頭に付く（例: sd01_section_hero）。
export const LP_LIST = [
  {
    id: "sansai-delivery-01",
    eventPrefix: "sd01",
    title: "SANSAI Delivery Vol.01",
    path: "/sansai-delivery-01",
    thanksPath: "/sansai-delivery-01/thanks",
    // GA4集計の開始日（LP公開日以降）
    startDate: "2026-06-01",
    // ページ内の掲載順。到達率ファネルの並び順になる
    sections: [
      { id: "hero", label: "ヒーロー" },
      { id: "story", label: "コンセプト" },
      { id: "climber", label: "クライマー紹介" },
      { id: "process", label: "制作プロセス" },
      { id: "signature", label: "デザイン未定訴求" },
      { id: "set", label: "セット内容" },
      { id: "order", label: "商品仕様・予約" },
      { id: "faq", label: "FAQ" },
      { id: "final", label: "最終CTA" },
    ],
    ctas: [
      { id: "hero", label: "ヒーロー「予約する」" },
      { id: "sticky", label: "追従バー「予約する」" },
      { id: "final", label: "最終「予約して応援」" },
    ],
  },
];

export const getLp = (id) => LP_LIST.find((lp) => lp.id === id);
