import {Link} from "react-router-dom";
import React from "react";
import noticesStore from "../../../utils/noticesStore.js";
import {formatRelativeTime} from "../../../utils/dateUtils.js";

export default function NoticesView() {

  const {notices} = noticesStore(state => state);

  return (
    <>
      <div className="flex justify-between items-center px-4 border-b border-gray-700">
        <h2 className="text-base font-medium dark:text-gray-300 text-black">알림</h2>
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

      {notices.length === 0 ? (
        <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)] text-center px-4">
          <p className="text-black dark:text-gray-300">알림이 없습니다..</p>
        </div>
      ) : (
        /* 알림 목록 */
        <div className="p-2">
          {notices.map((notice) => (
              <div
                  key={notice.id}
                  className=" rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                  role="menuitem"
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
    </>
  )
}
