import { useState } from "react";
import Modal from "../../../components/Modal.jsx";
import UsersLogin from "./UsersLogin.jsx";
import UsersSignUp from "./UsersSignUp.jsx";

export default function AuthPage({ onClose, isDesktop }) {
  const [activeTab, setActiveTab] = useState("login");

  return (
      <Modal onClose={onClose} isDesktop={isDesktop}>
        {/* 상단: 로고, 제목, 닫기 버튼 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-black">Login</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            X
          </button>
        </div>

        {/* 탭 (모바일에서는 숨김, 데스크톱에서만 표시) */}
        {isDesktop && (
            <div className="flex border-b mb-4">
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
        )}

        {/* 로그인/회원가입 폼 */}
        {activeTab === "login" && <UsersLogin />}
        {activeTab === "signup" && <UsersSignUp />}
      </Modal>
  );
}