import React, {useEffect, useRef, useState} from 'react';
import {useMediaQuery} from 'react-responsive';
import {Link, useNavigate} from "react-router-dom";

import AuthPage from './users/AuthPage.jsx';
import SearchPage from './search/SearchPage.jsx';
import DropDown from "../../components/DropDown.jsx";
import UsersMenu from "./users/UsersMenu.jsx";
import userStore from "../../utils/userStore.js";
import uiStore from "../../utils/uiStore.js";
import Notices from "./Notification/Notices.jsx";
import {closeEventSource, getPastNotices, setUpNoticesServer} from "../../service/noticesService.js";
import noticesStore from "../../utils/noticesStore.js";
import {doSearch} from "../../service/searchService.js";
import UserImg from "../../components/UserImg.jsx";

export default function Header() {
  // 화면 설정
  const isDesktop = useMediaQuery({minWidth: 768});

  // 데이터
  const [query, setQuery] = useState(""); // 검색어 상태
  const [searchResult, setSearchResult] = useState({
    users: [],
    posts: [],
    group: [],
  });

  // 메뉴 제어
  const [isSearch, setIsSearch] = useState(false);
  const [isNotiMenuOpen, setIsNotiMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 드롭다운 표시 여부
  const [notice, setNotice] = useState(false); // 알림 표시 여부
  const wrapperRef = useRef(null); // 외부 클릭 감지를 위한 ref

  // 사용자 제어
  const {isLogin, userInfo} = userStore(state => state);

  // ui 제어
  const {openDialog} = uiStore(state => state.dialog);

  // 알림 제어
  const {isNotice, addNotice, clearNotice} = noticesStore(state => state);

  // 페이지 이동
  const navigate = useNavigate();

  // 로그인 다이얼로그
  const handleOpenDialog = () => {
    openDialog({body: <AuthPage />, hasPrevious: true});
  }

  // 알림 창 제어
  const handleToggleNotiMenu = () => {
    setIsNotiMenuOpen(prev => !prev);
    setIsUserMenuOpen(false);
  };

  // 사용자 창 제어
  const handleToggleUserMenu = () => {
    setIsUserMenuOpen(prev => !prev);
    setIsNotiMenuOpen(false);
  };

  // header 알림 설정
  useEffect(() => {
    if (isLogin) {
      setUpNoticesServer(userInfo.id);
      getNotices().then((data) => {
        addNotice(data);
      });
    } else {
      closeEventSource();
      clearNotice();
    }
  }, [isLogin]);

  // 알림 아이콘 설정
  useEffect(() => {
    if (isNotice) {
      setNotice(true);
    } else {
      setNotice(false);
    }
  }, [isNotice]);

  const getNotices = async () => {
    try {
      const response = await getPastNotices(userInfo.id);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error(`서버 통신 실패 : ${error.statusMessage}`);
    }
  }

  // 검색창 포커스 시 드롭다운 열기
  const handleSearchFocus = () => {
    setIsSearchOpen(true);
    if (searchResult.length === 0) {
      setSearchResult({
        users: [],
        posts: [],
        group: [],
      });
    }
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    if (query.length > 1) {
      const search = async () => {
        try {
          const response = await doSearch(query);
          if (response.status === 200) {
            const data = response.data;
            setSearchResult({
              users: data.users,
              posts: data.posts,
              group: data.group
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
      search();
    }
  };

  // 항목 선택 시 호출
  const handleSearchSelect = (item, type) => {
    if (type === 'posts') {
      navigate(`/post/${item.id}`);
    }
    setIsSearchOpen(false);
    setQuery("");
    setSearchResult({
      users: [],
      posts: [],
      group: [],
    });
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 px-5 py-2 flex-col w-full border-b dark:border-0 shadow">
      <nav className="flex flex-wrap justify-between items-center">
        <div className="flex justify-start items-center">
          <Link to={"/"} className="items-center">
            <div className="text-black dark:text-gray-300 text-2xl font-mono">WriteHere</div>
          </Link>
        </div>

        {/* 검색바 피씨 */}
        <div className="hidden relative md:flex flex-1 justify-center mx-4" ref={wrapperRef}>
          <div className="relative w-full max-w-md">
            {/* 검색창 */}
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-200 dark:bg-gray-900 p-2 pl-10 rounded-full focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-900 border hover:border-blue-500 dark:hover:border-blue-900 duration-200 text-black dark:text-white"
              onFocus={handleSearchFocus}
              value={query}
              onChange={handleSearchChange}
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

            {/* 드롭다운 메뉴 */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto z-10">
                {Object.entries(searchResult).every(([_, list]) => list.length === 0) ? (
                  <div className="p-2 text-gray-500 dark:text-gray-400">검색 결과가 없습니다.</div>
                ) : (
                  Object.entries(searchResult).map(([type, list]) => (
                    list.length > 0 && (
                      <div key={type}>
                        <div className="px-2 py-1 text-blue-500 dark:text-blue-300 font-semibold capitalize">
                          {type}
                        </div>
                        {list.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSearchSelect(item, type)}
                            className="p-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-900 dark:text-gray-100"
                          >
                            {/* 사용자 정의: users면 item.name, posts면 item.title 등 */}
                            {
                              type === 'users' ? item.name :
                              type === 'posts' ? item.subject :
                              type === 'group' ? item.name : ''
                            }
                          </div>
                        ))}
                      </div>
                    )
                  ))
                )}
              </div>
            )}
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

              {/* 알림 버튼 */}
              <div>
                <button
                  className="relative p-2 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900 cursor-pointer"
                  onClick={handleToggleNotiMenu}
                >
                  {isNotice && <span className="h-2 w-2 rounded-full bg-emerald-500 absolute right-1 ring-1 ring-white"></span>}
                  <svg
                    className="w-5 h-5 text-black dark:text-blue-100"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>

                {/* 알림메뉴 메뉴 */}
                {isNotiMenuOpen && <DropDown menuOpen={setIsNotiMenuOpen}><Notices /></DropDown>}
              </div>

              {/* 사용자 버튼 */}
              <div>
                <button
                  className="p-2 rounded-full hover:bg-indigo-300 dark:hover:bg-indigo-700 cursor-pointer"
                  onClick={handleToggleUserMenu}
                >
                  {userInfo.imgUrl && <UserImg imgUrl={userInfo.imgUrl} />}
                  {!userInfo.imgUrl &&
                    <svg
                      xmlns="http://www.w3.org/2000/svg" fill="none"
                      viewBox="0 0 24 24" strokeWidth="2"
                      stroke="currentColor" className="w-5 h-5 text-black dark:text-blue-100">
                      <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  }
                </button>

                {/* 사용자 드롭다운 메뉴 */}
                {isUserMenuOpen && <DropDown menuOpen={setIsUserMenuOpen}><UsersMenu /></DropDown>}
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