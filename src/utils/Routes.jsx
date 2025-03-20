import Main from "../pages/main/Main.jsx";
import UsersSettings from "../pages/header/users/UsersSettings.jsx";
import Write from "../pages/main/post/Write.jsx";
import View from "../pages/main/post/View.jsx";

const routes = [
  { path: '/', element: <Main /> },
  { path: '/:username/info', element: <UsersSettings /> },
  { path: '/write', element: <Write /> },
  { path: '/post/:id', element: <View /> },
  // 페이지 추가시 추가
];

export default routes;