const GATE_WAY_URL = import.meta.env.VITE_GATE_WAY_URL;

const defaultFetch = async (url, method, requestData, request = 0) => {
  try {
    if (request > 3) { // 무한 요청 방지
      throw new Error(`Rqeust Failed...`);
    }
    const token = localStorage.getItem("token") || "";
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(requestData),
    });

    debugger;
    if (!response.ok) {
      if (response.status === 401) {
        const refreshUrl = response.headers.get("X-Refresh-URL");
        if (refreshUrl) {
          const refreshResponse = await fetch(GATE_WAY_URL + refreshUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "X-refresh-check": 'true',
            }
          });
          if (refreshResponse.ok) {
            const tokenResponse = await refreshResponse.json();
            localStorage.setItem("token", tokenResponse.data.token);
            return defaultFetch(url, method, requestData, request + 1); // 재요청한다.
          } else {
            throw new Error(`Refresh Token Rqeust Failed... status : ${response.status}, text : ${response.statusText}`);
          }
        } else {
          throw new Error(`Refresh Faild... status : ${response.status}, text : ${response.statusText}`);
        }
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error during Request:", error);
    throw error;
  }
}

export default defaultFetch;