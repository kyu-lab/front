import React, {useState, useEffect, useRef} from 'react';
import {useNavigate} from "react-router-dom";
import {getChildComments, getComments, saveComment} from "../../../service/commentService.js";
import {alertStatus} from "../../../utils/enums.js";
import uiStore from "../../../utils/uiStore.js";
import userStore from "../../../utils/userStore.js";
import UserImg from "../../../components/UserImg.jsx";
import {formatRelativeTime} from "../../../utils/dateUtils.js";
import Loading from "../../../components/Loading.jsx";
import CommentEditor from "../../../components/CommentEditor.jsx";

export default function Comment ({postId, comment, isChild = false}) {
  const {isLogin} = userStore(state => state);
  const [editorOpen, setEditorOpen] = useState(false);

  // 자식 댓글 갯수
  const [childCount, setChildCount] = useState(comment?.commentInfoDto.childCount || 0);
  const [childComment, setChildComment] = useState(comment.child || []);

  const exsitsReply = useRef(comment?.commentInfoDto.childCount - 2 > 0);
  const commentId = useRef(comment.commentInfoDto.id);

  // 댓글 로딩
  const nextCursorRef = useRef(null); // 다음 커서 관리
  const hasMoreRef = useRef(true); // 더 불러올 데이터가 있는지
  const loading = useRef(false);

  const handleGetMoreComments = async () => {
    try {
      const response = await getChildComments(postId, commentId.current, nextCursorRef.current);
      if (response.commentItems.length > 0) {
        setChildComment((prev) => {
          // 1. 댓글 목록을 합친다.
          const combinedList = [...prev, ...response.commentItems];

          // 2. 목록에서 중복되는 요소를 제거한다.
          const seen = new Set();
          return combinedList.filter(item => {
            if (seen.has(item.commentInfoDto.id)) {
              return false;
            }
            seen.add(item.commentInfoDto.id);
            return true;
          });
        });
      }
      hasMoreRef.current = response.hasMore;
      nextCursorRef.current = response.nextCursor;
      
      // 3개를 가져오면 3개 댓글 표시를 제거해야함
      if (!response.hasMore) {
        exsitsReply.current = false;
      } else {

      }
    } catch (error) {
      console.error(`댓글 로드 실패 : ${error}`);
    } finally {
      loading.current = false;
    }
  }

  return (
    <div className={`flex ${isChild ? 'py-2' : ''}`}>
      <div className="relative flex flex-col items-center mr-2 w-7">
        {/* 프로필 아이콘 */}
        <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-200">
          <UserImg imgUrl={comment.writerInfo.imgUrl} />
        </div>

        {childCount > 0 &&
          <div className="flex-1 w-px bg-gray-300 dark:bg-gray-700" />
        }
        {isChild &&
          <div
            className="absolute top-4 left-0 w-6 h-px bg-gray-300 dark:bg-gray-700"
            style={{ transform: 'translateX(-100%)' }}
          />
        }
      </div>

      {/* ── 댓글 본문 ── */}
      <div className="flex-1">
        <div className="text-sm font-semibold text-gray-800 dark:text-white">
          {comment.writerInfo.name}
          <span className="text-xs text-gray-500 ml-2">
            {formatRelativeTime(comment.commentInfoDto.createdAt)}
          </span>
        </div>

        <div className="text-sm py-1.5 text-gray-900 dark:text-gray-200 whitespace-pre-line">
          {comment.commentInfoDto.content}
        </div>

        {isLogin && (
          <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
            <button className="hover:underline">like</button>
            <button onClick={() => setEditorOpen(isOpen => !isOpen)} className="hover:underline">
              Reply
            </button>
          </div>
        )}

        {/* 리플 에디터 */}
        {editorOpen && (
          <div className="mt-2">
            <CommentEditor postId={postId} parentId={comment.commentInfoDto.id} />
          </div>
        )}

        {/* 대댓글 “댓글 더보기” 버튼 표시 */}
        {childCount > 0 && (
          <div className="mt-2">
            {childComment.map((child, index) => (
              <Comment key={index} postId={postId} comment={child} isChild={true} />
            ))}

            {/* 대댓글 버튼 표시 */}
            {/*{isChild && childCount - 1 > 0 &&*/}
            {/*<>*/}
            {/*  <button className="text-xs text-blue-500 hover:underline mt-2">*/}
            {/*    {childCount - 1}개 댓글 더보기*/}
            {/*  </button>*/}
            {/*  <div*/}
            {/*    className="absolute top-4 left-0 w-6 h-px bg-gray-300 dark:bg-gray-700"*/}
            {/*    style={{ transform: 'translateX(-100%)' }}*/}
            {/*  />*/}
            {/*</>*/}
            {/*}*/}
          </div>
        )}

        {/* 최상위 댓글 “댓글 더보기” 버튼 표시 */}
        {(exsitsReply.current) && (
          <button
            onClick={handleGetMoreComments}
            className="relative flex items-center mr-2"
          >
            <div
              className="absolute top-4 left-0 w-6 h-px bg-gray-300 dark:bg-gray-700"
              style={{transform: 'translateX(-100%)'}}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6 text-black dark:text-white">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <span className="px-1">{childCount - 2}개 댓글 더보기</span>
          </button>
        )}
      </div>
    </div>
  );
};
