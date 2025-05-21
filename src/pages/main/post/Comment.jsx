import React, {useState, useEffect, useRef} from 'react';
import {useNavigate} from "react-router-dom";
import {getChildComments, getComments, saveComment, toggleLike} from "../../../service/commentService.js";
import {alertStatus} from "../../../utils/enums.js";
import uiStore from "../../../utils/uiStore.js";
import userStore from "../../../utils/userStore.js";
import UserImg from "../../../components/UserImg.jsx";
import {formatRelativeTime} from "../../../utils/dateUtils.js";
import Loading from "../../../components/Loading.jsx";
import CommentEditor from "../../../components/CommentEditor.jsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {
  BookMarked,
  CirclePlus,
  Eraser,
  EyeOff,
  Flag,
  MoreHorizontal,
  Pen,
  Reply,
  Share,
  ThumbsUp,
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Button} from "@/components/ui/button.jsx";

export default function Comment ({postId, writerId, refreshList, comment, isChild = false}) {
  const {isLogin, userInfo} = userStore(state => state);
  const [editorOpen, setEditorOpen] = useState(false);

  // 자식 댓글 갯수
  const [childCount, setChildCount] = useState(comment.commentInfoDto.childCount || 0);
  const [childComment, setChildComment] = useState(comment.child || []);
  const [likeCount, setLikeCount] = useState(comment.commentInfoDto.likeCount || 0);
  const [isLike, setIsLike] = useState(comment.commentInfoDto.isLike);

  const exsitsReply = useRef(comment.commentInfoDto.childCount - 2 > 0);
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

  const handleCommentLike = async () => {
    try {
      if (!isLogin) {
        return;
      }
      const response = await toggleLike(comment.commentInfoDto.id);
      if (response.status === 200) {
        const isLike = response.data;
        if (isLike) {
          setLikeCount(likeCount + 1);
        } else {
          setLikeCount(likeCount - 1);
        }
        setIsLike(isLike);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={`flex ${isChild ? 'py-2' : 'space-y-3'}`}>
      <div className="flex items-start mr-2">
        {/* 프로필 아이콘 */}
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.writerInfo.imgUrl} alt="user" />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      </div>

      {/* ── 댓글 본문 ── */}
      <div className="flex-1">
        <div className="rounded-2xl bg-gray-100 dark:bg-gray-900">
          <div className="flex justify-between items-center mb-2 px-5">
            <div className="flex items-center space-x-2">
              <span className="font-bold">{comment.writerInfo.name}</span>
              {
                writerId === comment.writerInfo.id &&
                <span className="bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded-full">작성자</span>
              }
              <span className="text-xs text-gray-500">{formatRelativeTime(comment.commentInfoDto.createdAt)}</span>
            </div>
            <div className="relative">
              <div className="p-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-label="더보기"
                      className="p-2 hover:bg-gray-200 hover:dark:bg-gray-600 rounded-full transition-colors duration-200"
                      variant="icon">
                      <MoreHorizontal size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>더보기</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup >
                      {writerId === userInfo.id && (
                        <>
                          <DropdownMenuItem>
                            <Pen className="h-4 w-4"/>
                            <span>수정하기</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eraser className="h-4 w-4"/>
                            <span>삭제하기</span>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem>
                        <Flag /> 신고
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <EyeOff /> 숨기기
                      </DropdownMenuItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="text-gray-800 px-5 dark:text-gray-200">
            {comment.commentInfoDto.content}
          </div>
          <div className="flex mt-2 px-1">
            <Button
              variant="icon"
              className={`
                flex items-center space-x-0.5 hover:text-blue-500 transition-colors duration-200
                ${isLike ? "text-blue-500" : "text-gray-500"}
                ${isLogin ? "cursor-pointer" : "cursor-default"}
              `}
              onClick={handleCommentLike}
            >
              <ThumbsUp fill={isLike ? "currentColor" : "none"}/>
              <span>{likeCount}</span>
            </Button>
            {isLogin &&
              <Button
                onClick={() => setEditorOpen(isOpen => !isOpen)}
                variant="icon"
                className="hover:text-primary-600 transition-colors duration-200 cursor-pointer">
                <Reply /> 답장
              </Button>
            }
          </div>
        </div>

        {/* 리플 에디터 */}
        {editorOpen && (
          <div className="mt-2">
            <CommentEditor refreshList={refreshList} postId={postId} parentId={comment.commentInfoDto.id} />
          </div>
        )}

        {/* 대댓글 “댓글 더보기” 버튼 표시 */}
        {childCount > 0 && (
          <>
            {childComment.map((child, index) => (
              <Comment refreshList={refreshList} key={index} postId={postId} comment={child} isChild={true} />
            ))}
          </>
        )}

        {/* 최상위 댓글 “댓글 더보기” 버튼 표시 */}
        {(exsitsReply.current) && (
          <Button variant={'icon'} onClick={handleGetMoreComments}>
            <CirclePlus size={15} />
            <span className="px-1">{childCount - 2}개 댓글 더보기</span>
          </Button>
        )}
      </div>
    </div>
  );
};

