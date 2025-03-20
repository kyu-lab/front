import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";

import {getPosts} from "./post/service/postService.js";

export default function Main() {
  const [postSummaryList, setPostSummaryList] = useState([]);

  // 스크롤 상태 제어
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState(null); // 다음 커서 관리
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지
  const observerRef = useRef(null);

  // 초기 데이터
  useEffect(() => {
    handlePosts(null);
  }, []);

  // IntersectionObserver (스크롤 설정)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          handlePosts(nextCursor);
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
  }, [loading, nextCursor, hasMore]);

  const handlePosts = async (cursor) => {
    if (!hasMore || loading) { // 중복 조회 방지
      return;
    }
    try {
      setLoading(true);
      const response = await getPosts(cursor);
      setPostSummaryList((prev) => [...prev, ...response.data.postSummaryList]);
      setHasMore(response.data.hasMore);
      setNextCursor(response.data.nextCursor);
    } catch (error) {
      console.error("게시글 로드 실패 : ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="border-b border-gray-700 flex items-center px-4">
        <div className="flex">
          <button className="px-4 py-3 text-sm font-medium text-blue-400 border-b-2 border-blue-400">최신순</button>
          <button className="px-4 py-3 text-sm font-medium text-black dark:text-white">인기순</button>
        </div>
      </div>

      {/* 게시물 렌더링 */}
      {
        postSummaryList.length > 0 && postSummaryList.filter((item) => Object.keys(item).length > 0).length > 0 ? (
        postSummaryList
          .map((e, index) => (
            <Link to={`/post/${e.postId}`} key={index}>
              <PostInfo
                userId={e.usersInfo.id}
                username={e.usersInfo.name}
                createdAt={e.createdAt}
                summary={e.summary}
                commentCnt={e.commentCnt}
              />
            </Link>
          ))
        ) : (
          // 게시물이 없다면
          <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)] text-gray-500 text-center px-4">
            게시글이 없어요..
          </div>
        )
      }

      <div ref={observerRef} className="flex items-center justify-center h-full min-h-[calc(70vh-100px)] text-gray-500 text-center px-4">
        {!hasMore && <p>더 이상 게시글이 없습니다...</p>}
      </div>
    </div>
  );
}

const PostInfo = ({ userId, username, createdAt, summary, commentCnt }) => {
  return (
    <div className="p-6 shadow">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gray-300"></div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-1">
            <span className="font-bold text-gray-900 dark:text-white">{username}</span>
          </div>
          <p className="text-gray-900 dark:text-white mt-1">{summary}</p>
          <div className="mt-2 rounded-xl overflow-hidden border border-gray-200">
            {/* 사용자 이미지 */}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-1 text-gray-500">
              <button className="p-1 rounded-full">
                <svg className="h-5 w-5 hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <span className="text-sm">{commentCnt}</span>
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
