import {useEffect, useState} from "react";

import {
  checkEmail,
  existsName,
  signup,
  validationEmail,
  validationName,
  validationPassword
} from "./service/usersService.js";
import uiStore from "../../../utils/uiStore.js";
import {alertStatus} from "../../../utils/enums.js";

export default function UsersSignUp({setHasPrevious, setPage}){
  // 페이지 제어
  const [step, setStep] = useState(1);
  
  // 버튼 제어
  const [emailBtnEnabled, setEmailBtnEnabled] = useState(false); // 이메일 확인 버튼
  const [signupBtnEnabled, setSignupBtnEnabled] = useState(false); // 회원가입 버튼
  
  // ui 제어
  const {openAlert} = uiStore((state) => state.alert);
  const {setOnBack} = uiStore((state) => state.dialog);

  // 회원가입 데이터 (step1)
  const [email, setEmail] = useState('');
  const [emailInfo, setEmailInfo] = useState('');
  const [isValidEmail, setIsValidEmamil] = useState(true);

  // 회원가입 데이터 (step2)
  const [name, setName] = useState('');
  const [nameInfo, setNameInfo] = useState('');
  const [isValidName, setIsValidName] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordInfo, setPasswordInfo] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(false);

  // 이메일 검증 함수
  const handleCheckEmail = async () => {
    if (!validationEmail({email, setEmailValidationError})) {
      openAlert({message: "이메일을 다시 확인해주세요", type: alertStatus.WARN});
      return;
    }

    try {
      const response = await checkEmail(email);

      if (response.status === 200) {
        setStep(2); // 이메일이 중복되지 않으면 다음 단계로
        setHasPrevious({hasPrevious: true}); // 뒤로가기 버튼 표시

        // step2 데이터 초기화
        setSignupBtnEnabled(false);
        setName('');
        setNameValidationError('');
        setPassword('');
        setPasswordValidationError('');
      }
    } catch (error) {
      if (error.response.status === 409) {
        setEmailValidationError('이미 존재하는 이메일입니다.');
        setEmailBtnEnabled(false);
      } else {
        openAlert({message: "잠시 후 다시 확인해주세요..", type: alertStatus.ERROR});
      }
    }
  };
  
  // 사용자 이름 검증 함수
  const checkName = async () => {
    try {
      const response = await existsName(name);
      if (response.status === 200) {
        setIsValidName(true);
        return true;
      }
      return false;
    } catch (error) {
      if (error.response.status === 409) {
        setNameInfo('이미 사용중인 이름입니다.');
        setIsValidName(false);
      } else {
        openAlert({message: "잠시 후 다시 확인해주세요..", type: alertStatus.ERROR});
      }
      return false;
    }
  };

  // 회원가입 처리 함수
  const handleSignUp = async () => {
    try {
      if (!validationEmail({email, setEmailValidationError})) {
        openAlert({message: "이메일을 다시 확인해주세요", type: alertStatus.WARN});
        return;
      }

      if (!validationName({name, setNameValidationError})) {
        openAlert({message: "사용자 이름을 다시 확인해주세요.", type: alertStatus.WARN});
        setSignupBtnEnabled(false);
        return;
      }

      if (!validationPassword({password, setPasswordValidationError})) {
        openAlert({message: "비밀번호를 다시 확인해주세요.", type: alertStatus.WARN});
        setSignupBtnEnabled(false);
        return;
      }

      const response = await signup({email, name, password});
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

  // 이메일 입력 이벤트
  const handleEmailInput = (e) => {
    setEmail(e.target.value);
    if (e._reactName === 'onFocus' || e._reactName === 'onChange') {
      setEmailInfo('');
      setIsValidEmamil(true);
      return;
    }

    setEmailBtnEnabled(false);
    if (validationEmail({email, setEmailValidationError})) {
      setEmailBtnEnabled(true);
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

  // 사용자 입력 이벤트
  const handleNameInput = async(e) => {
    setName(e.target.value);
    if (e._reactName === 'onFocus' || e._reactName === 'onChange') {
      setNameInfo('');
      setIsValidName(true);
      return;
    }

    setSignupBtnEnabled(false);
    if (!validationName({name, setNameValidationError})) {
      return;
    }

    const hasName = await checkName();
    if (hasName) {
      setSignupBtnEnabled(false);
      return;
    }

    if (isValidPassword) {
      setSignupBtnEnabled(true);
    }
  }

  /**
   * 이름(name)과 유효성 검증 실패시 메시지를 세팅한다.
   * @param message 알림 메시지
   */
  function setNameValidationError(message) {
    setIsValidName(false);
    setNameInfo(message)
  }

  // 패스워드 입력 이벤트
  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
    if (e._reactName === 'onFocus' || e._reactName === 'onChange') {
      setPasswordInfo('');
      setIsValidPassword(true);
      return;
    }

    setSignupBtnEnabled(false);
    if (isValidName && validationPassword({password, setPasswordValidationError})) {
      setSignupBtnEnabled(true);
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

  return (
    <div className="space-y-4">
      {/* Step 1: 이메일 입력 및 검증 */}
      {step === 1 && (
        <>
          <div className="text-2xl text-center text-black dark:text-white my-4">SignUp</div>
          <p className="text-gray-400 text-sm mb-6 text-center">
            사용하고 있는 메일을 입력해주세요
          </p>
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
              이미 회원이신가요?
            </button>
          </div>
          <button
            type="button"
            className="w-full bg-blue-600 text-white p-2 rounded-3xl hover:bg-blue-700 disabled:bg-gray-700"
            onClick={handleCheckEmail}
            disabled={!emailBtnEnabled}
          >
            Continue
          </button>
        </>
      )}

      {/* Step 2: 이름과 비밀번호 입력 */}
      {step === 2 && (
        <>
          <div className="text-2xl text-center text-black dark:text-white my-4">Signup</div>
          <p className="text-gray-400 text-sm mb-6">
            익명을 기반으로 운영되는 사이트입니다. 다른 사용자들에게는 설정한 이름으로 보여지게 됩니다.
          </p>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full p-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 text-black dark:text-white"
              placeholder="Enter your name"
              value={name}
              onChange={handleNameInput}
              onBlur={handleNameInput}
              onFocus={handleNameInput}
            />
            <p className={!isValidName ? `mt - 2 text-sm text-red-600 dark:text-red-500` : 'mt-2 text-sm text-green-600 dark:text-green-500'}>
              <span className="font-medium">{nameInfo}</span>
            </p>
          </div>
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
            onClick={handleSignUp}
            disabled={!signupBtnEnabled}
          >
            Signup
          </button>
        </>
      )}
    </div>
  );
}
