import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
const customAxios = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// URL 체크 함수
function urlCheck(url) {
  if (!url || typeof url !== "string" || url.trim() === "") {
    throw new Error(`Please Check URL`);
  }
}

// 요청 인터셉터 (토큰 추가)
customAxios.interceptors.request.use(
  (config) => {
    urlCheck(config.url);
    const token = localStorage.getItem("token") || "";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (401 처리 및 재요청)
customAxios.interceptors.response.use((response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest.retry) {
        originalRequest.retry = true;
        await refreshAccessToken();
        return customAxios(originalRequest);
      }
      return Promise.reject(error);
    }
);

// 토큰 재발급 함수
const refreshAccessToken = async () => {
  try {
    const response = await customAxios.get("/users/refresh", {
      headers: {"X-Needs-Refresh": "true"},
    });
    debugger;
    localStorage.setItem("token", response.data.token);
  } catch (error) {
    console.error("Refresh Token Request Failed", error);
    throw error;
  }
};

export default customAxios;
