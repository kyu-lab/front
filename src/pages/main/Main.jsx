import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {getPosts} from "../../service/postService.js";
import Loading from "../../components/Loading.jsx";
import uiStore from "../../utils/uiStore.js";
import UserImg from "../../components/UserImg.jsx";
import {formatRelativeTime} from "../../utils/dateUtils.js";

export default function Main() {
  // 페이지 정렬 기준
  const [order, setOrder] = useState(localStorage.getItem("order") || "N");

  // 사용자 데이터
  const [postSummaryList, setPostSummaryList] = useState([]);

  // 스크롤 상태 제어
  const nextCursorRef = useRef(null); // 다음 커서 관리
  const hasMoreRef = useRef(true); // 더 불러올 데이터가 있는지
  const observerRef = useRef(null);

  // ui제어
  const {isLoading, openLoading, closeLoading} = uiStore(state => state.loading);

  // 탭 데이터 배열
  const tabs = [
    {id: "N", label: "최신순"},
    {id: "V", label: "조회순"},
    // 필요하면 더 추가 가능
  ];

  // 탭 변경시 게시글 목록을 다시 호출함
  useEffect(() => {
    localStorage.setItem("post-order", order);
    hasMoreRef.current = true;
    setPostSummaryList([]);
    nextCursorRef.current = null;
    void handlePosts();
  }, [order]);

  // IntersectionObserver (스크롤 설정)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isLoading) {
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
    if (!hasMoreRef.current || isLoading) { // 중복 조회 방지
      return;
    }
    try {
      const response = await getPosts(nextCursorRef.current, order);
      setPostSummaryList((prev) => [...prev, ...response.postSummaryList]);
      hasMoreRef.current = response.hasMore;
      nextCursorRef.current = response.nextCursor;
    } catch (error) {
      console.error(`게시글 로드 실패 : ${error}`);
    } finally {
    }
  };

  return (
    <>
      {/* 정렬 헤더 */}
      <div className="border-b border-gray-700 flex items-center">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-3 text-sm font-medium dark:text-white ${
                order === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setOrder(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 게시물 렌더링 */}
      {
        postSummaryList.length > 0 && postSummaryList.filter((item) => Object.keys(item).length > 0).length > 0 ? (
        postSummaryList
          .map((e, index) => (
            <div
              key={index}
              className="py-3"
            >
              <Link to={`/post/${e.postId}`}>
                <PostInfo
                  userInfo={e.usersInfo}
                  createdAt={e.createdAt}
                  subject={e.subject}
                  summary={e.summary}
                  postViewCount={e.postViewCount}
                  commentCount={e.commentCount}
                />
              </Link>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)] text-gray-500 text-center px-4">
            {/* 스켈레톤이 들어가야함 */}
            <Loading />
          </div>
        )
      }

      <div ref={observerRef} className="flex items-center justify-center h-full text-gray-500 text-center px-4">
        {(postSummaryList.length > 0 && hasMoreRef) && <p>마지막 게시글입니다.</p>}
        {isLoading && <Loading />}
      </div>
    </>
  );
}

const PostInfo = ({userInfo, subject, createdAt, summary, postViewCount, commentCount}) => {
  return (
    <div className="p-6 shadow rounded-2xl bg-white dark:bg-gray-800">
      <div className="flex space-x-3">
        {/* 작성자 이미지 */}
        <div className="flex-shrink-0">
          <UserImg imgUrl={userInfo.imgUrl} />
        </div>
        <div className="min-w-0 flex-1">
          {/* 게시글 작성자 및 작성 시간 */}
          <div className="flex items-center space-x-1">
            <span className="font-bold text-gray-900 dark:text-white">{userInfo.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-bold text-gray-900 dark:text-white">{formatRelativeTime(createdAt)}</span>
          </div>
          
          {/* 제목 */}
          <h1 className="font-bold text-gray-900 text-xl dark:text-white mt-2">{subject}</h1>
          
          {/* 요악 본문 */}
          {summary && <p className="text-gray-900 dark:text-white mt-4">{summary}</p>}
          
          {/* 구분선 */}
          <div className="mt-2 rounded-xl overflow-hidden border border-gray-200" />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-1 text-gray-500">
              <button className="p-1 rounded-full">
                <svg className="h-5 w-5 hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <span className="text-sm">{commentCount}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <button
                className="p-1 rounded-full"
                onClick={e => {
                  e.preventDefault();
                  alert('기능 미구현');
                }}
              >
                <svg className="h-5 w-5 hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
