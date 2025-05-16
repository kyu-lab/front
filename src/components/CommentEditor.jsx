import React, {useState} from "react";
import uiStore from "../utils/uiStore.js";
import {saveComment} from "../service/commentService.js";
import {alertStatus} from "../utils/enums.js";

export default function CommentEditor({postId, parentId, refreshList}) {
  // 상태
  const [content, setContent] = useState('');

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
        await refreshList();
      }
    } catch (error) {
      openAlert({message: "잠시 후 다시 등록해주세요.", type: alertStatus.ERROR});
      console.error(error);
    }
  };

  return (
    <div className="overflow-hidden">
      <textarea
        placeholder={`댓글을 입력하세요`}
        className="w-full p-3 border border-gray-300 rounded-lg focus:border-transparent transition-all duration-200 min-h-[80px] resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-between items-center py-1">
        <div className="flex space-x-3" />
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