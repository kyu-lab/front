import React, {useState} from "react";
import Editor from "../../../utils/Editor.jsx";
import {savePost} from "./service/postService.js";
import {useNavigate} from "react-router-dom";

export default function Write() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const handleSavePost = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("userInfo")).id;
      const response = await savePost({userId, subject, content});
      alert("게시글 저장 성공");
      navigate(`/post/${response.data}`);
    } catch (error) {
      alert("게시글 저장 실패");
      console.error("게시글 저장 실패 :", error);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">글쓰기</h2>

      {/* 제목 입력 */}
      <div className="mb-4">
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="제목*"
          maxLength={200}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* 에디터 */}
      <Editor setContent={setContent} editable={true}/>

      {/* 버튼 */}
      <div className="flex justify-center gap-4">
        <button className="bg-blue-50 text-blue-500 px-4 py-2 rounded-full">
          미리보기
        </button>
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
