import React, {useEffect} from "react";
import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";

export default function Editor({setContent = null, editable= true, content = ""}) {
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
    content: content, // 빈 문자열로 초기화
    onUpdate({ editor }) {
      if (setContent !== null && setContent !== undefined) {
        setContent(editor.getHTML());
      }
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
}