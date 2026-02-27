import React from "react";
import MemberProfile from "@/components/pages/MemberProfile";

export const metadata = {
  title: "橋本 哲 (Tetsu Hashimoto) - メンバー紹介",
  description:
    "山菜採りオンライン メンバー 橋本哲。東京農業大学出身。El Capitan The Nose登攀、パキスタン Rahman Zom西壁初登攀。",
};

const TetsuPage = () => {
  const memberData = {
    name: "橋本 哲",
    nameEng: "Tetsu Hashimoto",
    image:
      "https://firebasestorage.googleapis.com/v0/b/sansaionlinehp.firebasestorage.app/o/members%2FIMG_5384.JPG?alt=media&token=ede7b10f-3deb-410c-9362-b803192e18b5",
    history: `東京都出身

2019
東京農業大学入学

2022
G登攀クラブ入会

2023
東京農業大学　地域創成科学科卒業
アルパインクライミングチーム『山菜採りオンライン』結成

主な受賞歴
日本山岳耐久レース（長谷川恒雄CUP）世代別優勝`,
    log: `
国内冬山
-黒部横断
-剱岳小窓尾根
-鹿島槍ヶ岳北壁中央ルンゼ〜荒沢奥壁ダイレクトルンゼ継続
-利尻山南稜
-米子不動(アナコンダ、どぜうの詩、龍神、正露丸)
-甲斐駒ヶ岳赤石沢奥壁左ルンゼ
-谷川岳一ノ倉沢滝沢リッジ〜ドーム壁継続1Day

沢登り
-称名滝

フリークライミング
-奥多摩 低脂肪 5.13a
-瑞牆山 コスモス 5.13a/7P
-ローリングストーン5.12d
-エクセレントパワー 5.13a
etc

カナダ
-South Howser Tower becky-Chouinard
-Snowpatch SpireSunshine Crack

アメリカ
-Mr.Whitney East buttress
-El Capitan. The Nose
-El Capitan. Zodiac

パキスタン
-Rahman Zom西壁（6350m）初登攀
-Shiyko Zom北壁（5709m）初登頂`,
  };

  return <MemberProfile member={memberData} />;
};

export default TetsuPage;
