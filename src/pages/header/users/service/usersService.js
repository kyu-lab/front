import customAxios from "../../../../utils/customAxios.js";
import validator from "validator/es";

const API_URL = '/users'

export async function checkEmail(email) {
  return await customAxios.get(`${API_URL}/mail/${email}/check`);
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
  return await customAxios.get(`${API_URL}/name/${name}/check`);
}

export async function signup(signUpReq) {
  return await customAxios.post(`${API_URL}/signup`, signUpReq);
}

export async function login(loginReq) {
  const response =  await customAxios.post(`${API_URL}/login`, loginReq);
  if (response.status === 200) {
    localStorage.setItem("token", response.data.token);
  }
}

export async function logout() {
  return await customAxios.post(`${API_URL}/logout`);
}

export async function existsEmail(email) {
  return await customAxios.get(`${API_URL}/mail/${email}/exists`);
}
export async function changePassword(passwordReq) {
  return await customAxios.post(`${API_URL}/change/password`, passwordReq);
}


export async function update(id, updateReq) {
  return await customAxios.put(`${API_URL}/${id}/update`, updateReq);
}
