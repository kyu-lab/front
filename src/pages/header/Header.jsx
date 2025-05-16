import React, {useEffect, useRef, useState} from 'react';
import {useMediaQuery} from 'react-responsive';
import {Link, useNavigate} from "react-router-dom";

import AuthPage from './users/AuthPage.jsx';
import SearchPage from './search/SearchPage.jsx';
import userStore from "../../utils/userStore.js";
import uiStore from "../../utils/uiStore.js";
import {deleteNotices, getPastNotices} from "@/service/noticesService.js";
import noticesStore from "../../utils/noticesStore.js";
import {doSearch} from "@/service/searchService.js";
import {closeEventSource, setUpNoticesServer} from "@/utils/evnentSource.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuPortal,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Button} from "@/components/ui/button.jsx";
import {
  Bell,
  CirclePlus, LogIn, LogOut,
  Monitor,
  MonitorCog,
  Moon,
  Pen, Settings, Sun,
  User,
  Users,
} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {logout} from "@/service/usersService.js";
import {alertStatus} from "@/utils/enums.js";
import {useTheme} from "next-themes";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 드롭다운 표시 여부

  // 알림
  const {notices} = noticesStore(state => state);
  const [notice, setNotice] = useState(false); // 알림 표시 여부
  const [notifications, setNotifications] = useState([]); // 알림 목록
  const [isNoticeMenuOpen, setIsNoticeMenuOpen] = useState(false);

  const wrapperRef = useRef(null); // 외부 클릭 감지를 위한 ref
  const {theme, setTheme} = useTheme();

  // 사용자 제어
  const {isLogin, userInfo, reset} = userStore(state => state);

  // ui 제어
  const {openDialog} = uiStore(state => state.dialog);

  // ui 제어
  const {openAlert} = uiStore((state) => state.alert);

  // 알림 제어
  const {isNotice, addNotice, clearNotice} = noticesStore(state => state);

  // 페이지 이동
  const navigate = useNavigate();

  // 로그인 다이얼로그
  const handleOpenDialog = () => {
    openDialog({body: <AuthPage />, hasPrevious: true});
  }

  // 컴포넌트 진입시 세팅
  useEffect(() => {
    setNotifications(notices);
  }, []);

  const handleNotices = async (notice) => {
    try {
      const response = await deleteNotices(notice.id);
      if (response.status === 200) {
        if (notice.type === 'P') {
          navigate(`/post/${notice.postId}`);
        }
      }
    } catch (error) {
      console.error(`서버 통신 실패 : ${error.statusMessage}`);
      navigate('/error500');
    }
  }

  // 로그아웃
  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.status === 200) {
        openAlert({message: "로그아웃 되었습니다.", type: alertStatus.SUCCESS});
        navigate('/');
        reset();
      }
    } catch (error) {
      openAlert({message: "잠시 후 다시 로그아웃 시도해주세요.", type: alertStatus.ERROR});
    }
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
      void search();
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
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 px-5 py-2 flex-col w-full border-b dark:border-0 shadow">
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
              {/* 생성 버튼 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-label="생성" className="p-2" variant="icon">
                    <CirclePlus className="h-4 w-4 cursor-pointer" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>생성 메뉴</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup >
                    <DropdownMenuItem onSelect={() => navigate("/write")}>
                      <Pen className="h-4 w-4"/>
                      <span>게시글 생성</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => navigate("/group/create")}>
                      <Users className="h-4 w-4"/>
                      <span>그룹 생성</span>
                    </DropdownMenuItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 알림 버튼 */}
              <DropdownMenu open={isNoticeMenuOpen} onOpenChange={setIsNoticeMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button aria-label="알림" className="p-2" variant="icon">
                    <Bell className="h-4 w-4 cursor-pointer" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel className="flex justify-between items-center">
                    <span>알림</span>
                    <Button
                      aria-label="설정"
                      className="p-1"
                      variant="icon"
                      onClick={() => {
                        setIsNoticeMenuOpen(false);
                        navigate(`/user/settings/notice`);
                      }}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      알림이 없습니다.
                    </div>
                  ) : (
                    <DropdownMenuGroup>
                      {notifications.map((item, idx) => (
                        <DropdownMenuItem key={idx}>
                          {/* 알림 내용 */}
                          {item.message}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/notices" className="text-blue-400 text-sm justify-center">
                      더 보기
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 사용자 버튼 */}
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="p-2" variant="icon">
                      <Avatar className="h-4 w-4 cursor-pointer">
                        <AvatarImage src={userInfo.imgUrl} alt="user" />
                        <AvatarFallback>
                          <User />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={userInfo.imgUrl} alt="user" />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{userInfo.name}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onSelect={() => navigate(`/user/${userInfo.id}/info`)}>
                        <User />프로필
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => navigate(`/user/settings/account`)}>
                        <Settings />설정
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Monitor /> 디스플레이 설정
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value)}>
                              <DropdownMenuRadioItem value="system">
                                <MonitorCog className="mr-2 h-4 w-4" /> 기본값
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="light">
                                <Sun className="mr-2 h-4 w-4" /> 밝음
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="dark">
                                <Moon className="mr-2 h-4 w-4" /> 어두움
                              </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleLogout}>
                      <LogOut />로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          }

          {/* 로그인 버튼 */}
          {!isLogin  &&
            <Button
              className="rounded-full px-3 text-white bg-blue-500 dark:bg-blue-950 hover:bg-blue-600"
              onClick={handleOpenDialog} >
              <LogIn/> LogIn
            </Button>}
        </div>
      </nav>

      {/* 검색 (모바일용) */}
      {isSearch && <SearchPage onClose={() => setIsSearch(!isSearch)} isDesktop={isDesktop} />}
    </header>
  );
}