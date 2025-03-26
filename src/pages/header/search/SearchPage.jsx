import React from "react";

export default function SearchPage({ onClose, isDesktop }) {
  return (
    <div
        className={`fixed inset-0 z-50 flex flex-col ${
            isDesktop ? "hidden" : "block"
        } bg-gray-50 dark:bg-gray-900 text-white`}
    >
      <div className="flex items-center p-4 border-b border-gray-700">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full dark:bg-gray-800 text-black dark:text-white p-2 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" />
          </svg>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-blue-400 hover:text-blue-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-black dark:text-white rounded-2xl hover:bg-gray-400 dark:hover:bg-gray-400"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none">
            <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" />
          </svg>
        </button>
      </div>

      {/* 본문: 검색 기록 없음 메시지 */}
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">No recent searches</p>
      </div>
    </div>
  )
}