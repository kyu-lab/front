import React, {useState, useEffect, useRef} from 'react';
import {useNavigate} from "react-router-dom";
import {getComments} from "@/service/commentService.js";
import Comment from "./Comment.jsx";
import CommentEditor from "../../../components/CommentEditor.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Button} from "@/components/ui/button.jsx";
import {ArrowUpDown, RotateCcw} from "lucide-react";
import userStore from "@/utils/userStore.js";
import {Skeleton} from "@/components/ui/skeleton.jsx";

export default function CommentList({postId, writerId}) {
  // 페이지이동
  const navigate = useNavigate();
  
  // 조회 데이터
  const [order, setOrder] = useState({id: "N", label:"최신순"});
  const [comments, setComments] = useState([]);

  // 스크롤 상태 제어
  const nextCursorRef = useRef(null); // 다음 커서 관리
  const hasMoreRef = useRef(true); // 더 불러올 데이터가 있는지
  const observerRef = useRef(null);
  const loading = useRef(false);

  // 사용자 제어
  const {isLogin} = userStore(state => state);

  // 탭 데이터 배열
  const orders = [
    {id: "N", label: "최신순"},
    {id: "O", label: "오래된순"},
  ];

  useEffect(() => {
    hasMoreRef.current = true;
    nextCursorRef.current = null;
    void handleGetComments();
  }, [order]);

  const handleGetComments = async () => {
    try {
      loading.current = true;
      const response = await getComments(postId, nextCursorRef.current, order.id);
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

  const changeOrder = (newOrderId) => {
    const selectedOrder = orders.find(tab => tab.id === newOrderId);
    if (selectedOrder) {
      setOrder(selectedOrder);
    }
  }

  const refreshList = async () => {
    hasMoreRef.current = true;
    nextCursorRef.current = null;
    setComments([]);
    void handleGetComments();
  }

  return (
    <div>
      {isLogin && <CommentEditor refreshList={refreshList} postId={postId} parentId={null} />}
      <div className='flex py-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="icon">
              <ArrowUpDown /> {order.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>댓글 목록 정렬</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={order.id} onValueChange={changeOrder}>
              {orders.map((tab, index) => (
                <DropdownMenuRadioItem key={index} value={tab.id}>
                  {tab.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant='icon' onClick={refreshList}>
          <RotateCcw />새로고침
        </Button>
      </div>

      {/* comment */}
      {comments.length > 0 && (
        comments.map((comment, index) =>  (
          <div key={index} className="mx-auto mt-2 text-sm">
            <Comment postId={postId} writerId={writerId} comment={comment} refreshList={refreshList} />
          </div>
        ))
      )}

      {(loading.current && comments.length > 0) &&
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>}

      {(!loading.current && comments.length === 0) &&
        <div className="flex items-center justify-center h-full text-gray-500 text-center px-4">
          첫 댓글을 작성해보세요.
        </div>}
    </div>
  )
}
