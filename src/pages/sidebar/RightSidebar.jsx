import React from "react";
import {useLocation} from "react-router-dom";
import RecentPosts from "./right/RecentPosts.jsx";
import AuthorInfo from "./right/AuthorInfo.jsx";

export default function RightSidebar() {
  const location = useLocation();

  // 사이드바 결정 로직
  const renderSidebar = () => {
    if (location.pathname.startsWith('/post/') && !location.pathname.endsWith('/update')) {
      return <AuthorInfo />;
    }
    if (location.pathname === '/') {
      return <RecentPosts />;
    }
    return <Block/>; // 오른쪽 사이드에 공간을 채움
  };

  return (
    <>
      {renderSidebar()}
    </>
  );
}

export const Block = () => {
  return (
    <div className="sticky top-14 z-10 w-72 p-4" />
  )
}

