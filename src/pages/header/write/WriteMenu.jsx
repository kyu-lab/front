import React from "react";

export default function WriteMenu() {
  return (
    <>
      <div className="px-4 py-2 text-gray-800 font-semibold border-b">작성 메뉴</div>
      <div className="px-4 py-2 text-gray-600 flex justify-between items-center hover:bg-gray-100">
        <span>글 작성하기</span>
        <span className="text-sm text-gray-400">한국어</span>
      </div>
    </>
  )
};