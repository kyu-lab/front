import {useEffect, useState} from "react";

import {changePassword, existsEmail, login, validationEmail, validationPassword} from "./service/usersService.js";
import uiStore from "../../../utils/uiStore.js";
import {alertStatus} from "../../../utils/enums.js";

export default function UsersResetPassword({setHasPrevious, setPage}) {
  // 페이지 제어
  const [step, setStep] = useState(1);

  // ui 제어
  const {openAlert} = uiStore((state) => state.alert);
  const {setOnBack} = uiStore((state) => state.dialog);

  // 비밀번호 재설정 (step1)
  const [email, setEmail] = useState('');
  const [emailInfo, setEmailInfo] = useState('');
  const [isValidEmail, setIsValidEmamil] = useState(true);

  // 비밀번호 재설정 (step2)
  const [password, setPassword] = useState('');
  const [passwordInfo, setPasswordInfo] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(false);

  // 버튼 제어
  const [enabledValidEmailBtn, setEnableValidEmailBtn] = useState(false);
  const [enabledChangePasswordBtn, setEnabledChangePasswordBtn] = useState(false);

  // 이메일 검증 함수
  const handleCheckEmail = async () => {
    if (!validationEmail({email, setEmailValidationError})) {
      openAlert({message: "이메일을 다시 확인해주세요", type: alertStatus.WARN});
      return;
    }

    try {
      const response = await existsEmail(email);

      if (response.status === 200) {
        setStep(2); // 이메일이 중복되지 않으면 다음 단계로
        setHasPrevious({hasPrevious: true}); // 뒤로가기 버튼 표시

        // step2 데이터 초기화
        setEnabledChangePasswordBtn(false);
        setPassword('');
        setPasswordValidationError('');
      }
    } catch (error) {
      if (error.response.status === 409) {
        setEmailValidationError('이미 존재하는 이메일입니다.');
        setEnableValidEmailBtn(false);
      } else {
        openAlert({message: "잠시 후 다시 확인해주세요..", type: alertStatus.ERROR});
      }
    }
  };

  // 이메일 입력 이벤트
  const handleEmailInput = (e) => {
    setEmail(e.target.value);
    if (e._reactName === 'onFocus' || e._reactName === 'onChange') {
      setEmailInfo('');
      setIsValidEmamil(true);
      return;
    }

    setEnableValidEmailBtn(false);
    if (validationEmail({email, setEmailValidationError})) {
      setEnableValidEmailBtn(true);
    }
  }

  /**
   * 이메일(email)과 관련된 유효성을 설정한다.
   * @param message 알림 메시지
   */
  function setEmailValidationError(message) {
    setIsValidEmamil(false);
    setEmailInfo(message)
  }

  // 패스워드 입력 이벤트
  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
    if (e._reactName === 'onFocus' || e._reactName === 'onChange') {
      setPasswordInfo('');
      setIsValidPassword(true);
      return;
    }

    setEnabledChangePasswordBtn(false);
    if (isValidEmail && validationPassword({password, setPasswordValidationError})) {
      setEnabledChangePasswordBtn(true);
    }
  }

  /**
   * 비밀번호(password)과 관련된 유효성을 설정한다.
   * @param message 알림 메시지
   */
  function setPasswordValidationError(message) {
    setIsValidPassword(false);
    setPasswordInfo(message)
  }

  // 다이얼로그 뒤로가기 버튼 재정의
  useEffect(() => {
    const onBack = () => {
      setStep(step - 1);
    }
    setOnBack({onBack});

    if (step === 1) {
      setHasPrevious({hasPrevious: false});
    }
  }, [step, setOnBack])

  // 회원가입 처리 함수
  const handleChangePassword = async () => {
    try {
      if (!validationEmail({email, setEmailValidationError})) {
        openAlert({message: "이메일을 다시 확인해주세요", type: alertStatus.WARN});
        return;
      }

      if (!validationPassword({password, setPasswordValidationError})) {
        openAlert({message: "비밀번호를 다시 확인해주세요.", type: alertStatus.WARN});
        setEnabledChangePasswordBtn(false);
        return;
      }

      const response = await changePassword({email, password});
      if (response.status === 200) {
        openAlert({message: `${response.data}`, type: alertStatus.SUCCESS});
        setPage("login");
      }
    } catch (error) {
      if (error.response.status === 409) {
        openAlert({message: `${error.response.data}`, type: alertStatus.WARN});
      } else {
        openAlert({message: "잠시 후 다시 확인해주세요..", type: alertStatus.ERROR});
      }
    }
  };

  return (
    <div className="space-y-4">
      {step === 1 && (
        <>
          <div className="text-2xl text-center text-gray-400 my-4">비밀번호 재설정</div>
          <p className="text-gray-400 text-sm mb-6 text-center">
            가입한 이메일을 입력해주세요.
          </p>
          {/* 입력 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 text-black dark:text-white"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailInput}
              onBlur={handleEmailInput}
              onFocus={handleEmailInput}
            />
            <p className={!isValidEmail ? `mt - 2 text-sm text-red-600 dark:text-red-500` : 'mt-2 text-sm text-green-600 dark:text-green-500'}>
              <span className="font-medium">{emailInfo}</span>
            </p>
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
            type="button"
            className="w-full bg-blue-600 text-white p-2 rounded-3xl hover:bg-blue-700 disabled:bg-gray-700"
            onClick={handleCheckEmail}
            disabled={!enabledValidEmailBtn}
          >
            Continue
          </button>
        </>
      )}

      {/* Step 2: 비밀번호 재설정 */}
      {step === 2 && (
        <>
          <div className="text-2xl text-center text-black dark:text-white my-4">Change Password</div>
          <p className="text-gray-400 text-sm mb-6">
            새롭게 설정할 비밀번호를 입력해주세요.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Password
            </label>
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
          </div>
          <button
            type="button"
            className="w-full bg-blue-600 text-white p-2 rounded-3xl hover:bg-blue-700 disabled:bg-gray-700"
            onClick={handleChangePassword}
            disabled={!enabledChangePasswordBtn}
          >
            Change Password
          </button>
        </>
      )}
    </div>
  );
}