import {useEffect, useState} from "react";

import UsersLogin from "./UsersLogin.jsx";
import UsersSignUp from "./UsersSignUp.jsx";
import userStore from "../../../utils/userStore.js";
import uiStore from "../../../utils/uiStore.js";
import UsersResetPassword from "./UsersResetPassword.jsx";

export default function AuthPage({btnRef}) {
  const [activePage, setActivePage] = useState('login');
  const {isLogin} = userStore(state => state);
  const {setHasPrevious} = uiStore((state) => state.dialog);

  if (isLogin) {
    console.error('로그인 되어있음');
    return null;
  }

  useEffect(() => {
    if (activePage === 'login') {
      setHasPrevious({hasPrevious: false});
    }
  }, [activePage])

  return (
    <div>
      {activePage === "login" && <UsersLogin setPage={setActivePage} />}
      {activePage === "findpwd" && <UsersResetPassword setPage={setActivePage} />}
      {activePage === "signup" && <UsersSignUp setHasPrevious={setHasPrevious} ref={btnRef} setPage={setActivePage}/>}
    </div>
  );
}
