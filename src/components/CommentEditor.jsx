import userStore from "../utils/userStore.js";
import React, {useState} from "react";
import uiStore from "../utils/uiStore.js";
import {saveComment} from "../service/commentService.js";
import {alertStatus} from "../utils/enums.js";

export default function CommentEditor({postId, parentId}) {
  // 사용자 제어
  const {isLogin} = userStore(state => state);

  // 상태
  const [content, setContent] = useState(null);

  const {openAlert} = uiStore((state) => state.alert);

  const handleSaveComment = async () => {
    try {
      const request = {
        postId: postId,
        content: content,
        parentId: parentId
      }
      const response = await saveComment(request);
      if (response.status === 200) {
        openAlert({message: "댓글이 등록되었습니다.", type: alertStatus.SUCCESS});
        setContent('');
      }
    } catch (error) {
      openAlert({message: "잠시 후 다시 등록해주세요.", type: alertStatus.ERROR});
      console.error(error);
    }
  };

  return (
    <>
      {/* CommentList input */
        isLogin && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <textarea
          placeholder={`댓글을 입력하세요`}
          className="w-full p-3 outline-none text-black dark:text-white bg-white dark:bg-gray-900"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
            <div className="flex justify-between items-center px-3 py-2 ">
              <div className="flex space-x-3">
                <button>
                  <svg className="text-black dark:text-white size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" />
                  </svg>
                </button>
              </div>
              <button
                className="bg-blue-100 text-blue-500 px-4 py-1 rounded-md hover:bg-blue-200"
                onClick={handleSaveComment}
                disabled={!content}
              >
                작성
              </button>
            </div>
          </div>
        )
      }
    </>
  )
}