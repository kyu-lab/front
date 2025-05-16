import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("ko");

/**
 * 상대시간을 출력한다.
 * @param dateString 날짜 형태
 * @returns {string}
 */
export function formatRelativeTime(dateString) {
  const now = dayjs();
  const target = dayjs(dateString);
  const diffInSeconds = now.diff(target, 'second');

  if (diffInSeconds <= 59) {
    return 'just a moment ago';
  }

  return target.fromNow();
}

/**
 * yyyy-mm-dd HH:mm:ss 으로 포맷한다.
 * @param dateString  날짜와 시간 문자열
 * @returns {string}  포맷된 문자열
 */
export function formatDate(dateString) {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
}