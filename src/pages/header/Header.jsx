import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import AuthPage from './users/AuthPage.jsx';
import SearchPage from './search/SearchPage.jsx';
import DropDown from "../../components/DropDown.jsx";
import UsersMenu from "./users/UsersMenu.jsx";

export default function Header() {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [isAuth, setIsAuth] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="bg-gray-100 dark:bg-gray-800 px-10 flex-col w-full p-2">
      {/* 상단: 로고, 검색바, 사용자 버튼 */}
      <div className="flex  mx-auto">
        {/* 로고 */}
        <div className="items-center max-w-7xl">
          <div className="text-black dark:text-white text-4xl font-bold">WriteHere</div>
        </div>

        {/* 검색바 (중앙 정렬) */}
        <div className="flex-1 flex justify-center mx-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-300 dark:bg-gray-700 p-2 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-900 border hover:border-blue-500 dark:hover:border-blue-900 duration-200"
            />
            <button
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 hover:text-white"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                  stroke="currentColor"
                  fill="none"
                  fillRule="evenodd"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 로그인 상태 */}
        {
          localStorage.getItem("isLogIn") === "true" &&
          <div className="flex items-center space-x-4">
            {/* 모바일에서만 검색 버튼 표시 */}
            <div className="md:hidden">
              <button
                  onClick={() => setIsSearch(!isSearch)}
                  className="bg-gray-400 dark:bg-gray-500 text-white p-2 rounded-full dark:hover:bg-gray-600"
                  aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path
                      d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z"
                      fill="#0D0D0D"
                  />
                </svg>
              </button>
            </div>

            {/* todo : 미개발 */}
            {/* 작성 버튼 */}
            <div
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-60 cursor-pointer"
            >
              <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>

            {/* todo : 미개발 */}
            {/* 알림 버튼 */}
            <div
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-60 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>

            {/* 사용자 버튼 */}
            <div className="relative">
              <button
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                onMouseEnter={() => setIsProfileMenuOpen(true)}
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <svg className="w-5 h-5" fill="#000000" width="10px" height="10px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.71,12.71a6,6,0,1,0-7.42,0,10,10,0,0,0-6.22,8.18,1,1,0,0,0,2,.22,8,8,0,0,1,15.9,0,1,1,0,0,0,1,.89h.11a1,1,0,0,0,.88-1.1A10,10,0,0,0,15.71,12.71ZM12,12a4,4,0,1,1,4-4A4,4,0,0,1,12,12Z"/>
                </svg>
              </button>

              {/* 사용자 드롭다운 메뉴 */}
              {isProfileMenuOpen && <DropDown profileStatus={setIsProfileMenuOpen} ><UsersMenu /></DropDown>}
            </div>
          </div>
        }

        {/* todo : 상태관리 변경 필요 */}
        {/* 로그인 버튼 */}
        { localStorage.getItem("isLogIn") !== "true" && <button onClick={() => setIsAuth(!isAuth)} >LogIn</button> }
      </div>

      {/* 검색 모달(모바일용) */}
      {isSearch && <SearchPage onClose={() => setIsSearch(!isSearch)} isDesktop={isDesktop} />}

      {/* 사용자 로그인 모달 */}
      {isAuth && <AuthPage onClose={() => setIsAuth(!isAuth)} isDesktop={isDesktop} />}
    </header>
  );
}