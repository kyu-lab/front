import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {
  changePassword,
  deleteUser,
  getUserSetting,
  validationPassword
} from "../../../service/usersService.js";
import userStore from "../../../utils/userStore.js";
import uiStore from "../../../utils/uiStore.js";
import {alertStatus, promptStatus} from "../../../utils/enums.js";

export default function UsersSettings() {
  // 사용중인 탭 정렬 기준
  const {page} = useParams();

  // 사용자 데이터
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordInfo, setPasswordInfo] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [enabledChangePasswordBtn, setEnabledChangePasswordBtn] = useState(false);

  // 페이지 이동
  const navigate = useNavigate();

  // ui 제어
  const {openAlert} = uiStore((state) => state.alert);
  const {openPrompt} = uiStore((state) => state.prompt);

  // 컴포넌트 데이터
  const [curPage, setCurPage] = useState(page);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  // 비밀번호 변경 처리 함수
  const handleChangePassword = async () => {
    try {
      if (!validationPassword({password, setPasswordValidationError})) {
        openAlert({message: "비밀번호를 다시 확인해주세요.", type: alertStatus.WARN});
        setEnabledChangePasswordBtn(false);
        return;
      }

      const response = await changePassword({email, password});
      if (response.status === 200) {
        openAlert({message: `${response.data}`, type: alertStatus.SUCCESS});
      }
    } catch (error) {
      if (error.response.status === 409) {
        openAlert({message: `${error.response.data}`, type: alertStatus.WARN});
      } else {
        openAlert({message: "잠시 후 다시 확인해주세요..", type: alertStatus.ERROR});
      }
    }
  };

  /**
   * 비밀번호(password)과 관련된 유효성을 설정한다.
   * @param message 알림 메시지
   */
  function setPasswordValidationError(message) {
    setIsValidPassword(false);
    setPasswordInfo(message)
  }

  // 탭 데이터 배열
  const pages = [
    {id: "account", label: "계정"},
    {id: "notices", label: "알림"},
    // 필요하면 더 추가 가능
  ];

  const handleUserDelete = async () => {
    try {
      const isDelete = await openPrompt({message: "정말로 삭제할까요?", type: promptStatus.WARN});
      if (isDelete) {
        const response = await deleteUser();
        if (response.status === 200) {
          openAlert({message: "삭제되었습니다.", type: alertStatus.SUCCESS});
          navigate('/');
        }
      }
    } catch (error) {
      openAlert({message: "삭제에 실패하였습니다.", type: alertStatus.ERROR});
      console.error(error);
    }
  };

  useEffect(() => {
    const check = async () => {
      try {
        const response = await getUserSetting(curPage);
        if (response.status === 200) {
          return response.data;
        }
      } catch (error) {
        openAlert({message: "로그인 후 이용가능합니다.", type: alertStatus.ERROR});
        navigate('/error404');
      }
    }
    check().then(data => {
      setEmail(data.email);
      setName(data.name);
    });
  }, [curPage]);

  // "변경" 버튼 클릭 시 호출되는 함수
  const handlePasswordChangeToggle = () => {
    setShowPasswordInput(!showPasswordInput); // 입력칸 표시/숨김 토글
  };

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
    if (e._reactName === 'onFocus' || e._reactName === 'onChange') {
      setPasswordInfo('');
      setIsValidPassword(true);
    }
  }

  return (
    <div>
      <div className="text-gray-100">
        <h1 className="text-3xl text-black dark:text-gray-200 font-medium mb-6">사용자 설정</h1>
        <div className="flex border-b border-gray-700 mb-4">
          {pages.map((page) => (
            <button
              key={page.id}
              className={`px-4 py-2 font-medium ${
                curPage === page.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 dark:text-gray-200"
              }`}
              onClick={() => setCurPage(page.id)}
            >
              {page.label}
            </button>
          ))}
        </div>

        <h1 className="text-black dark:text-gray-200 text-3xl font-medium mb-3.5">
          {page}
        </h1>

        <div className="mb-8">
          <div className="flex justify-between items-center py-4 border-b border-gray-800">
            <div className="text-black dark:text-gray-200">메일 주소</div>
            <div className="flex items-center">
              <span className="text-blue-400 mr-4">{email}</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-4 border-b border-gray-800">
            <div className="text-black dark:text-gray-200">사용자 이름</div>
            <div className="flex items-center">
              <span className="text-blue-400 mr-4">{name}</span>
            </div>
          </div>

          <div className={`flex justify-between items-center py-4 ${
            showPasswordInput ? "" : "border-b border-gray-800"}`}
          >
            <div className="text-black dark:text-gray-200">비밀번호 재설정</div>
            <div className="flex items-center">
              <button
                onClick={handlePasswordChangeToggle}
                className="rounded-3xl p-1 bg-blue-300 text-white mr-4">
                변경
              </button>
            </div>
          </div>

          {/* 비밀번호 입력칸과 업데이트 버튼 (조건부 렌더링) */}
          {showPasswordInput && (
            <div className="py-4 border-b border-gray-800">
              <div className="flex flex-col space-y-3">
                  <input
                    type="password"
                    className="w-full p-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 text-black dark:text-white"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordInput}
                    onBlur={handlePasswordInput}
                    onFocus={handlePasswordInput}
                  />
                  <p className={!isValidPassword ? `mt - 2 text-sm text-red-600 dark:text-red-500` : 'mt-2 text-sm text-green-600 dark:text-green-500'}>
                    <span className="font-medium">{passwordInfo}</span>
                  </p>
                <button
                  type="button"
                  className="w-full bg-blue-600 text-white p-2 rounded-3xl hover:bg-blue-700 disabled:bg-gray-700"
                  onClick={handleChangePassword}
                  disabled={!enabledChangePasswordBtn}
                >
                  Change Password
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center py-4 border-b border-gray-800">
            <div className="text-black dark:text-gray-200">계정 삭제하기</div>
            <div className="flex items-center">
              <span className="text-red-400 mr-4">삭제시 복구가 불가능합니다</span>
              <button
                onClick={handleUserDelete}
                className="rounded-3xl p-1 bg-orange-400 text-white mr-4">
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}