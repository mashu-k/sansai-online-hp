import React from "react";
import MemberProfile from "@/components/pages/MemberProfile";

const TetsuPage = () => {
  const memberData = {
    name: "橋本 哲",
    nameEng: "Tetsu Hashimoto",
    university: "東京農大出身",
    image: "/img/member/tetsu.jpg",
    introduction: "東京農大山岳部出身。...",
  };

  return <MemberProfile member={memberData} />;
};

export default TetsuPage;
