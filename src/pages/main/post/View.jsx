import React, { useState, useRef, useEffect } from 'react';
import {deletePost, getPost} from "../../../service/postService.js";
import {useNavigate, useParams} from "react-router-dom";
import Editor from "../../../utils/Editor.jsx";
import {getComments, saveComment} from "../../../service/commentService.js";
import {alertStatus, promptStatus} from "../../../utils/enums.js";
import uiStore from "../../../utils/uiStore.js";
import userStore from "../../../utils/userStore.js";
import UserImg from "../../../components/UserImg.jsx";

export default function View() {
  // 파라미터
  const {id} = useParams();
  
  // 페이지이동
  const navigate = useNavigate();
  
  // 조회 데이터
  const [post, setPost] = useState({});
  const [writer, setWriter] = useState({});
  const [comments, setComments] = useState([]);
  
  // 사용자 데이터
  const [comment, setComment] = useState('');
  
  // 메뉴 제어
  const [isShowPostMenu, setIsShowPostMenu] = useState(false);
  const [isShowCommentMenu, setIsShowCommentMenu] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  
  // 사용자 제어
  const {isLogin, userInfo} = userStore(state => state);
  
  // ui 제어
  const menuRef = useRef(null);
  const {openAlert} = uiStore((state) => state.alert);
  const {openPrompt} = uiStore((state) => state.prompt);

  useEffect(() => {
    const handleGetPost = async () => {
      try {
        const [postResponose, commentResponose] = await Promise.all([
          getPost(id, userInfo.id), getComments(id)
        ]);

        setPost({
          ...postResponose.postDetail
        });
        setWriter({
          ...postResponose.usersInfo
        });

        setComments((prevComments) => [...prevComments, ...commentResponose]);

        // 글 수정권한 및 삭제 부여
        if (userInfo.id === postResponose.usersInfo.id) {
          setCanEdit(true);
        }

        const recentPost = {
          post: {
            postId: postResponose.postDetail.postId,
            subject: postResponose.postDetail.subject,
            createdAt: postResponose.postDetail.createdAt
          },
          writer: {
            id: postResponose.usersInfo.id,
            name: postResponose.usersInfo.name,
            imgUrl: postResponose.usersInfo.imgUrl
          }
        }

        let recentPostList = JSON.parse(sessionStorage.getItem('recentPosts'));
        if (recentPostList.length > 3) {
          recentPostList.shift();
        }

        if (recentPostList.length === 0) {
          recentPostList.push(recentPost);
        }

        if (!recentPostList.some(item => item.postId !== postResponose.postDetail.postId)) {
          recentPostList.push(recentPost);
        }

        sessionStorage.setItem('recentPosts', JSON.stringify(recentPostList));
        
      } catch (error) {
        navigate('/error404');
      }
    }
    handleGetPost();
  }, []);

  const handleSaveComment = async () => {
    try {
      const request = {
        postId: post.postId,
        content: comment
      }
      const response = await saveComment(request);
      if (response.status === 200) {
        openAlert({message: "댓글이 등록되었습니다.", type: alertStatus.SUCCESS});
        setComment('');
      }
    } catch (error) {
      openAlert({message: "잠시 후 다시 등록해주세요.", type: alertStatus.ERROR});
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
      {
        post &&
          <>
            <div className="sticky top-14 z-10 bg-white dark:bg-gray-800 shadow rounded-t-2xl">
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center space-x-3">
                    <UserImg imgUrl={writer.imgUrl} />
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">{writer.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{post.createdAt}</p>
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
                        canEdit && (
                          <>
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
                          </>
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

            {/* Comment input */}
            {
              isLogin && (
                <div className="p-4">
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <textarea
                    placeholder={comments.length === 0 ? `첫 댓글을 작성해볼까요?` : `댓글을 입력하세요`}
                    className="w-full p-3 outline-none text-black dark:text-white bg-white dark:bg-gray-900"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex justify-between items-center px-3 py-2 ">
                  <div className="flex space-x-3">
                    <button>
                      <svg className="text-black dark:text-white size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" />
                      </svg>
                    </button>
                  </div>
                  <button
                      className="bg-blue-100 text-blue-500 px-4 py-1 rounded-md hover:bg-blue-200"
                      onClick={handleSaveComment}
                      disabled={!comment}
                  >
                    답장
                  </button>
                </div>
                </div>
              </div>
              )
            }


            {/* Comments section */}
            <div className="p-4">
              <div>
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
                {comments.length > 0 ? (
                    comments.map((e, index) =>  (
                      <div key={index}>
                        <Comment
                          id={e.userId}
                          name={e.name}
                          createdAt={e.createdAt}
                          content={e.content}
                        />
                      </div>
                    ))
                  ) : (
                    <>댓글이 없습니다.</>
                  )
                }
              </div>
            </div>
          </>
      }
    </div>
  )
}

const Comment = ({key, userId, name, createdAt, content}) => {
  return (
    <div key={key} className="mb-4 border-dashed">
      <div className="flex justify-between">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
            사용자 이미지
          </div>
          <div>
            <div className="flex items-center">
              <span className="font-medium text-black dark:text-white">{name}</span>
            </div>
            <span className="text-xs text-gray-500">{createdAt}</span>
          </div>
        </div>
        <div className="flex items-center">
          <button className="text-gray-400 hover:text-gray-600 mr-2">
          </button>
          <button className="text-gray-400 hover:text-gray-600">
          </button>
        </div>
      </div>

      {/* Comment content */}
      <div className="ml-10">
        <div className="p-3 mb-2 relative">
          <span className="text-black dark:text-white">{content}</span>
        </div>
      </div>
    </div>
  )
}
