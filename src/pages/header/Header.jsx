import React, {useState} from 'react';
import {useMediaQuery} from 'react-responsive';
import {Link} from "react-router-dom";

import AuthPage from './users/AuthPage.jsx';
import SearchPage from './search/SearchPage.jsx';
import DropDown from "../../components/DropDown.jsx";
import UsersMenu from "./users/UsersMenu.jsx";
import userStore from "../../utils/userStore.js";
import uiStore from "../../utils/uiStore.js";

export default function Header() {
  const isDesktop = useMediaQuery({minWidth: 768});
  const [isSearch, setIsSearch] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const {isLogin} = userStore(state => state);
  const {openDialog} = uiStore(state => state.dialog);

  const handleOpenDialog = () => {
    openDialog({body: <AuthPage />, hasPrevious: true});
  }

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 px-5 py-2 flex-col w-full border-b dark:border-0 shadow">
      <nav className="flex flex-wrap justify-between items-center">
        <div className="flex justify-start items-center">
          <Link to={"/"} className="items-center">
            <div className="text-black dark:text-white text-2xl font-mono">WriteHere</div>
          </Link>
        </div>

        {/* 검색바 피씨 */}
        <div className="hidden md:flex flex-1 justify-center mx-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-200 dark:bg-gray-900 p-2 pl-10 rounded-full focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-900 border hover:border-blue-500 dark:hover:border-blue-900 duration-200 text-black dark:text-white"
            />
            <button
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-black dark:text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 오른쪽 버튼 */}
        <div className="flex items-center lg:order-2 space-x-2">
          {/* 검색바 모바일 */}
          <div className="md:hidden">
            <button
                onClick={() => setIsSearch(!isSearch)}
                className="p-2 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900 cursor-pointer"
                aria-label="Search"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-black dark:text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
              >
                <path d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" />
              </svg>
            </button>
          </div>

          {/* 로그인 상태에 표시되는 버튼 */}
          {
            isLogin &&
              <>
              {/* 작성 버튼 */}
              <Link
                className="p-2 rounded-full hover:bg-green-300 dark:hover:bg-green-700 cursor-pointer"
                to={"/write"}
              >
                <svg className="w-5 h-5 text-black dark:text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </Link>

              {/* todo : 미개발 */}
              {/* 알림 버튼 */}
              <div
                className="p-2 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900 cursor-pointer"
              >
                <svg className="w-5 h-5 text-black dark:text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>

              {/* 사용자 버튼 */}
              <div>
                <button
                  className="p-2 rounded-full hover:bg-indigo-300 dark:hover:bg-indigo-700 cursor-pointer"
                  onMouseEnter={() => setIsProfileMenuOpen(true)}
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" strokeWidth="2"
                    stroke="currentColor" className="w-5 h-5 text-black dark:text-blue-100">
                    <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </button>

                {/* 사용자 드롭다운 메뉴 */}
                {isProfileMenuOpen && <DropDown profileStatus={setIsProfileMenuOpen} ><UsersMenu /></DropDown>}
              </div>
            </>
          }

          {/* 로그인 버튼 */}
          {
            !isLogin  &&
            <button
              className="border-3 rounded-full px-3 py-2 text-white bg-blue-500 dark:bg-blue-700 hover:bg-blue-600"
              onClick={handleOpenDialog} >
              LogIn
            </button>
          }
        </div>
      </nav>

      {/* 검색 (모바일용) */}
      {isSearch && <SearchPage onClose={() => setIsSearch(!isSearch)} isDesktop={isDesktop} />}
    </header>
  );
}