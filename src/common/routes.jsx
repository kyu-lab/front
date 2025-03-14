import Login from "../users/components/Login.jsx";
import SignUp from "../users/components/SignUp.jsx";
import Home from "../home/components/Home.jsx";

const routes = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/sign-up', element: <SignUp /> },
  // 페이지 추가시 추가
];

export default routes;