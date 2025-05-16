import {Outlet, Route, Routes,} from "react-router-dom";
import React, {useEffect} from "react";

import userStore from './utils/userStore.js';
import uiStore from "./utils/uiStore.js";

import Header from "./pages/header/Header.jsx";
import RightSidebar from "./pages/sidebar/right/RightSidebar.jsx";
import Alert from "./components/Alert.jsx";
import Loading from "./components/Loading.jsx";
import Dialog from "./components/Dialog.jsx";
import {useMediaQuery} from "react-responsive";
import Prompt from "./components/Prompt.jsx";
import Error404 from "./pages/error/Error404.jsx";
import UsersSettings from "./pages/header/users/UsersSettings.jsx";
import Main from "./pages/main/Main.jsx";
import Error500 from "./pages/error/Error500.jsx";
import Write from "./pages/main/post/Write.jsx";
import UsersInfo from "./pages/header/users/UsersInfo.jsx";
import NoticesView from "./pages/header/Notification/NoticesView.jsx";
import CreateGroup from "./pages/main/group/CreateGroup.jsx";
import GruopInfo from "./pages/main/group/GroupInfo.jsx";
import PostView from "./pages/main/post/PostView.jsx";
import {ThemeProvider} from "next-themes";

export default function App() {
  const isDesktop = useMediaQuery({minWidth: 768});
  const {setUp, reset} = userStore(state => state);
  const {isLoading, openLoading, closeLoading} = uiStore(state => state.loading);

  // 앱 초기 세팅
  useEffect(() => {
    openLoading({isFullScreen: true});
    const initializeApp = async () => {
      // 1. 사용자 데이터 설정 (로그인 유저라면)
      if (localStorage.getItem("token")) {
        try {
          await setUp(); // 비동기 작업 완료 대기
        } catch (error) {
          console.error(`사용자 앱초기화 실패, ${error}`);
          reset();
        }
      } else {
        reset();
      }

      // 2. 최근 게시글 설정
      if (!sessionStorage.getItem('recentPosts')) {
        sessionStorage.setItem('recentPosts', JSON.stringify([]));
      }
    };
    initializeApp().then(() => closeLoading());
  }, [openLoading, closeLoading]);

  // userStore 동기화 대기용
  if (isLoading) {
    return <Loading />;
  }

  // 메인 화면 디자인
  const Layout = () => {
    return (
      <div className="flex flex-grow bg-gray-100 dark:bg-black h-full">
        <RightSidebar />
        <div className="flex flex-grow justify-center">
          <main className="w-full">
            <div><Outlet /></div>
          </main>
          <RightSidebar />
        </div>
      </div>
    )
  }

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        <div className="relative min-h-screen flex flex-col">
          <Header />
          <Routes>
            {/* 메인 화면 라우팅 */}
            <Route element={<Layout />}>
              <Route path='/' element={<Main />} />
              <Route path='/write' element={<Write />} />
              <Route path='/post/:id' element={<PostView />} />
              <Route path='/post/:id/update' element={<Write />} />
              <Route path='/notices' element={<NoticesView />} />
              <Route path='/group/create' element={<CreateGroup />} />
              <Route path='/group/:id/info' element={<GruopInfo />} />
            </Route>

            {/* 사용자 페이지 */}
            <Route path='/user/settings/:page' element={<UsersSettings />} />
            <Route path='/user/:id/info' element={<UsersInfo />} />

            {/* 에러페이지 */}
            <Route path='/error404' element={<Error404 />} />
            <Route path='/error500' element={<Error500 />} />
          </Routes>
          <footer className="text-xs text-gray-500 p-4 text-center">
            This is footer<br /> WriteHere © 2025. All rights reserved.
          </footer>
        </div>
      </ThemeProvider>

      {/* 컴포넌트 */}
      <Alert />
      <Prompt />
      <Dialog isDesktop={isDesktop} />
    </>
  );
};

