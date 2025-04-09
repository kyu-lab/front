import React, {forwardRef, useEffect, useImperativeHandle} from "react";
import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import {uploadPostImg} from "../service/fileService.js";

const Editor = forwardRef(({ editable = true, content = "" }, ref) => {
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Youtube,
      Placeholder.configure({
        placeholder: "내용을 입력하세요...", // 플레이스홀더 텍스트
        includeChildren: true, // 하위 노드에도 적용
      }),
    ],
    editable: editable,
    onCreate: ({editor}) => {
      editor.commands.clearContent(); // 불필요한 <br> 태그 제거
    },
    content: content,
    editorProps: {
      // todo : 이미지 붙여넣기, 드래그드롭 기능
    }
  });

  // 글 조회시 세팅
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content)
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  // 저장시 입력한 본문 반환
  useImperativeHandle(ref, () => ({
    getHTML: () => {
      return editor ? editor.getHTML() : "";
    },
    getImgList: () => {
      let content = editor.getHTML();

      const imgList = [];
      const regex = /<img[^>]*src="[^"]*\/image\/([a-f0-9\-]+)"/g;

      let match;
      while ((match = regex.exec(content)) !== null) {
        imgList.push(match[1]);
      }

      return imgList;
    },
  }));

  const handleUploadPostImg = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const postimgUrl = await uploadPostImg(file);
        editor.chain().focus().setImage({src: BASE_API_URL + "/file" + postimgUrl}).run();
      }
    } catch (error) {
      console.error(error);
    } finally {
      e.target.value = "";
    }
  }

  return (
    <>
      {/* 작성 툴바 */}
      {
        editable &&
          <div className="mb-2 flex gap-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className="bg-gray-200 px-2 py-1 rounded"
              disabled={!editor.can().chain().focus().toggleBold().run()}
            >
              Bold
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className="bg-gray-200 px-2 py-1 rounded"
              disabled={!editor.can().chain().focus().toggleItalic().run()}
            >
              Italic
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className="bg-gray-200 px-2 py-1 rounded"
            >
              H1
            </button>
            <label
              htmlFor="postImg"
              className="bg-gray-200 px-2 py-1 rounded cursor-pointer">
                이미지 첨부
                <input
                  id="postImg"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadPostImg}
                />
            </label>
          </div>
      }

      {/* 본문 입력 */}
      <div className="mb-4">
        <EditorContent
          className={`text-black dark:text-white 
            ${editable ? "border border-gray-300 rounded-lg" : "text-black dark:text-white"}`
          }
          editor={editor}
        />
      </div>
    </>
  )
});

export default Editor;