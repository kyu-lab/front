import defaultFetch from "../../../../common/defaultFetch.js";

const API_URL = import.meta.env.VITE_USERS_API_URL;

export async function login(loginReq) {
  try {
    return defaultFetch(`${API_URL}/login`, "POST", loginReq);
  } catch (error) {
    console.error("Error during Request:", error);
  }
}

export async function signUp(signUpReq) {
  try {
    return defaultFetch(`${API_URL}/signUp`, "POST", signUpReq);
  } catch (error) {
    console.error("Error during Request:", error);
  }
}

export async function logout(id) {
  try {
    return defaultFetch(`${API_URL}/logout`, "POST", id);
  } catch (error) {
    console.error("Error during Request:", error);
  }
}

export async function update(id, updateReq) {
  try {
    return defaultFetch(`${API_URL}/${id}/update`, "PUT", updateReq);
  } catch (error) {
    console.error("Error during Request:", error);
  }
}

export async function test() {
  try {
    return defaultFetch(`${API_URL}/test`, "POST", null);
  } catch (error) {
    console.error("Error during Request:", error);
  }
}
