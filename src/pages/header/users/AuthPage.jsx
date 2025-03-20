import { useState } from "react";

import Modal from "../../../components/Modal.jsx";
import UsersLogin from "./UsersLogin.jsx";
import UsersSignUp from "./UsersSignUp.jsx";

export default function AuthPage({ onClose, isDesktop }) {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <Modal onClose={onClose} isDesktop={isDesktop}>
      {/* 상단: 로고, 제목, 닫기 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-black dark:text-white">Welcome</span>
        </div>
        <button onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black dark:text-white">
            <path d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" />
          </svg>
        </button>
      </div>

      {/* 탭 */}
      <div className="flex mb-4">
        <button
            className={`flex-1 py-2 text-center ${
                activeTab === "login"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
            }`}
            onClick={() => setActiveTab("login")}
        >
          Login
        </button>
        <button
            className={`flex-1 py-2 text-center ${
                activeTab === "signup"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
            }`}
            onClick={() => setActiveTab("signup")}
        >
          Sign Up
        </button>
      </div>

      {/* 로그인/회원가입 폼 */}
      {activeTab === "login" && <UsersLogin />}
      {activeTab === "signup" && <UsersSignUp />}
    </Modal>
  );
}