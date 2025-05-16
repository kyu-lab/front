import React, { useEffect, useState } from 'react';
import {deleteNotices} from "@/service/noticesService.js";
import {Link, useNavigate} from "react-router-dom";
import {formatRelativeTime} from "@/utils/dateUtils.js";
import noticesStore from "../../../utils/noticesStore.js";
import {Settings} from "lucide-react";

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
      <div className="flex justify-between items-center border-b border-gray-700">
        <h2 className="text-base font-medium dark:text-gray-300 text-dark">알림</h2>
        <div className="flex gap-2">
          <Link
            className="dark:text-gray-300 hover:bg-gray-200 rounded-lg"
            to={"/user/settings/notice"}
          >
            <Settings />
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
