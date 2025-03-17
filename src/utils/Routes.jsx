import Main from "../pages/main/Main.jsx";
import UsersSettings from "../pages/header/users/UsersSettings.jsx";

const routes = [
  { path: '/', element: <Main /> },
  { path: '/:username/info', element: <UsersSettings /> },
  // 페이지 추가시 추가
];

export default routes;