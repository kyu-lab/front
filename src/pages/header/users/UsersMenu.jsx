import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import userStore from "../../../utils/userStore.js";
import {logout} from "./service/usersService.js";
import {alertStatus} from "../../../utils/enums.js";
import uiStore from "../../../utils/uiStore.js";

export default function UsersMenu() {
  // 페이지 제어
  const navigate = useNavigate();
  
  // 메뉴 제어
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  
  // 사용자 화면 모드
  const [curTheme, setCurTheme] = useState(localStorage.getItem('theme') || 'default');
  
  // 사용자 데이터
  const {reset} = userStore(state => state);
  
  // ui 제어
  const {openAlert} = uiStore((state) => state.alert);

  // 처음 로드될 때 localStorage에서 테마 가져오기
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'default';
    setCurTheme(savedTheme);
  }, []);

  // 테마 변경 함수
  const changeTheme = (theme) => {
    localStorage.setItem('theme', theme);
    setCurTheme(theme);
    applyTheme(theme);
  };

  // 테마 적용 함수
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // 시스템 기본값일 경우
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

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

  applyTheme(curTheme);
  return (
    <>
      <div className="px-4 py-2 text-gray-800 dark:text-gray-500 font-semibold border-b">시스템 설정</div>
      <div className="p-2">
        <Link
          className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          to={`/user/settings`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-5 w-5 text-black dark:text-blue-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>

          <span className="text-black dark:text-white" >사용자 설정</span>
        </Link>
      </div>

      <div className="p-2">
        <button
          className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-5 w-5 text-black dark:text-blue-700">
            <path d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"/>
          </svg>
          <span className="text-black dark:text-white">디스플레이 설정</span>
        </button>
      </div>

      <div className="p-2">
        <button
          className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          onClick={handleLogout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-black dark:text-blue-700"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-black dark:text-white">로그아웃</span>
        </button>
      </div>

      {isSubMenuOpen && (
          <div className="absolute right-full top-10 w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <div className="p-2 flex">
              <button
                  className="flex items-center justify-between space-x-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 rounded-lg"
                  onClick={() => changeTheme('default')}
              >
                {curTheme === 'default' ? (
                    <>
                      <span className="text-blue-500">시스템 기본값</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                ) :
                  <>
                    <span className="text-black dark:text-gray-700">시스템 기본값</span>
                  </>
                }
              </button>
            </div>
            <div className="p-2 flex">
              <button
                  className="flex items-center justify-between space-x-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  onClick={() => changeTheme('light')}
              >
                {curTheme === 'light' ? (
                  <>
                    <span className="text-blue-500">라이트 모드</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                ) :
                  <>
                    <span className="text-black dark:text-gray-700">라이트 모드</span>
                  </>
                }
              </button>
            </div>
            <div className="p-2 flex">
              <button
                  className="flex items-center justify-between space-x-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  onClick={() => changeTheme('dark')}
              >
                {curTheme === 'dark' ? (
                  <>
                    <span className="text-blue-500">다크 모드</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                ) :
                  <>
                    <span className="text-black dark:text-gray-700">다크 모드</span>
                  </>
                }
              </button>
            </div>
          </div>
      )}
    </>
  );
}
