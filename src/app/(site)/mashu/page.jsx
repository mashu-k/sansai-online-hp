import React from "react";
import MemberProfile from "@/components/pages/MemberProfile";

const MashuPage = () => {
  const memberData = {
    name: "川嵜 摩周",
    nameEng: "Mashu Kawasaki",
    image: "https://firebasestorage.googleapis.com/v0/b/sansaionlinehp.firebasestorage.app/o/members%2FIMG_5338.jpg?alt=media&token=e523a852-8e85-4e42-a4d4-a4f84a82ffdf",
    history: `北海道出身

2018
北海道札幌南高等学校卒業
大阪大学工学部応用自然学科入学辞退

2019
明治大学体育会山岳部入部
大学2年生から3年間主将を務める

2023
明治大学政治経済学部経済学科卒業
アルパインクライミングチーム『山菜採りオンライン』結成

2024
就職（エンジニア）
MILLET アンバサダー

主な受賞歴
第7回 モンベル フォトコンテスト 優秀賞

サポート
MILLET,EPIgas`,
    log: `
国内冬山
-戸隠山本院岳ダイレクト
-鹿島槍ヶ岳北壁中央ルンゼ〜荒沢奥壁ダイレクトルンゼ継続
-利尻山南稜
-米子不動(アナコンダ、阿修羅、夜叉、どぜうの詩、正露丸)
-甲斐駒ヶ岳赤石沢奥壁左ルンゼ
-谷川岳一ノ倉沢滝沢リッジ〜ドーム壁継続1Day

ネパール
-Anidesh Chuli北壁(6,960m) 6,600mまで
-7365m峰西壁 6,600mまで

パキスタン
-Rahman Zom西壁（6350m）初登攀
-Shiyko Zom北壁（5709m）初登頂`,
  };

  return <MemberProfile member={memberData} />;
};

export default MashuPage;
