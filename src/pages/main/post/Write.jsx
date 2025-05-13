import React, {useEffect, useRef, useState} from "react";
import Editor from "../../../components/Editor.jsx";
import {getPost, savePost, updatePost} from "../../../service/postService.js";
import {useNavigate, useParams} from "react-router-dom";
import uiStore from "../../../utils/uiStore.js";
import userStore from "../../../utils/userStore.js";
import {alertStatus} from "../../../utils/enums.js";
import {getGroups} from "../../../service/groupService.js";

export default function Write() {
  // 파라미터
  const {id} = useParams();

  // 페이지 이동
  const navigate = useNavigate();

  // 사용자 데이터
  const [groups, setGroups] = useState([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const selectRef = useRef();

  // 컴포넌트 제어
  const [isUpdate, setIsUpdate] = useState(false);

  // ui 제어
  const {openAlert} = uiStore((state) => state.alert);
  const {isLogin, userInfo} = userStore(state => state);

  // 에디터 제어
  const editorRef = useRef(null);

  useEffect(() => {
    if (!isLogin) {
      navigate("/");
    }

    if (id === null || id === undefined) {
      void getGroupList();
    } else {
      const getPostInfo= async () => {
        try {
          const response = await getPost(id);
          const postInfo = response.postDetail;
          setSubject(postInfo.subject);
          setContent(postInfo.content);
          setIsUpdate(true);
        } catch (error) {
          openAlert({message: "잠시 후 다시 접속해주세요", type: alertStatus.ERROR});
          console.error("게시글 저장 실패 :", error);
        }
      }
      getPostInfo().then(() => getGroupList());
    }
  }, []);

  const getGroupList = async () => {
    try {
      const response = await getGroups();
      if (response.status === 200) {
        const groupList = response.data;
        if (groupList.length > 0) {
          setGroups((prev) => [...prev, ...groupList]);
        }
      }
    } catch (error) {
      console.error(error);
      openAlert({message: "잠시 후 다시 접속해주세요", type: alertStatus.ERROR});
    }
  }

  const handleSavePost = async () => {
    try {
      if (subject.length === 0) {
        openAlert({message: "제목을 입력해주세요", type: alertStatus.INFO});
        return;
      }

      // 게시글 저장 위치
      const writeSpace = selectRef.current?.selectedOptions[0];
      const writeSpaceId = writeSpace?.value;
      const isGroup = writeSpace?.getAttribute('data-isGroup') === 'true';

      const requestData = {
        groupDto: {
          boolean: isGroup,
          groupId : isGroup ? writeSpaceId : null
        },
        contentDto: {
          subject: subject,
          content: editorRef.current.getHTML(),
          imgUrls: editorRef.current.getImgList()
        },
        settingsDto: {
          isThumbnail: false,
          thumbnailUrl: null,
          status: 'NORMAL'
        }
      }

      const respnose = await savePost(requestData);
      if (respnose.status === 201) {
        navigate(respnose.headers.get("Location"));
        openAlert({message: "게시글이 등록되었습니다.", type: alertStatus.SUCCESS});
      }
    } catch (error) {
      console.error("게시글 저장 실패 :", error);
      navigate('/error404');
    }
  }

  const handleUpdatePost = async () => {
    try {
      const requestData = {
        postId: id,
        groupId: groupId,
        subject: subject,
        content: editorRef.current.getHTML()
      }
      const respnose = await updatePost(requestData);
      navigate(respnose.headers.get("Location"));
    } catch (error) {
      openAlert({message: "잠시 후 다시 등록해주세요.", type: alertStatus.ERROR});
      console.error("게시글 저장 실패 :", error);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-white">
        {isUpdate ? `글 수정` : '글 작성'}
      </h2>

      {/* 그룹 선택 */}
      <section className='dark:bg-dark'>
        <div className='container'>
          <div className='-mx-4 flex flex-wrap'>
            <div className='w-full px-4'>
              <div className='mb-12'>
                <label className='mb-[10px] block text-base font-medium text-dark dark:text-white'>
                  글을 작성할 장소를 골라주세요
                </label>
                <div className='relative'>
                  <select
                    ref={selectRef}
                    className='relative w-full appearance-none rounded-lg border border-stroke dark:border-dark-3 bg-transparent py-2 px-5 text-black dark:text-white outline-none transition'>
                    <option value={userInfo.id} data-isGroup={false}>
                      {userInfo.name} (자신의 게시글)
                    </option>
                    {
                      groups.length > 0 && groups.filter((item) => Object.keys(item).length > 0).length > 0 ? (
                      groups.map((groups, index) => (
                        <option key={index} value={groups.id} data-isGroup={true}>
                          {groups.name}
                        </option>
                      ))
                      ) : (
                        <></>
                      )
                    }
                  </select>
                  <span className='absolute right-4 top-1/2 z-10 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-body-color'></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 제목 입력 */}
      <div className="mb-4">
        <label htmlFor="subject" className="relative">
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={50}
            className="w-full p-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 text-black dark:text-white"
          />
          <span
            className="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5 dark:bg-gray-800 dark:text-white"
          >
            Subject
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1">{subject.length}/100</p>
      </div>

      {/* 에디터 */}
      <Editor
        content={content}
        editable={true}
        ref={editorRef}
      />

      {/* 버튼 */}
      <div className="flex justify-center gap-4">
        {/* todo : 미완성 기능 */}
        {/*<button className="bg-blue-50 text-blue-500 px-4 py-2 rounded-full">*/}
        {/*  미리보기*/}
        {/*</button>*/}
        <button
          className="bg-blue-50 text-blue-500 px-4 py-2 rounded-full"
          onClick={isUpdate ? handleUpdatePost : handleSavePost}
        >
          {isUpdate ? `수정` : '게시'}
        </button>
      </div>
    </div>
  );
}
