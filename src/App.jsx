import {Route, Routes} from "react-router-dom";
import {useEffect} from "react";

import routes from "./utils/Routes.jsx";
import Header from "./pages/header/Header.jsx";

export default function App() {
  // 앱 초기 세팅
  useEffect(() => {
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


    // 2. 사용자 데이터 초기화
    if (!localStorage.getItem("isLogIn")) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    }
  }, []);

  return (
    <div className="relative z-10 min-h-screen bg-gray-200 dark:bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 pt-5">
          <main className="w-full rounded-3xl max-w-2xl mx-auto bg-white dark:bg-gray-800 min-h-screen">
            <Routes>
              {
                routes.map((route, idx) => {
                  return <Route key={idx} path={route.path} element={route.element} />
                })
              }
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}
