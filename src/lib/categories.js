// カテゴリースラッグ ↔ 日本語名マッピング
// Firestoreのpost.categoryは日本語名で保存されている
export const CATEGORIES = {
  overseas: "海外遠征",
  winter: "冬山",
  ski: "スキー",
  climbing: "フリークライミング",
  gear: "ギアレビュー",
  other: "その他",
};

// 日本語名 → スラッグ
const nameToSlug = Object.fromEntries(
  Object.entries(CATEGORIES).map(([slug, name]) => [name, slug])
);

export const toSlug = (jaName) => nameToSlug[jaName] || jaName;
export const toJaName = (slug) => CATEGORIES[slug] || slug;
