import {useEffect, useState} from "react";

import UsersLogin from "./UsersLogin.jsx";
import UsersSignUp from "./UsersSignUp.jsx";
import uiStore from "../../../utils/uiStore.js";
import UsersResetPassword from "./UsersResetPassword.jsx";

export default function AuthPage({btnRef}) {
  // 페이지 이동
  const [activePage, setActivePage] = useState('login');
  
  // ui 제어
  const {setHasPrevious} = uiStore((state) => state.dialog);

  useEffect(() => {
    if (activePage === 'login') {
      setHasPrevious({hasPrevious: false});
    }
  }, [activePage])

  return (
    <div>
      {activePage === "login" && <UsersLogin setPage={setActivePage} />}
      {activePage === "findpwd" && <UsersResetPassword setHasPrevious={setHasPrevious} ref={btnRef} setPage={setActivePage} />}
      {activePage === "signup" && <UsersSignUp setHasPrevious={setHasPrevious} ref={btnRef} setPage={setActivePage}/>}
    </div>
  );
}
