import React from "react";
import MemberProfile from "@/components/pages/MemberProfile";

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
