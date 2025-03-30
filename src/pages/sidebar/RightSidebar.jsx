import React from "react";
import {useLocation} from "react-router-dom";
import RecentPosts from "./right/RecentPosts.jsx";

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

export const AuthorInfo = () => {
  return (
    <aside className="sticky top-14 z-10 w-72 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-md p-4 mb-4">
        <div>
          <h2 className="text-sm font-medium mb-2">작성자 소개</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            안녕하세요
          </div>
        </div>
      </div>
    </aside>
  )
}
