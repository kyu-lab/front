import {useState} from "react";

import {login} from "./service/usersService.js";

export default function UsersResetPassword({setPage}) {
  const [email, setEmail] = useState('');
  const [validEmailBtnEnabled, setValidEmailBtnEnabled] = useState(false);

  const handleValidEmail = async () => {
    try {
      alert("기능 미완성");
    } catch (error) {
      alert("로그인 실패");
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-2xl text-center text-gray-400 my-4">비밀번호 재설정</div>
      <p className="text-gray-400 text-sm mb-6 text-center">
        찾으실 계정의 이메일을 입력해주세요. <br/>
        (현재 미완성입니다)
      </p>
      {/* 입력 필드 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white">Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => setPage('login')}
          className="text-blue-500 text-sm">
          비밀번호가 생각나셨나요?
        </button>
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => setPage('signup')}
          className="text-blue-500 text-sm">
          새롭게 가입해볼까요?
        </button>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-3xl hover:bg-blue-700 disabled:bg-gray-700"
        onClick={handleValidEmail}
        disabled={!validEmailBtnEnabled}
      >
        Continue
      </button>
    </div>
  );
}