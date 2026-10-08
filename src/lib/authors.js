// 記事の著者（チームメンバー）定義
// Firestore の post.authorId にはここの id を保存する。未選択は "" で、その場合は読者ページに著者を表示しない。
export const AUTHORS = [
  {
    id: "mashu",
    name: "川崎摩周",
    nameEng: "Mashu Kawasaki",
    image: "/img/member/mashu.jpg",
    link: "/mashu",
  },
  {
    id: "tetsu",
    name: "橋本哲",
    nameEng: "Tetsu Hashimoto",
    image: "/img/member/tetsu.jpg",
    link: "/tetsu",
  },
  {
    id: "kosuke",
    name: "河内皓亮",
    nameEng: "Kosuke Kawachi",
    image: "/img/member/kosuke.jpg",
    link: "/kosuke",
  },
];

// authorId から著者を引く。未選択・不明な id は null
export const getAuthor = (authorId) =>
  AUTHORS.find((a) => a.id === authorId) || null;
