import {getFetch, postFetch, putFetch} from "../../../../utils/fetchService.js";
import validator from "validator/es";

const API_URL = import.meta.env.VITE_USERS_API_URL;

export async function existsEmail(email) {
  try {
    const response = getFetch(`${API_URL}/mail/${email}/check`);
    return (await response).json();
  } catch (error) {
    throw new Error(`메일 확인 실패: ${error}`);
  }
}

/**
 * 이메일 검증을 한다.
 * @param email 입력한 이메일
 * @param setEmailValidationError 이메일 유효성 스테이트 세팅
 * @returns {boolean} 유효성 검증 결과, true = 통과
 */
export function validationEmail({email, setEmailValidationError}) {
  if (email.trim() === '') {
    setEmailValidationError('이메일을 입력해주세요.');
    return false;
  }

  if (!validator.isLength(email, {max: 100})) {
    setEmailValidationError('100 글자 이하인 이메일을 입력해주세요.');
    return false;
  }

  if (!validator.isEmail(email)) {
    setEmailValidationError('유효하지 않는 이메일입니다.');
    return false;
  }

  return true;
}

/**
 * 이름 검증한다.
 * @param name 입력한 사용자 이름
 * @param setNameValidationError 사용자 이름 유효성 스테이트 세팅
 * @returns {boolean} 유효성 검증 결과, true = 통과
 */
export function validationName({name, setNameValidationError}) {
  if (name.trim() === '') {
    setNameValidationError('이름을 입력해주세요');
    return false;
  }

  if (validator.isNumeric(name)) {
    setNameValidationError('숫자만으로 구성할 수 없습니다.');
    return false;
  }

  if (!validator.isLength(name, {min: 3, max: 30})) {
    setNameValidationError('3글자에서 30글자로 입력해주세요');
    return false;
  }

  if (!validator.matches(name, /^[a-zA-Z0-9_-]+$/)) {
    setNameValidationError('영어, 숫자, _, -만 허용됩니다.');
    return false;
  }

  return true;
}

/**
 * 비밀번호를 검증한다.
 * @param password 입력한 비밀번호
 * @param setPasswordValidationError 비밀번호 유효성 스테이트 세팅
 * @returns {boolean} 유효성 검증 결과, true = 통과
 */
export function validationPassword({password, setPasswordValidationError}) {
  if (password.trim() === '') {
    setPasswordValidationError('비밀번호 입력은 필수입니다.');
    return false;
  }

  if (!validator.isLength(password, {min: 8, max: 100})) {
    setPasswordValidationError('비밀번호는 8 ~ 100 자 사이여야 합니다.');
    return false;
  }

  return true;
}

export async function existsName(name) {
  try {
    const response = getFetch(`${API_URL}/name/${name}/check`);
    return (await response).json();
  } catch (error) {
    throw new Error(`사용자 이름 확인 실패: ${error}`);
  }
}

export async function login(loginReq) {
  try {
    const response =  await postFetch(`${API_URL}/login`, loginReq);
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    localStorage.setItem("token", data.token);
    return true;
  } catch (error) {
    throw new Error(`로그인 실패: ${error}`);
  }
}

export async function signup(signUpReq) {
  try {
    const response = await postFetch(`${API_URL}/signup`, signUpReq);
    return await response.json();
  } catch (error) {
    throw new Error(`회원가입 실패: ${error}`);
  }
}

export async function logout(id) {
  try {
    const response = await postFetch(`${API_URL}/logout`, id);
    const data = await response.json();
    return data.isOk;
  } catch (error) {
    throw new Error(`로그아웃 실패: ${error}`);
  }
}

export async function update(id, updateReq) {
  try {
    return putFetch(`${API_URL}/${id}/update`, updateReq);
  } catch (error) {
    throw new Error(`사용자 업데이트 실패: ${error}`);
  }
}
