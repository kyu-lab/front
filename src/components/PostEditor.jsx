import "../styles/editor.css"

import React, {forwardRef, useEffect, useImperativeHandle} from "react";
import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import {uploadPostImg} from "../service/fileService.js";
import { BubbleMenu } from "@tiptap/react"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"
import {Button} from "@/components/ui/button.jsx";

const PostEditor = forwardRef(({ editable = true, content = "" }, ref) => {
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

  const toggleBold = () => editor?.chain().focus().toggleBold().run()
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run()
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run()
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run()
  const toggleH1 = () => editor?.chain().focus().toggleHeading({ level: 1 }).run()
  const toggleH2 = () => editor?.chain().focus().toggleHeading({ level: 2 }).run()
  const toggleBlockquote = () => editor?.chain().focus().toggleBlockquote().run()
  const toggleCode = () => editor?.chain().focus().toggleCode().run()
  const alignLeft = () => editor?.chain().focus().setTextAlign("left").run()
  const alignCenter = () => editor?.chain().focus().setTextAlign("center").run()
  const alignRight = () => editor?.chain().focus().setTextAlign("right").run()
  const undo = () => editor?.chain().focus().undo().run()
  const redo = () => editor?.chain().focus().redo().run()

  return (
    <>
      { /* 작성 툴바 */
        editable &&
        <>
          <div className="flex flex-wrap items-center gap-1 p-2 mb-4 border border-gray-200 rounded-lg bg-gray-50">
            <Button
              variant='icon'
              onClick={toggleBold}
              className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive("bold") ? "bg-gray-200" : ""}`}
              title="굵게"
            >
              <Bold size={18} />
            </Button>
            <Button
              variant='icon'
              onClick={toggleItalic}
              className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive("italic") ? "bg-gray-200" : ""}`}
              title="기울임"
            >
              <Italic size={18} />
            </Button>
            <Button
              variant='icon'
              onClick={toggleH1}
              className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""}`}
              title="제목 1"
            >
              <Heading1 size={18} />
            </Button>
            <Button
              variant='icon'
              onClick={toggleH2}
              className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}`}
              title="제목 2"
            >
              <Heading2 size={18} />
            </Button>
            <Button
              variant='icon'
              onClick={toggleBulletList}
              className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive("bulletList") ? "bg-gray-200" : ""}`}
              title="글머리 기호 목록"
            >
              <List size={18} />
            </Button>
            <Button
              variant='icon'
              onClick={toggleOrderedList}
              className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive("orderedList") ? "bg-gray-200" : ""}`}
              title="번호 매기기 목록"
            >
              <ListOrdered size={18} />
            </Button>
            <Button
              variant='icon'
              onClick={toggleBlockquote}
              className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive("blockquote") ? "bg-gray-200" : ""}`}
              title="인용구"
            >
              <Quote size={18} />
            </Button>
            <Button
              variant='icon'
              onClick={toggleCode}
              className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive("code") ? "bg-gray-200" : ""}`}
              title="코드"
            >
              <Code size={18} />
            </Button>
            <>
              <label
                htmlFor="image"
                className="inline-flex items-center p-2 rounded hover:bg-gray-200 cursor-pointer">
                <ImageIcon size={18} />
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadPostImg}
              />
            </>
            <div className="h-6 w-px bg-gray-300 mx-1"></div>
            <Button
              variant='icon'
              onClick={alignLeft}
              className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}`}
              title="왼쪽 정렬"
            >
              <AlignLeft size={18} />
            </Button>
            <Button
              variant='icon'
              onClick={alignCenter}
              className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""}`}
              title="가운데 정렬"
            >
              <AlignCenter size={18} />
            </Button>
            <Button
              variant='icon'
              onClick={alignRight}
              className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}`}
              title="오른쪽 정렬"
            >
              <AlignRight size={18} />
            </Button>
            <div className="h-6 w-px bg-gray-300 mx-1"></div>
            <Button
              variant='icon'
              onClick={undo}
              className="p-2 rounded hover:bg-gray-200"
              title="실행 취소"
              disabled={!editor?.can().undo()}
            >
              <Undo size={18} />
            </Button>
            <Button
              variant='icon'
              onClick={redo}
              className="p-2 rounded hover:bg-gray-200"
              title="다시 실행"
              disabled={!editor?.can().redo()}
            >
              <Redo size={18} />
            </Button>
          </div>
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className="flex bg-white shadow-lg rounded-lg border border-gray-200">
              <Button
                variant='icon'
                onClick={toggleBold}
                className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
              >
                <Bold size={16} />
              </Button>
              <Button
                variant='icon'
                onClick={toggleItalic}
                className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
              >
                <Italic size={16} />
              </Button>
            </div>
          </BubbleMenu>
        </>
      }

      {/* 에디터 */}
      <div className={
        editable
          ? 'min-h-[450px] border border-gray-200 rounded-lg py-2 px-4 mb-4'
          : ""
      }>
        <EditorContent
          editor={editor}
          className="tiptap max-w-none" />
      </div>
    </>
  )
});

export default PostEditor;