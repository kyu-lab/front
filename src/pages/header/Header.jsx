import React, {useState} from 'react';
import {useMediaQuery} from 'react-responsive';
import {Link} from "react-router-dom";

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
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 px-5 py-2 flex-col w-full border-b dark:border-0 shadow">
      <div className="flex mx-auto">
        {/* 로고 */}
        <Link to={"/"} className="items-center">
          <div className="text-black dark:text-white text-2xl font-mono">WriteHere</div>
        </Link>

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
                className="w-5 h-5 text-black dark:text-white " stroke="currentColor" viewBox="0 -960 960 960" fill="#1f1f1f">
                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 검색바 모바일 */}
        <div className="flex items-center space-x-4">
          <div className="md:hidden">
            <button
                onClick={() => setIsSearch(!isSearch)}
                className="bg-gray-200 dark:bg-gray-500 text-white p-2 rounded-full dark:hover:bg-gray-600"
                aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
            </button>
          </div>
        </div>

        {/* 로그인 상태 */}
        {
          localStorage.getItem("isLogIn") === "true" &&
          <div className="flex items-center space-x-4">
            {/* 작성 버튼 */}
            <div className="p-2 rounded-full hover:bg-green-300 dark:hover:bg-green-700 cursor-pointer">
              <Link to={"/write"}>
                <svg className="w-5 h-5 text-black dark:text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </Link>
            </div>

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
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-indigo-300 dark:hover:bg-indigo-700 cursor-pointer"
                onMouseEnter={() => setIsProfileMenuOpen(true)}
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black dark:text-blue-100" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                  <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
                </svg>
              </button>

              {/* 사용자 드롭다운 메뉴 */}
              {isProfileMenuOpen && <DropDown profileStatus={setIsProfileMenuOpen} ><UsersMenu /></DropDown>}
            </div>
          </div>
        }

        {/* todo : 상태관리 변경 필요 */}
        {/* 로그인 버튼 */}
        {
          localStorage.getItem("isLogIn") !== "true" &&
          <button className="border-3 rounded-full px-3 py-2 text-white bg-blue-500 dark:bg-blue-700 hover:bg-blue-600" onClick={() => setIsAuth(!isAuth)} >
            LogIn
          </button>
        }
      </div>

      {/* 검색 모달(모바일용) */}
      {isSearch && <SearchPage onClose={() => setIsSearch(!isSearch)} isDesktop={isDesktop} />}

      {/* 사용자 로그인 모달 */}
      {isAuth && <AuthPage onClose={() => setIsAuth(!isAuth)} isDesktop={isDesktop} />}
    </header>
  );
}