import React from "react";
import {useLocation} from "react-router-dom";
import RecentPosts from "../right/RecentPosts.jsx";
import LeftBlock from "./LeftBlock.jsx";

export default function RightSidebar() {
  const location = useLocation();

  // 사이드바 결정 로직
  const renderSidebar = () => {
    if (location.pathname === '/') {
      return <RecentPosts />;
    }
    return <LeftBlock/>; // 왼쪽 사이드에 공간을 채움
  };

  return (
    <div className="hidden lg:block">
      {renderSidebar()}
    </>
  );
}


