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

  if (diffInSeconds < 30) {
    return '방금 전';
  }

  return target.fromNow();
}