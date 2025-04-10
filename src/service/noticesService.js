import customAxios from "../utils/customAxios.js";
import noticesStore from "../utils/noticesStore.js";

const NOTICES_API_URL = import.meta.env.VITE_NOTICES_API_URL + "/notices";
const USE_NOTICES = import.meta.env.VITE_USE_NOTICES_SERVICE;

// 알림 서비스와 연결
let eventSource;
export function setUpNoticesServer(userId) {
  function connect() {
    eventSource = new EventSource(`${NOTICES_API_URL}/subscribe/${userId}`);
    eventSource.onopen = function() {
      console.log('Notices connection succeses');
    };

    eventSource.addEventListener('ping', () => {
      // 하트비트, 운영환경에서 사용 X
    });

    // 알림 서비스
    eventSource.addEventListener('notices', (event) => {
      const data = JSON.parse(event.data);
      console.log('알림발송됨');
      noticesStore.getState().addNotice(data);
    });

    eventSource.onerror = function() {
      eventSource.close();
      setTimeout(connect, 30000); // 30초 후 재연결 시도
      console.error('Notices error, reconnecting...');
    };
  }

  if (USE_NOTICES === 'true') {
    connect();
  }
}

export function closeEventSource() {
  if (eventSource !== null && eventSource !== undefined) {
    eventSource.close();
    console.log("Notices close...");
  }
}

export async function getPastNotices(userId) {
  return await customAxios.get(`${NOTICES_API_URL}/${userId}`);
}

export async function deleteNotices(noticesId) {
  return await customAxios.delete(`${NOTICES_API_URL}/read/${noticesId}/notices`);
}
