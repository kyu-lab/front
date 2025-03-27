const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const getFetch = async (url = null) => {
  urlCheck(url);

  url = BASE_API_URL + url;
  const response = await fetch(url, {
    headers : {
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  if (response.status >= 500) {
    throw new Error(`Server response : ${response.status}, message : ${response.statusText}`);
  }

  return response;
}

export const postFetch = async (url = null, requestData, requestCount = 0) => {
  urlCheck(url);

  if (requestCount >= 3) { // 무한 요청 방지
    throw new Error(`postFetch Error url : ${url}`);
  }

  url = BASE_API_URL + url;
  const response = await fetch(url, {
    method: "POST",
    headers : {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
    },
    credentials: 'include',
    body: JSON.stringify(requestData),
  });

  // 401일 경우 토큰 만료로 판단하고 토큰 재발급을 요청한다.
  if (response.status === 401) {
    requestCount += await tokenRequest(response, requestCount);
    return await postFetch(url, requestData, requestCount);
  }

  if (response.status >= 500) {
    throw new Error(`Server response : ${response.status}, message : ${response.statusText}`);
  }

  return response;
}

export const putFetch = async (url = null, requestData, requestCount = 0) => {
  urlCheck(url);

  if (requestCount >= 3) { // 무한 요청 방지
    throw new Error(`putFetch Error url : ${url}`);
  }

  const access = localStorage.getItem("token");
  if (access.trim() === '') {
    throw new Error(`token을 확인해주세요.`);
  }

  url = BASE_API_URL + url;
  const response = await fetch(url, {
    method: "PUT",
    headers : {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access}`
    },
    credentials: 'include',
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    requestCount += await tokenRequest(response, requestCount);
    return await putFetch(url, requestData, requestCount);
  }

  return await response.json();
}

const tokenRequest = async (response, requsetCount) => {
  const refreshUrl = response.headers.get("X-Refresh-URL");
  if (refreshUrl) {
    const refreshResponse = await fetch(BASE_API_URL + refreshUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "X-Needs-Refresh": "true",
      },
      credentials: "include",
    });
    if (refreshResponse.ok) {
      const response = await refreshResponse.json();
      localStorage.setItem("token", response.token);
      return requsetCount + 1;
    } else {
      throw new Error(`Refresh Token Rqeust Failed... status : ${response.status}, text : ${response.statusText}`);
    }
  }
}

/**
 * 요청 주소를 확인한다.
 * @param url 요청주소
 */
function urlCheck(url) {
  if (!url || typeof url !== "string" || url.trim() === "") {
    throw new Error('Please Check url');
  }
}
