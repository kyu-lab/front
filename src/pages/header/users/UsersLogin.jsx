import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import {login} from "./service/usersService.js";
import uiStore from "../../../utils/uiStore.js";
import userStore from "../../../utils/userStore.js";
import {alertStatus} from "../../../utils/enums.js";

export default function UsersLogin({setPage}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginBtnEnabled, setLoginBtnEnabled] = useState(false); // 로그인 버튼
  const {closeDialog} = uiStore(state => state.dialog);
  const {openAlert} = uiStore((state) => state.alert);
  const {setUp} = userStore(state => state);

  const handleLogin = async () => {
    try {
      const response = await login({email, password});
      if (!response) {
        openAlert({message: "이메일과 비밀번호를 다시 확인해주세요.", type: alertStatus.WARN});
        return;
      }
      setUp();
      closeDialog();
      navigate('/');
      openAlert({message: "로그인 되었습니다.", type: alertStatus.SUCCESS});
    } catch (error) {
      openAlert({message: "잠시 후 다시 로그인해주세요", type: alertStatus.ERROR});
    }
  };

  useEffect(() => {
    if (email.trim() !== '' && password.trim()) {
      setLoginBtnEnabled(true);
    } else {
      setLoginBtnEnabled(false);
    }
  }, [email, password])

  return (
    <div className="space-y-4">
      <div className="text-2xl text-center text-black dark:text-white my-4">LogIn</div>
      <p className="text-gray-400 text-sm mb-6">
        By continuing, you agree to our <a href="#" className="text-blue-500">User Agreement</a> and
        acknowledge that you understand the <a href="#" className="text-blue-500">Privacy Policy</a>.
      </p>
      {/* 입력 필드 */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full p-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 text-black dark:text-white"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white">Password</label>
        <input
          id="password"
          type="password"
          className="w-full p-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 text-black dark:text-white"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => setPage('findpwd')}
          className="text-blue-500 text-sm">
          비밀번호를 잊으셨나요?
        </button>
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => setPage('signup')}
          className="text-blue-500 text-sm">
          회원가입
        </button>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-3xl hover:bg-blue-700 disabled:bg-gray-700"
        onClick={handleLogin}
        disabled={!loginBtnEnabled}
      >
        LogIn
      </button>
    </div>
  );
}