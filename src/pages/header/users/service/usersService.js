const API_URL = import.meta.env.VITE_USERS_API_URL;

const defaultFetch = async (url, method, requestData) => {
  try {
    const response = await fetch(API_URL + url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Rqeust Failed... status : ${response.status}, text : ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error during Request:", error);
    throw error;
  }
}

export async function login(loginReq) {
  try {
    return defaultFetch("/login", "POST", loginReq);
  } catch (error) {
    console.error("Error during Request:", error);
  }
}

export async function signUp(signUpReq) {
  try {
    return defaultFetch("/signUp", "POST", signUpReq);
  } catch (error) {
    console.error("Error during Request:", error);
  }
}

// todo : 토큰 제거 로직 필요
export async function logOut(id) {
  try {
    return defaultFetch("/logOut", "POST", id);
  } catch (error) {
    console.error("Error during Request:", error);
  }
}

export async function update(id, updateReq) {
  try {
    return defaultFetch(`/${id}/update`, "PUT", updateReq);
  } catch (error) {
    console.error("Error during Request:", error);
  }
}

export async function test() {
  try {
    return defaultFetch(`/test`, "POST", null);
  } catch (error) {
    console.error("Error during Request:", error);
  }
}
