import React, {useEffect, useState} from "react";
import uiStore from "../../../utils/uiStore.js";
import userStore from "../../../utils/userStore.js";
import {useNavigate} from "react-router-dom";
import {alertStatus} from "../../../utils/enums.js";
import {saveGroup, updateGroup} from "../../../service/groupService.js";
import {uploadGroupImg} from "../../../service/fileService.js";

export default function CreateGroup() {
  // 페이지 이동
  const navigate = useNavigate();

  // 상태 제어
  const [isUpdate, setIsUpdate] = useState(false);
  const [name, setName] = useState('');
  const [description , setDescription] = useState('');
  const [groupImgUrl , setGroupImgUrl] = useState('');
  const [bannerUrl , setBannerUrl] = useState('');
  const [isPrivate, setIsPrivate] = useState(false)

  // ui 제어
  const {openAlert} = uiStore((state) => state.alert);
  const {isLogin} = userStore(state => state);
  const {openDialog} = uiStore(state => state.dialog);

  useEffect(() => {
    if (!isLogin) {
      navigate("/");
    }
  }, []);

  const handleCheckboxChange = () => {
    setIsPrivate(!isPrivate)
  }

  const handleSaveGroup = async () => {
    try {
      if (name.length === 0) {
        openAlert({message: "그룹 이름을 입력해주세요", type: alertStatus.INFO});
        return;
      }

      const requestData = {
        name: name,
        description: description,
        groupStatus: isPrivate ? 'PRIVATE' : 'PUBLIC',
        groupImgUrl: groupImgUrl,
        bannerUrl: bannerUrl,
      }
      const respnose = await saveGroup(requestData);
      if (respnose.status === 201) {
        navigate(respnose.headers.get("Location"));
        openAlert({message: "새로운 그룹이 생성되었습니다.", type: alertStatus.SUCCESS});
      }
    } catch (error) {
      console.error(`그룹 생성 실패 ${error}`);
      navigate('/error404');
    }
  }

  const handleUpdateGroup = async () => {
    try {
      const requestData = {
        name: name,
        description: description,
        groupStatus: isPrivate ? 'PRIVATE' : 'PUBLIC',
        groupImgUrl: groupImgUrl,
        bannerUrl: bannerUrl,
      }
      const respnose = await updateGroup(requestData);
      navigate(respnose.headers.get("Location"));
    } catch (error) {
      openAlert({message: "잠시 후 다시 등록해주세요.", type: alertStatus.ERROR});
      console.error("게시글 저장 실패 :", error);
    }
  }

  const handleUploadGroupImg = async (e) => {
    try {
      const file = e.target.files[0];
      if (file && isLogin) {
        const groupImgUrl = await uploadGroupImg(file, 'I');
        setGroupImgUrl(groupImgUrl);
      }
    } catch (error) {
      console.error(error);
    } finally {
      e.target.value = "";
    }
  }

  const handleUploadBanner = async (e) => {
    try {
      const file = e.target.files[0];
      if (file && isLogin) {
        const bannerImgUrl = await uploadGroupImg(file, 'B');
        setBannerUrl(bannerImgUrl);
      }
    } catch (error) {
      console.error(error);
    } finally {
      e.target.value = "";
    }
  }

  const handleOpenDialog = () => {
    const IMAGE_URL = import.meta.env.VITE_BASE_API_URL + "/file";
    openDialog(
      {
      header: '미리보기',
      body:
      <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-full">
        <div className="flex items-center space-x-3">
          {groupImgUrl.length > 0 ? (
            <img src={IMAGE_URL + groupImgUrl} alt="Group image" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
          )}
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-gray-800 dark:text-white font-semibold">{name || 'groupname'}</span>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <span className="text-black dark:text-gray-200">{description || '설명란'}</span>
        </div>
      </div>,
      useMobileMode: false
    });
  }

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6 bg-gray-100 dark:bg-gray-900">
      {/* Form Section */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg w-full">
        <h1 className="text-4xl font-semibold mb-4 text-gray-700 dark:text-white">
          그룹 생성
        </h1>

        {/* 그룹 설명 및 이미지 입력 */}
        <h1 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-white border-b border-gray-800">
          그룹 이름과 이미지
        </h1>
        <div className="mb-4">
          <label htmlFor="name" className="relative">
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              className="w-full p-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 text-black dark:text-white"
            />
            <span
              className="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5 dark:bg-gray-800 dark:text-white"
            >
              Group Name
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1">{name.length}/50</p>
        </div>

        {/* 그룹 소개 입력 */}
        <div className="mb-4">
          <label htmlFor="desc" className="relative">
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              rows={4}
              className="w-full p-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 text-black dark:text-white"
              placeholder={"그룹 설명란에 표시됩니다."}
            />
            <span className="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5 dark:bg-gray-900 dark:text-white">
              Group Description
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1">{description.length}/200</p>
        </div>

        {/* 배너 이미지 업로드 */}
        <div className="mb-4 flex justify-between items-center">
          <span className="text-gray-700 i dark:text-white">그룹 배너</span>
          <label
            htmlFor="bannerImg"
            className="bg-gray-200 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-600 p-2 cursor-pointer">
            <input
              id="bannerImg"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadBanner}
            />
            <svg
              className="text-black dark:text-gray-200 size-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor">
              <path d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" />
            </svg>
          </label>
        </div>

        {
          bannerUrl && (
            <div className="py-4 border-b border-gray-800">
              배너 목록
            </div>
          )
        }

        {/* 아이콘 이미지 업로드 */}
        <div className="mb-2 flex justify-between items-center">
          <span className="text-gray-700 i dark:text-white">그룹 아이콘</span>
          <label
            htmlFor="groupImg"
            className="bg-gray-200 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-600 p-2 cursor-pointer">
            <input
              id="groupImg"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadGroupImg}
            />
            <svg
              className="text-black dark:text-gray-200 size-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor">
              <path d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" />
            </svg>
          </label>
        </div>

        {
          groupImgUrl && (
            <div className="flex justify-between items-center py-4">
              <div className="mb-2 flex justify-between items-center">
                <span className="text-gray-700 i dark:text-white">아이콘 이미지</span>
              </div>
              <div className="flex items-center">
                <button
                  className="rounded-3xl p-1 bg-blue-300 text-white mr-4">
                  변경
                </button>
              </div>
            </div>
          )
        }

        {/* 그룹 설정 */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-white">
          그룹 설정
        </h2>
        <div className="mb-4 flex justify-between items-center">
          <span className="text-gray-700 dark:text-white mr-2">그룹 공개 여부</span>
          <label className="flex items-center cursor-pointer select-none">
            <span className="text-blue-500 mr-4">그룹을 공개할 경우 체크해주세요</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={handleCheckboxChange}
                className="sr-only"
              />
              <div className={`box block h-8 w-14 rounded-full ${isPrivate ? 'bg-blue-500' : 'bg-gray-400'}`}/>
              <div className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${isPrivate ? 'translate-x-full' : ''}`}/>
            </div>
          </label>
        </div>

        {/* 버튼 */}
        <div className="flex justify-center gap-4">
          <button
            className="bg-blue-50 text-blue-500 px-4 py-2 rounded-full"
            onClick={handleOpenDialog}
          >
            미리보기
          </button>
          <button
            className="bg-blue-50 text-blue-500 px-4 py-2 rounded-full"
            onClick={isUpdate ? handleUpdateGroup : handleSaveGroup}
          >
            {isUpdate ? '수정' : '생성'}
          </button>
        </div>
      </div>
    </div>
  )
}

