import React, {useEffect, useState} from "react";
import uiStore from "../../../utils/uiStore.js";
import userStore from "../../../utils/userStore.js";
import {useNavigate, useParams} from "react-router-dom";
import {getUserInfo} from "../../../service/usersService.js";
import UserImg from "../../../components/UserImg.jsx";
import {getGroup} from "../../../service/groupService.js";

export default function GruopInfo() {
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

  const tabs = [
    {id: "L", label: "활동 내역"},
    {id: "P", label: "게시글"},
    {id: "C", label: "작성한 댓글"},
    {id: "F", label: "팔로우"},
  ];

  // 사용자 기본 정보 호출
  useEffect(() => {
    const loadGroupInfo = async () => {
      try {
        const response = await getGroup(id);
        debugger;
        if (response.status === 200) {
          const data = response.data;

          setUserId(data.id);
          setName(data.name);
          setUserImg(data.imgUrl);
        }
      } catch (error) {
        console.error('그룹 정보 로드 실패');
        navigate('/error500');
      }
    }
    void loadGroupInfo();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="min-h-screen bg-gray-100">
        {/* 커버 사진 및 프로필 사진 */}
        <div className="relative">
          <div className="h-32 bg-gray-300">
            {/* 커버 사진 */}
            <div className="w-full h-full flex items-center justify-end p-4">
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
          </div>
        </div>

        {/* 그룹 이름 및 버튼 */}
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
