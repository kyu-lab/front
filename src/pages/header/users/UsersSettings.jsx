import React, {useState} from "react";

import {useNavigate, useParams} from "react-router-dom";

import {update} from "./service/usersService.js";
import userStore from "../../../utils/userStore.js";
import uiStore from "../../../utils/uiStore.js";
import {alertStatus} from "../../../utils/enums.js";

export default function UsersSettings() {
  // 사용자 데이터
  const [password, setPassWord] = useState("");

  // 페이지 이동
  const navigate = useNavigate();
  
  // 파라미터
  const {username} = useParams();

  // 사용자 제어
  const {isLogin, userInfo} = userStore(state => state);

  // ui 제어
  const {openAlert} = uiStore((state) => state.alert);

  const handleUpdate = async () => {
    try {
      const id = userInfo.id;
      const response = await update(id, {passWord: password});
      if (response.status === 200) {
        openAlert({message: "수정되었습니다.", type: alertStatus.SUCCESS});
        setPassWord("");
      }
    } catch (error) {
      openAlert({message: "수정에 실패하였습니다..", type: alertStatus.ERROR});
    }
  };

  // todo : 사용자 설정 페이지 인증 수정 필요 (조금 더 id 비교까지 해서)
  if (!isLogin || username !== userInfo.name) {
    navigate('/error404');
    return null;
  }

  return (
      <div className="flex flex-col md:flex-row gap-4 p-4 min-h-screen">
        <aside className="bg-white rounded-lg shadow w-full md:w-64 p-4 h-fit">
          <h2 className="text-lg font-semibold mb-4">설정 페이지</h2>
          <div className="space-y-2">
            <button className="flex items-center w-full py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg">
              <span className="text-blue-500">사용자 정보 설정</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </aside>

        <section className="flex-1">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
            <h1 className="text-xl font-bold mb-4">사용자 정보 설정</h1>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  value={password}
                  type="password"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Update password"
                  onChange={(e) => setPassWord(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </section>
      </div>
  );
}