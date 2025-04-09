import React, {useEffect, useState} from 'react';
import userStore from "../../../utils/userStore.js";
import {useNavigate, useParams} from "react-router-dom";
import {uploadUserImg} from "../../../service/fileService.js";
import {alertStatus} from "../../../utils/enums.js";
import uiStore from "../../../utils/uiStore.js";
import {getUserInfo} from "../../../service/usersService.js";
import UserImg from "../../../components/UserImg.jsx";

export default function UsersInfo() {
  // 파라미터
  const {id} = useParams();

  // 페이지이동
  const navigate = useNavigate();

  // 탭 관리
  const [tab, setTab] = useState('L');

  // 사용자 정보
  const {isLogin, userInfo} = userStore(state => state);

  // 상태 관리
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState(null);
  const [userImg, setUserImg] = useState(null);

  // ui 제어
  const {openAlert} = uiStore((state) => state.alert);

  useEffect(() => {
    const check = async () => {
      // todo : 사용자 확동 내역
    }

    check()
        .then(() => console.log('확인완료'))
        .catch((error) => {
          if (error.status === 401) {
            console.error(`사용자 인증 실패 : ${error.statusMessage}`);
            navigate('/error404');
          } else {
            console.error(`서버 통신 실패 : ${error.statusMessage}`);
            navigate('/error500');
          }
        });
  }, []);

  const tabs = [
    {id: "L", label: "활동 내역"},
    {id: "P", label: "게시글"},
    {id: "C", label: "작성한 댓글"},
    {id: "F", label: "팔로우"},
  ];

  useEffect(() => {
    switch (tab) {
      case "L":
        break;
      case "P":
        break;
      case "C":
        break;
      case "F":
        break;
      default:
        navigate("/error500");
        break;
    }
  }, [tab]);

  // 사용자 기본 정보 호출
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const response = await getUserInfo(id);
        if (response.status === 200) {
          const data = response.data;
          setUserId(data.id);
          setName(data.name);
          setUserImg(data.imgUrl);
        }
      } catch (error) {

      }
    }
    loadUserInfo();
  }, []);

  const handleUploadUserCoverImg = async () => {
    try {
      const file = e.target.files[0];
      console.log(file);
    } catch (error) {
      console.error(error);
    }
  }

  const handleUploadUserImg = async (e) => {
    try {
      const file = e.target.files[0];
      if (file && isLogin) {
        const userimgUrl = await uploadUserImg(file, userInfo.id);
        setUserImg(userimgUrl);
        openAlert({message: "사진이 등록되었습니다.", type: alertStatus.SUCCESS});
      }
    } catch (error) {
      console.error(error);
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="min-h-screen bg-gray-100">
        {/* 커버 사진 및 프로필 사진 */}
        <div className="relative">
          <div className="h-64 bg-gray-300">
            {/* 커버 사진 */}
            <div className="w-full h-full flex items-center justify-end p-4">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center"
                onClick={handleUploadUserCoverImg}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                </svg>
                커버 사진 추가
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 left-8 transform translate-y-1/2">
            <div className="w-40 h-40 bg-gray-400 rounded-full border-4 border-white flex items-center justify-center">
              {
                userImg ? (<UserImg imgUrl={userInfo.imgUrl} />) : (
                  <svg className="w-20 h-20 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )
              }
            </div>
            <label
              htmlFor="userImg"
              className="absolute bottom-2 right-2 bg-gray-200 rounded-full p-2 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 z-20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"/>
              </svg>
              <input
                id="userImg"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadUserImg}
              />
            </label>
          </div>
        </div>

        {/* 사용자 이름 및 버튼 */}
        <div className="mt-20 px-8">
          <p className="text-3xl font-bold">{name}<span className="text-xl font-bold">#{userId}</span></p>
        </div>

        {/* 탭 */}
        <div className="mt-6 border-t border-gray-200">
          <div className="flex space-x-6 px-8 py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`text-gray-600 hover:text-blue-600 ${
                  tab === tab.id
                    ? "font-semibold border-b-2 border-blue-60"
                    : ""
                }`}
                onClick={() => setTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="px-8 py-4">
          <div className="flex flex-col items-center justify-center p-16 gap-4">
            <p className="text-xl text-gray-400">활동 내역이 없어요</p>
          </div>
        </div>
      </div>
    </div>
  );
}
