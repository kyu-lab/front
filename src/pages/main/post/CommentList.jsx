import React, {useState, useEffect, useRef} from 'react';
import {useNavigate} from "react-router-dom";
import {getComments} from "../../../service/commentService.js";
import uiStore from "../../../utils/uiStore.js";
import Loading from "../../../components/Loading.jsx";
import Comment from "./Comment.jsx";
import CommentEditor from "../../../components/CommentEditor.jsx";

export default function CommentList({postId}) {
  // 페이지이동
  const navigate = useNavigate();
  
  // 조회 데이터
  const [order, setOrder] = useState("N");
  const [comments, setComments] = useState([]);

  // 메뉴 제어
  const [isShowCommentMenu, setIsShowCommentMenu] = useState(false);

  // ui 제어
  const menuRef = useRef(null);
  const {isLoading, openLoading, closeLoading} = uiStore(state => state.loading);
  const {openPrompt} = uiStore((state) => state.prompt);

  // 스크롤 상태 제어
  const nextCursorRef = useRef(null); // 다음 커서 관리
  const hasMoreRef = useRef(true); // 더 불러올 데이터가 있는지
  const observerRef = useRef(null);
  const loading = useRef(false);

  // 탭 데이터 배열
  const tabs = [
    {id: "N", label: "최신순"},
    {id: "O", label: "오래된순"},
    // 필요하면 더 추가 가능
  ];

  useEffect(() => {
    hasMoreRef.current = true;
    nextCursorRef.current = null;
    void handleGetComments();
  }, [order]);

  const handleGetComments = async () => {
    try {
      const response = await getComments(postId, nextCursorRef.current, order);
      if (response.commentItems.length > 0) {
        setComments((prev) => {
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
    } catch (error) {
      console.error(`댓글 로드 실패 : ${error}`);
      navigate('/error404');
    } finally {
      loading.current = false;
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (loading.current) {
          return;
        }
        if (entries[0].isIntersecting && hasMoreRef.current) {
          void handleGetComments();
        }
      },
      {
        threshold: 0.1
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, []);

  return (
    <>
    {/* Comments section */}
    <div className="p-4">
      <div>
        <CommentEditor postId={postId} parentId={null} />

        <button
          className="flex items-center mb-3 text-sm text-gray-500"
          onClick={() => setIsShowCommentMenu(!isShowCommentMenu)}
        >
          <span className="text-black dark:text-white">전체 댓글 [개수]</span>
          <span className="ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-360 280-560h400L480-360Z"/></svg>
          </span>
        </button>

        {isShowCommentMenu && (
          <div
            ref={menuRef}
            className="absolute mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20"
          >
            <button className="block w-full text-left px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <span>최신순</span>
            </button>
            <button className="block w-full text-left px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <span>오래된순</span>
            </button>
          </div>
        )
        }

        {/* comment */}
        <>
        {comments.length > 0 ? (
          comments.map((comment, index) =>  (
            <div key={index} className="mx-auto mt-2 p-4 text-sm bg-white dark:bg-gray-900 rounded-xl">
              <Comment postId={postId} comment={comment} />
            </div>
          ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-center px-4">
              댓글이 없습니다.
            </div>
          )
        }
        </>
        <div ref={observerRef} className="justify-center text-gray-500 text-center mt-5">
          {(comments.length > 0 && hasMoreRef) && <p>마지막 댓글입니다.</p>}
          {isLoading && <Loading />}
        </div>
      </div>
    </div>
    </>
  )
}
