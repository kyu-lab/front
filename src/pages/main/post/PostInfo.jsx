import React, {useState} from "react";
import userStore from "../../../utils/userStore.js";
import uiStore from "../../../utils/uiStore.js";
import {alertStatus, promptStatus} from "../../../utils/enums.js";

import {followUser, unFollowUser} from "../../../service/FollowService.js";
import UserImg from "../../../components/UserImg.jsx";
import {formatRelativeTime} from "../../../utils/dateUtils.js";

export default function PostInfo({writerInfo, subject, createdAt, summary, postViewCount, commentCount}) {
  // 사용자
  const {isLogin, userInfo} = userStore(state => state);
  const isOwnPost = isLogin && userInfo.id === writerInfo.id; // 본인 게시글 체크

  // ui 제어
  const {openAlert} = uiStore((state) => state.alert);
  const {openPrompt} = uiStore((state) => state.prompt);

  // 상태관리
  const [isFollow, setIsFollow] = useState(writerInfo.isFollow === 1); // 1 = 구독, 0 = 비구독

  const handleUserFollow = async (writerInfo) => {
    try {
      const isFollow = await openPrompt({message: `${writerInfo.name}을 구독 할까요?`, type: promptStatus.INFO});
      if (isFollow) {
        const response = await followUser(writerInfo.id);
        if (response.status === 200) {
          openAlert({message: "구독하였습니다.", type: alertStatus.SUCCESS});
          setIsFollow(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleUserUnFollow = async (writerInfo) => {
    try {
      const isUnFollow = await openPrompt({message: `${writerInfo.name}을 구독 해지 하시겠습니까?`, type: promptStatus.WARN});
      if (isUnFollow) {
        const response = await unFollowUser(writerInfo.id);
        if (response.status === 200) {
          openAlert({message: "구독 해지하였습니다.", type: alertStatus.SUCCESS});
          setIsFollow(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="max-w-2xl px-6 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
      {/* 헤드라인 */}
      <div className="flex items-center justify-between">
        <div className="mt-4">
          <div className="flex items-center">
            <div className="flex items-center">
              <UserImg imgUrl={writerInfo.imgUrl} />
              <div
                className="mx-2 font-semibold text-gray-700 dark:text-gray-200"
                tabIndex="0"
                role="link">{writerInfo.name}
              </div>
            </div>
            <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">{formatRelativeTime(createdAt)}</span>
          </div>
        </div>
        {(isLogin && !isOwnPost) &&
          <button
          onClick={(e) => {
              e.preventDefault();
              if (isFollow) {
                void handleUserUnFollow(writerInfo);
              } else {
                void handleUserFollow(writerInfo);
              }
            }}
            className="px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform bg-gray-600 rounded cursor-pointer hover:bg-gray-500"
          >
            {isFollow ? "unFollow" : "Follow"}
          </button>
        }
      </div>

      <div className="max-w-2xl overflow-hidden bg-white dark:bg-gray-800">
        <div className="px-1.5 py-3">
            <span className="block mt-2 text-xl font-semibold text-gray-800 transition-colors duration-300 transform dark:text-white hover:text-gray-600">
              {subject}
            </span>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {summary}
          </p>
        </div>
      </div>

      {/* 댓글 */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-1 text-gray-500">
          <button className="p-1 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <span className="text-sm">{postViewCount}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-500">
          <button className="p-1 rounded-full">
            <svg
              className="h-5 w-5 hover:text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <span className="text-sm">{commentCount}</span>
        </div>
      </div>
    </div>
  );
}