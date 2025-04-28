import React, { useEffect, useState } from 'react';
import {deleteNotices} from "../../../service/noticesService.js";
import {Link, useNavigate} from "react-router-dom";
import {formatRelativeTime} from "../../../utils/dateUtils.js";
import noticesStore from "../../../utils/noticesStore.js";

export default function Notices() {
  // 페이지 이동
  const navigate = useNavigate();

  // 컴포넌트 데이터
  const [noticesList, setNoticesList] = useState([]);

  // 알림 데이터
  const {notices} = noticesStore(state => state);

  // 컴포넌트 진입시 세팅
  useEffect(() => {
    setNoticesList(notices);
  }, []);

  const handleNotices = async (notice) => {
    try {
      const response = await deleteNotices(notice.id);
      if (response.status === 200) {
        if (notice.type === 'P') {
          navigate(`/post/${notice.postId}`);
        }
      }
    } catch (error) {
      console.error(`서버 통신 실패 : ${error.statusMessage}`);
      navigate('/error500');
    }
  }

  return (
    <div
      className="absolute end-16 z-10 mt-0.5 w-96 rounded-md dark:bg-gray-800 bg-white shadow-lg"
      role="menu"
    >
      {/* 헤더 */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
        <h2 className="text-base font-medium dark:text-gray-300 text-dark">알림</h2>
        <div className="flex gap-2">
          <Link
            className="dark:text-gray-300 hover:bg-gray-200 rounded-lg"
            to={"/user/settings/notice"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5 text-black dark:text-blue-100"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </Link>
        </div>
      </div>

      {/* 알림이 없을 때 */}
      <div className="max-h-80 overflow-y-auto">
      {notices.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm dark:text-gray-300">알림이 없습니다..</p>
        </div>
      ) : (
        /* 알림 목록 */
        <div className="p-2">
          {noticesList.map((notice) => (
            <div
              key={notice.id}
              className=" rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
              role="menuitem"
              onClick={() => handleNotices(notice)}
            >
              <span className="text-sm">{notice.username}님이 새 글을 올렸습니다.</span>
              <p>
                <span className="text-sm">{notice.subject}</span>
                <span className="text-right text-sm">{formatRelativeTime(notice.noticesAt)}</span>
              </p>
            </div>
          ))}
        </div>
      )}
      </div>
      <div className="py-2 text-center border-t border-gray-700">
        <Link to="/notices" className="text-blue-400 text-sm hover:underline">
          더 보기
        </Link>
      </div>
    </div>
  );
};
