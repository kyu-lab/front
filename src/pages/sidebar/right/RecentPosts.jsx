import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

export default function RecentPosts() {
  const [list, setList] = useState(() => {
    return JSON.parse(sessionStorage.getItem('recentPosts')) || [];
  });

  useEffect(() => {
    sessionStorage.setItem('recentPosts', JSON.stringify(list));
  }, [list]);

  // 전체 포스트 삭제 핸들러 (휴지통 버튼)
  const handleDeleteAllRecentPost = () => {
    setList([]);
  };

  // 개별 포스트 삭제 핸들러 (Clear 버튼)
  const handleDeleteRecentPost = (index) => {
    setList((prevList) => prevList.filter((_, i) => i !== index));
  };

  // 없을 경우
  if (list.length === 0) {
    return (
      <div className="sticky top-14 z-10 w-72 p-4" />
    );
  }

  return (
    <aside className="sticky top-14 z-10 w-72 p-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-blue-500 dark:text-blue-400 uppercase font-bold text-sm">
            Recent Post
          </span>
          <div>
            <button onClick={handleDeleteAllRecentPost}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <path
                  fillRule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 포스트 목록 */}
        {list.map((recentPost, index) => (
          <div key={index}>
            <Link to={`/post/${recentPost.post.postId}`}>
              <div
                className={`py-2 ${
                    index !== list.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                }`} // 마지막 항목에는 구분선 제외
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {recentPost.writer.name}
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {recentPost.post.subject}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteRecentPost(index);
                    }}
                    className="text-blue-500 dark:text-blue-400 text-xs hover:underline"
                  >
                    Clear
                  </button>
                </div>
                <div className="mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    짧은 본문
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </aside>
  )
}