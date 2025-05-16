import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {deletePost, getPosts} from "../../service/postService.js";
import Loading from "../../components/Loading.jsx";
import uiStore from "../../utils/uiStore.js";
import UserImg from "../../components/UserImg.jsx";
import {formatRelativeTime} from "../../utils/dateUtils.js";
import userStore from "../../utils/userStore.js";
import {promptStatus} from "../../utils/enums.js";
import {followUser} from "../../service/FollowService.js";
import PostInfo from "./post/PostInfo.jsx";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {ArrowUpDown, ListOrdered} from "lucide-react";

export default function Main() {
  // 목록 제어
  const savedOrder = localStorage.getItem("post-order");
  const [order, setOrder] = useState(savedOrder ? JSON.parse(savedOrder) : {id: "N", label:"최신순"});
  const [postItems, setPostItems] = useState([]);

  // 스크롤 상태 제어
  const nextCursorRef = useRef(null); // 다음 커서 관리
  const hasMoreRef = useRef(true); // 더 불러올 데이터가 있는지
  const observerRef = useRef(null);
  const loading = useRef(false);

  // ui제어
  const {isLoading, openLoading, closeLoading} = uiStore(state => state.loading);

  // 탭 데이터 배열
  const orders = [
    {id: "N", label: "최신순"},
    {id: "V", label: "조회순"},
  ];

  const changeOrder = (newOrderId) => {
    const selectedOrder = orders.find(tab => tab.id === newOrderId);
    if (selectedOrder) {
      setOrder(selectedOrder);
      localStorage.setItem("post-order", JSON.stringify(selectedOrder));
    }
  }

  useEffect(() => {
    localStorage.setItem("post-order", JSON.stringify(order));
    setPostItems([]);
    hasMoreRef.current = true;
    nextCursorRef.current = null;
    void handlePosts();
  }, [order]);

  // IntersectionObserver (스크롤 설정)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (loading.current) {
          return;
        }
        if (entries[0].isIntersecting && hasMoreRef.current) {
          void handlePosts();
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

  const handlePosts = async () => {
    if (!hasMoreRef.current || loading.current) { // 중복 조회 방지
      return;
    }
    try {
      loading.current = true;
      const response = await getPosts(nextCursorRef.current, order.id);
      if (response.postItems.length > 0) {
        setPostItems((prev) => [...prev, ...response.postItems]);
      }
      hasMoreRef.current = response.hasMore;
      nextCursorRef.current = response.nextCursor;
    } catch (error) {
      console.error(`게시글 로드 실패 : ${error}`);
      navigate('/error404');
    } finally {
      loading.current = false;
    }
  };

  return (
    <>
      {/* 정렬 헤더 */}
      <div className="mt-3 items-center flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-2xl">
              <ArrowUpDown /> {order.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className='text-center'>게시글 정렬</DropdownMenuLabel>
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
      </div>

      {/* 게시물 렌더링 */}
      {
        postItems.length > 0 && postItems.filter((item) => Object.keys(item).length > 0).length > 0 ? (
        postItems.map((e, index) => (
          <div
            key={index}
            className="py-3 px-10"
          >
            <PostInfo
              postListItemDto={e.postListItemDto}
              writerInfo={e.writerInfo}
            />
          </div>
        ))) : (
          <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)] text-gray-500 text-center px-4">
            {/* 스켈레톤이 들어가야함 */}
            <Loading />
          </div>
        )
      }

      <div ref={observerRef} className="justify-center text-gray-500 text-center p-5">
        {isLoading && <Loading />}
      </div>
    </>
  );
}
