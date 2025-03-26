import React, {useEffect, useState} from "react";
import Editor from "../../../utils/Editor.jsx";
import {savePost} from "./service/postService.js";
import {useNavigate} from "react-router-dom";
import uiStore from "../../../utils/uiStore.js";
import userStore from "../../../utils/userStore.js";
import {alertStatus} from "../../../utils/enums.js";
import {getGroup} from "./service/groupService.js";

export default function Write() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const {openAlert} = uiStore((state) => state.alert);
  const {userInfo, isLogin} = userStore(state => state);

  useEffect(() => {
    if (!isLogin) {
      openAlert({message: "로그인 후에 글 작성이 가능합니다.", type: alertStatus.WARN});
      navigate("/");
    }

    const getGroupList = async () => {
      try {
        const userId = userInfo.id;
        if (userId === undefined || userId === null) {
          return;
        }
        const groupList = await getGroup(userId);
        setGroups((prev) => [...prev, ...groupList]);
        setGroupId(groupList[0].id);
      } catch (error) {
        openAlert({message: "잠시 후 다시 접속해주세요", type: alertStatus.ERROR});
        console.error("게시글 저장 실패 :", error);
      }
    }

    getGroupList();
  }, [])

  const handleSavePost = async () => {
    try {
      const requestData = {
        userId: userInfo.id,
        groupId: groupId,
        subject: subject,
        content: content
      }
      const respnose = await savePost(requestData);
      navigate(respnose.headers.get("Location"));
    } catch (error) {
      openAlert({message: "잠시 후 다시 등록해주세요.", type: alertStatus.ERROR});
      console.error("게시글 저장 실패 :", error);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-white">글 작성</h2>

      {/* 그룹 선택 */}
      <section className='dark:bg-dark'>
        <div className='container'>
          <div className='-mx-4 flex flex-wrap'>
            <div className='w-full px-4 md:w-1/2 lg:w-1/3'>
              <div className='mb-12'>
                <label className='mb-[10px] block text-base font-medium text-dark dark:text-white'>
                  글을 작성할 장소를 골라주세요
                </label>
                <div className='relative'>
                  <select
                    onChange={(e) => setGroupId(e.target.value)}
                    className='relative w-full appearance-none rounded-lg border border-stroke dark:border-dark-3 bg-transparent py-2 px-5 text-black dark:text-white outline-none transition'>
                    {
                      groups.length > 0 && groups.filter((item) => Object.keys(item).length > 0).length > 0 ? (
                      groups.map((groups, index) => (
                          <option key={index} value={groups.id}>
                            {groups.groupStatus === 'USER' && <>사용자</>}
                            {groups.groupStatus !== 'USER' && <>그룹</>}
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
        <label htmlFor={"subject"} className="relative">
          <input
            id={"subject"}
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={200}
            className="peer mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
          <span
            className="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5 dark:bg-gray-900 dark:text-white"
          >
            Subject
          </span>
        </label>
      </div>

      {/* 에디터 */}
      <Editor
        setContent={setContent}
        editable={true}
      />

      {/* 버튼 */}
      <div className="flex justify-center gap-4">
        {/* todo : 미완성 기능 */}
        {/*<button className="bg-blue-50 text-blue-500 px-4 py-2 rounded-full">*/}
        {/*  미리보기*/}
        {/*</button>*/}
        <button
          className="bg-blue-50 text-blue-500 px-4 py-2 rounded-full"
          onClick={handleSavePost}
        >
          게시
        </button>
      </div>
    </div>
  );
}
