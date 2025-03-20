import {useState} from "react";
import {useNavigate} from "react-router-dom";

import {login} from "./service/usersService.js";

export default function UsersLogin() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [passWord, setPassWord] = useState("");

  const handleLogin = async () => {
    try {
      const response = await login({ name, passWord });
      localStorage.setItem("isLogIn", "true");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userInfo", JSON.stringify(response.data.userInfo));
      alert("로그인 성공");
      navigate('/');
    } catch (error) {
      alert("로그인 실패");
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div className="space-y-4 dark:text-white">
      {/* 입력 필드 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white">Username</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white">Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
          placeholder="Enter your password"
          value={passWord}
          onChange={(e) => setPassWord(e.target.value)}
        />
      </div>
      <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          onClick={handleLogin}
      >
        로그인
      </button>
    </div>
  );
}