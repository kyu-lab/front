import React from "react";
import {useLocation} from "react-router-dom";
import RightBlock from "./RightBlock.jsx";

export default function RightSidebar() {
  const location = useLocation();

  // 사이드바 결정 로직
  const renderSidebar = () => {
    return <RightBlock/>; // 왼쪽 사이드 공간 채우기
  };

  return (
    <div className="hidden lg:block">
      {renderSidebar()}
    </div>
  );
}
