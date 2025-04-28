import React, { useState, useRef, useEffect } from 'react';
import {deletePost, getPost} from "../../../service/postService.js";
import {useNavigate, useParams} from "react-router-dom";
import Editor from "../../../components/Editor.jsx";
import {alertStatus, promptStatus} from "../../../utils/enums.js";
import uiStore from "../../../utils/uiStore.js";
import userStore from "../../../utils/userStore.js";
import UserImg from "../../../components/UserImg.jsx";
import {formatDate} from "../../../utils/dateUtils.js";
import CommentList from "./CommentList.jsx";

export default function PostView() {
  // 파라미터
  const {id} = useParams();
  
  // 페이지이동
  const navigate = useNavigate();
  
  // 조회 데이터
  const [post, setPost] = useState({});
  const [writer, setWriter] = useState({});

  // 메뉴 제어
  const [isShowPostMenu, setIsShowPostMenu] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  // 사용자 제어
  const {userInfo} = userStore(state => state);
  
  // ui 제어
  const menuRef = useRef(null);
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

        let recentPostList = JSON.parse(sessionStorage.getItem('recentPosts'));
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

  const handlePostUpdate = async () => {
    try {
      const isUpdate = await openPrompt({message: "게시글을 수정하시겠습니까?", type: promptStatus.INFO});
      if (isUpdate) {
        navigate(`/post/${post.postId}/update`);
      }
    } catch (error) {
      openAlert({message: "삭제에 실패하였습니다.", type: alertStatus.ERROR});
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

  return (
    <div>
      <div className="top-14 z-10 bg-white dark:bg-gray-800 shadow">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7">
              <UserImg imgUrl={writer.imgUrl} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">{writer.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.createdAt)}</p>
            </div>
          </div>

          <div>
            <button
              onClick={() => setIsShowPostMenu(!isShowPostMenu)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
            >
              <svg className="h-5 w-5 text-black dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
              </svg>
            </button>

            {isShowPostMenu && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20"
              >
                <button className="flex items-center w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <svg className="h-5 w-5 text-black dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="text-black dark:text-white">공유하기</span>
                </button>
                {
                  isEdit && (
                    <div>
                      <button
                        onClick={handlePostUpdate}
                        className="flex items-center w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <svg className="h-5 w-5 text-black dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span className="text-black dark:text-white">수정하기</span>
                      </button>
                      <button
                        onClick={handlePostDelete}
                        className="flex items-center w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <svg className="h-5 w-5 text-black dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span className="text-black dark:text-white">삭제하기</span>
                      </button>
                    </div>
                  )
                }
              </div>
            )}
          </div>
        </div>
      </div>

      {/* subject */}
      <div className="p-4">
        <h2 className="text-2xl font-semibold text-black dark:text-white">{post.subject}</h2>
      </div>

      {/* content */}
      <div className="p-4">
        <Editor
          editable={false}
          content={post.content}/>
      </div>

      {/* comment */}
      <CommentList postId={id}/>
    </div>
  )
}
