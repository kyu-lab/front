import {Route, Routes, useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";

import routes from "./utils/Routes.jsx";
import Header from "./pages/header/Header.jsx";
import userStore from './utils/userStore.js';
import RightSidebar from "./pages/sidebar/RightSidebar.jsx";
import Alert from "./components/Alert.jsx";
import uiStore from "./utils/uiStore.js";
import Loading from "./components/Loading.jsx";
import Dialog from "./components/Dialog.jsx";
import {useMediaQuery} from "react-responsive";
import {alertStatus} from "./utils/enums.js";

export default function App() {
  const isDesktop = useMediaQuery({minWidth: 768});
  const {setUp, reset} = userStore(state => state);
  const {openLoading, closeLoading} = uiStore(state => state.loading);

  // 앱 초기 세팅
  useEffect(() => {
    const initializeApp = async () => {
      // 1. 테마 설정
      const theme = localStorage.getItem('theme');
      if (theme === null) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', 'default');
      } else {
        document.documentElement.classList.add(theme);
      }

      // 2. 사용자 데이터 설정
      if (!localStorage.getItem("token")) {
        reset();
      } else {
        try {
          await setUp(localStorage.getItem("token")); // 비동기 작업 완료 대기
        } catch (error) {
          console.log(`사용자 설정 에러, ${error}`);
          reset();
        }
      }

      // 3. 최근 게시글 설정
      if (!sessionStorage.getItem('recentPosts')) {
        sessionStorage.setItem('recentPosts', JSON.stringify([]));
      }
    };

    openLoading({isFullScreen: true});
    initializeApp();
    closeLoading();
  }, []);

  return (
    <>
      <div className="relative min-h-screen bg-gray-200 dark:bg-gray-900">
        <Header />
        <div className="flex flex-grow py-10">
          <div className="w-0 md:w-64 p-4 fixed lg:static shrink-0" />
          <div className="flex flex-grow justify-center">
            <main className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xlxl rounded-3xl bg-white dark:bg-gray-800 min-h-screen">
              <div className="pb-4">
                <Routes>
                  {routes.map((route, idx) => (
                      <Route key={idx} path={route.path} element={route.element} />
                  ))}
                </Routes>
              </div>
            </main>
            <div className="hidden lg:block">
              <RightSidebar />
            </div>
          </div>
        </div>
        <footer className="text-xs text-gray-500 p-4 text-center">
          This is footer<br /> WriteHere © 2025. All rights reserved.
        </footer>
      </div>

      {/* 컴포넌트 */}
      <Alert />
      <Loading />
      <Dialog isDesktop={isDesktop} />
    </>
  );
};


