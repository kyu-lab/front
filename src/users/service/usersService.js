const API_URL = import.meta.env.VITE_USERS_API_URL;

const defaultFetch = async (url, method, requestData) => {
  try {
    const response = await fetch(API_URL + url, {
      method,
      headers: {
        "Content-Type": "application/json",
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
    return defaultFetch("/sign-up", "POST", signUpReq);
  } catch (error) {
    console.error("Error during Request:", error);
  }
}