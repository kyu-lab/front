import React, {useEffect, useRef, useState} from "react";
import Editor from "../../../components/PostEditor.jsx";
import {getPost, savePost, updatePost} from "@/service/postService.js";
import {useNavigate, useParams} from "react-router-dom";
import uiStore from "../../../utils/uiStore.js";
import userStore from "../../../utils/userStore.js";
import {alertStatus} from "@/utils/enums.js";
import {getGroups} from "@/service/groupService.js";

import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {Input} from "@/components/ui/input";
import {Label} from "@radix-ui/react-dropdown-menu";

export default function Write() {
  // 파라미터
  const {id} = useParams();

  // 페이지 이동
  const navigate = useNavigate();

  // 사용자 데이터
  const [groups, setGroups] = useState([]);
  const [selectGroup, setSelectGroup] = useState({});
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  // 컴포넌트 제어
  const [isUpdate, setIsUpdate] = useState(false);

  // ui 제어
  const {openAlert} = uiStore((state) => state.alert);
  const {isLogin, userInfo} = userStore(state => state);

  // 에디터 제어
  const editorRef = useRef(null);

  // 셀렉트박스 제어
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (!isLogin) {
      navigate("/");
    }

    // 기본값 세팅
    const userId = userInfo.id;
    const label = userInfo.name + ' (사용자)';
    setGroups([{
      value: userId,
      label: label,
      isGroup: false
    }]);

    if (id === null || id === undefined) {
      void getGroupList();
    } else {
      const getPostInfo = async () => {
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

      const requestData = {
        groupDto: {
          boolean: selectGroup.isGroup,
          groupId : selectGroup.value
        },
        contentDto: {
          subject: subject,
          content: sanitizeHtml(removeScriptTags(editorRef.current.getHTML())),
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

  function removeScriptTags(html) {
    const div = document.createElement('div');
    div.innerHTML = html;

    // script 태그 제거
    const scripts = div.querySelectorAll('script');
    scripts.forEach(script => script.remove());

    return div.innerHTML;
  }

  function sanitizeHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;

    // script 태그 제거
    div.querySelectorAll('script').forEach(el => el.remove());

    // 위험 속성 제거
    const dangerousAttrs = ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'oninput'];
    div.querySelectorAll('*').forEach(el => {
      dangerousAttrs.forEach(attr => {
        if (el.hasAttribute(attr)) {
          el.removeAttribute(attr);
        }
      });

      // javascript: 제거
      [...el.attributes].forEach(attr => {
        if (attr.value.toLowerCase().startsWith('javascript:')) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return div.innerHTML;
  }

  const handleUpdatePost = async () => {
    try {
      const requestData = {
        postId: id,
        groupId: groupId,
        subject: subject,
        content: sanitizeHtml(removeScriptTags(editorRef.current.getHTML()))
      }
      const respnose = await updatePost(requestData);
      navigate(respnose.headers.get("Location"));
    } catch (error) {
      openAlert({message: "잠시 후 다시 등록해주세요.", type: alertStatus.ERROR});
      console.error("게시글 저장 실패 :", error);
    }
  }

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6 bg-gray-100 dark:bg-gray-900">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg w-full">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-white">
          {isUpdate ? `글 수정` : '글 작성'}
        </h2>

        {/* 그룹 선택 */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[250px] justify-between"
            >
              {selectGroup.value
                ? groups.find((group) => group.value === selectGroup.value)?.label
                : `작성할 장소를 선택해주세요.`}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0">
            <Command>
              <CommandInput placeholder="작성 장소 검색" className="h-9" />
              <CommandList>
                <CommandEmpty>찾을 수 없음.</CommandEmpty>
                <CommandGroup>
                  {groups.map((group) => (
                    <CommandItem
                      key={group.value}
                      value={group.label}
                      onSelect={() => {
                        setSelectGroup(group)
                        setOpen(false)
                      }}
                    >
                      {group.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          selectGroup.value === group.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* 제목 입력 */}

        <div className="grid py-5 w-full max-w-sm items-center gap-1.5">
          <Label>제목 ({subject.length}/100)</Label>
          <Input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={100}
            placeholder="제목을 입력해주세요."
            className="w-full p-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 text-black dark:text-white"
          />
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
          <Button
            variant="outline"
            className="bg-blue-50 text-blue-500 px-4 py-2 rounded-full"
            onClick={isUpdate ? handleUpdatePost : handleSavePost}
          >
            {isUpdate ? `수정` : '게시'}
          </Button>
        </div>
      </div>
    </div>
  );
}
