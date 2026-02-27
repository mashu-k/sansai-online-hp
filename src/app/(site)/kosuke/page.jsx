import React from "react";
import MemberProfile from "@/components/pages/MemberProfile";

export const metadata = {
  title: "河内 皓亮 (Kosuke Kawachi) - メンバー紹介",
  description:
    "山菜採りオンライン メンバー 河内皓亮。信州大学山岳部出身。",
};

const KosukePage = () => {
  const memberData = {
    name: "河内 皓亮",
    nameEng: "Kosuke Kawachi",
    university: "信州大学出身",
    image: "/img/member/kosuke.jpg",
    introduction: "信州大学山岳部出身。...",
  };

  return <MemberProfile member={memberData} />;
};

export default KosukePage;
