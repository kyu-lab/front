import React, { useState, useEffect } from 'react';
import {
  deletePost,
  getPost,
  toggleLike,
  tooglePostMark
} from "@/service/postService.js";
import {useNavigate, useParams} from "react-router-dom";
import Editor from "../../../components/PostEditor.jsx";
import {alertStatus, promptStatus} from "@/utils/enums.js";
import uiStore from "../../../utils/uiStore.js";
import userStore from "../../../utils/userStore.js";
import {formatDate} from "@/utils/dateUtils.js";
import CommentList from "./CommentList.jsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {
  BookmarkPlus,
  BookmarkX,
  Eraser,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Pen,
  Share,
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Button} from "@/components/ui/button.jsx";

export default function PostView() {
  // 파라미터
  const {id} = useParams();
  
  // 페이지이동
  const navigate = useNavigate();
  
  // 게시글 데이터
  const [post, setPost] = useState({});
  const [writer, setWriter] = useState({});
  const [liked, setLiked] = useState(true);
  const [bookMark, setBookMark] = useState(false);

  // 메뉴 제어
  const [isEdit, setIsEdit] = useState(false);
  
  // 사용자 제어
  const {isLogin, userInfo} = userStore(state => state);
  
  // ui 제어
  const {openAlert} = uiStore((state) => state.alert);
  const {openPrompt} = uiStore((state) => state.prompt);

  useEffect(() => {
    const handleGetPost = async () => {
      try {
        const data = await getPost(id);

        setPost(data.postInfoDto);
        setWriter(data.writerInfo);

        // 글 수정권한 및 삭제 부여
        if (userInfo.id === data.writerInfo.id) {
          setIsEdit(true);
        }

        // 좋아요 설정
        setLiked(data.postInfoDto.isLike ?? false);

        const recentPost = {
          post: {
            postId: data.postInfoDto.postId,
            subject: data.postInfoDto.subject,
            createdAt: data.postInfoDto.createdAt
          },
          writer: {
            id: data.writerInfo.id,
            name: data.writerInfo.name,
            imgUrl: data.writerInfo.imgUrl
          }
        }

        let recentPostList = JSON.parse(sessionStorage.getItem('recentPosts')) || [];
        if (recentPostList.length > 3) {
          recentPostList.shift();
        }

        if (recentPostList.length === 0) {
          recentPostList.push(recentPost);
        }

        if (!recentPostList.some(item => item.postId !== data.postInfoDto.postId)) {
          recentPostList.push(recentPost);
        }

        sessionStorage.setItem('recentPosts', JSON.stringify(recentPostList));
        
      } catch (error) {
        navigate('/error404');
      }
    }
    void handleGetPost();
  }, []);

  const handlePostShare = async () => {
    try {
      const isShare = await openPrompt({message: "게시글을 공유할까요?", type: promptStatus.INFO});
      if (isShare) {
        const url = `${window.location.origin}/post/${id}`;
        try {
          await navigator.clipboard.writeText(url);
          openAlert({message: "복사되었습니다", type: alertStatus.INFO});
        } catch (err) {
          console.error('URL 복사 실패:', err);
        }
      }
    } catch (error) {
      openAlert({message: "공유에 실패하였습니다.", type: alertStatus.ERROR});
      console.error(error);
    }
  };

  const handleTogglePostMark = async () => {
    try {
      let msg = bookMark ? '해당 게시글을 즐겨찾기에서 제거할까요?' : '해당 게시글을 즐겨찾기에 추가할까요?';
      const isBookMark = await openPrompt({message: msg, type: promptStatus.INFO});
      if (isBookMark) {
        const response = await tooglePostMark(id);
        if (response.status === 200) {
          setBookMark(response.data);
        }
      }
    } catch (error) {
      openAlert({message: "실패하였습니다.", type: alertStatus.ERROR});
      console.error(error);
    }
  };

  const handlePostUpdate = async () => {
    try {
      const isUpdate = await openPrompt({message: "게시글을 수정하시겠습니까?", type: promptStatus.INFO});
      if (isUpdate) {
        navigate(`/post/${post.postId}/update`);
      }
    } catch (error) {
      openAlert({message: "수정에 실패하였습니다.", type: alertStatus.ERROR});
      console.error(error);
    }
  };

  const handlePostDelete = async () => {
    try {
      const isDelete = await openPrompt({message: "정말로 삭제할까요?", type: promptStatus.WARN});
      if (isDelete) {
        const response = await deletePost(post.postId);
        if (!response) {
          throw new Error(`게시글 삭제 실패 ${response.status}`);
        }
        openAlert({message: "삭제되었습니다.", type: alertStatus.SUCCESS});
        navigate('/');
      }
    } catch (error) {
      openAlert({message: "삭제에 실패하였습니다.", type: alertStatus.ERROR});
      console.error(error);
    }
  };

  const handlePostLike = async () => {
    try {
      const response = await toggleLike(id);
      if (response.status === 200) {
        const isLike = response.data;
        if (isLike) {
          post.likeCount += 1;
        } else {
          post.likeCount -= 1;
        }
        setLiked(isLike);
      }
    } catch (error) {
      openAlert({message: "좋아요에 실패하였습니다.", type: alertStatus.ERROR});
      console.error(error);
    }
  }

  return (
    <div className='mx-auto p-4 my-5 bg-white dark:bg-gray-800 rounded-3xl'>
      {/* 글 헤더 */}
      <h1 className="text-3xl font-bold mb-4">{post.subject}</h1>
      <div className="flex items-center justify-between mb-4">
        <div className="flex">
          <Avatar className='mr-3'>
            <AvatarImage src={writer.imgUrl} alt="user" />
            <AvatarFallback className='bg-gray-100'>
              <User />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{writer.name}</div>
            <div className="text-sm text-gray-500 flex items-center">
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500">
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
                  <DropdownMenuItem onSelect={handlePostShare}><Share />공유</DropdownMenuItem>
                  {
                    isLogin && (
                      <DropdownMenuItem onSelect={handleTogglePostMark}>
                        {bookMark ? <><BookmarkX /> 즐겨찾기 해제</> : <><BookmarkPlus /> 즐겨찾기</>}
                      </DropdownMenuItem>
                    )
                  }
                  {
                    isEdit && (
                      <>
                        <DropdownMenuItem onSelect={handlePostUpdate}>
                          <Pen />수정
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={handlePostDelete}>
                          <Eraser />삭제
                        </DropdownMenuItem>
                      </>
                    )
                  }
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="p-1">
        <Editor
          editable={false}
          content={post.content}/>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-between items-center my-2">
        <div className="flex gap-4">
          <Button
            variant='icon'
            className={
              `flex items-center gap-1 px-3 py-2 rounded-lg hover:text-red-600 transition-colors duration-300 
              ${liked ? "text-red-500" : "text-gray-500"}`
            }
            onClick={handlePostLike}
          >
            <Heart
              size={20}
              fill={liked ? "currentColor" : "none"} />
            <span>{post.likeCount}</span>
          </Button>

          <Button
            variant='icon'
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-500">
            <MessageSquare size={20} />
            <span>{post.commentCount}</span>
          </Button>
        </div>
      </div>

      {/* 댓글 */}
      <CommentList postId={id} writerId={writer.id}/>
    </div>
  )
}
