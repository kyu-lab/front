import React, {useState} from "react";
import userStore from "../../../utils/userStore.js";
import uiStore from "../../../utils/uiStore.js";
import {alertStatus, promptStatus} from "@/utils/enums.js";

import {followUser, unFollowUser} from "@/service/FollowService.js";
import {formatRelativeTime} from "@/utils/dateUtils.js";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {
  BookMarked,
  CalendarIcon,
  Eye,
  EyeOff,
  Flag, Heart, MessageCircle,
  MoreHorizontal,
  User,
  UserMinus,
  UserRoundPlus
} from "lucide-react";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Link} from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";

export default function PostInfo({postListItemDto, writerInfo}) {
  // 사용자
  const {isLogin, userInfo} = userStore(state => state);
  const isPossibleFollow = userInfo.id !== writerInfo.id && writerInfo.id !== -1;

  // ui 제어
  const {openAlert} = uiStore((state) => state.alert);
  const {openPrompt} = uiStore((state) => state.prompt);

  // 상태관리
  const [isFollow, setIsFollow] = useState(writerInfo?.isFollow || false);

  const handleUserFollow = async () => {
    try {
      const isFollow = await openPrompt({message: `${writerInfo.name}을 구독 할까요?`, type: promptStatus.INFO});
      if (isFollow) {
        const response = await followUser(writerInfo.id);
        if (response.status === 200) {
          openAlert({message: "구독하였습니다.", type: alertStatus.SUCCESS});
          setIsFollow(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleUserUnFollow = async (writerInfo) => {
    try {
      const isUnFollow = await openPrompt({message: `${writerInfo.name}을 구독 해지 하시겠습니까?`, type: promptStatus.WARN});
      if (isUnFollow) {
        const response = await unFollowUser(writerInfo.id);
        if (response.status === 200) {
          openAlert({message: "구독 해지하였습니다.", type: alertStatus.SUCCESS});
          setIsFollow(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="max-w-2xl px-6 py-4 bg-white rounded-2xl shadow-md dark:bg-gray-900">
      {/* 헤드라인 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center">
            <HoverCard>
              <Avatar className="h-8 w-8">
                <AvatarImage src={writerInfo.imgUrl} alt="user" />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <HoverCardTrigger asChild>
                <Button variant="link">{writerInfo.name}</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto rounded-2xl">
                <div className="flex space-x-4">
                  <Avatar className="h-7 w-7 cursor-pointer">
                    <AvatarImage src={writerInfo.imgUrl} alt="user" />
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">
                      <Link to={`/user/${writerInfo.id}/info`} className="hover:underline">
                        {writerInfo.name}
                      </Link>
                      {isPossibleFollow &&
                        <Button onClick={handleUserFollow}>
                          <UserRoundPlus /> 팔로우
                        </Button>
                      }
                      {isFollow &&
                        <Button onClick={handleUserUnFollow}>
                          <UserMinus /> 언팔로우
                        </Button>
                      }
                    </h4>
                    <p className="text-sm">
                      사용자 설명!
                    </p>
                    <div className="flex items-center pt-2">
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                      <span className="text-xs text-muted-foreground">
                        사용자 가입일!
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">{formatRelativeTime(postListItemDto.createdAt)}</span>
        </div>
        {isLogin &&
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="더보기" className="p-2" variant="icon">
                <MoreHorizontal size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup>
                <DropdownMenuItem>
                  <Flag /> 신고
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <EyeOff /> 숨기기
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookMarked /> 저장
                </DropdownMenuItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      </div>

      <Link to={`/post/${postListItemDto.id}`}>
        <div className="max-w-2xl overflow-hidden bg-white dark:bg-gray-900">
          <div className="px-1.5 py-3">
            <span className="block mt-2 text-xl font-semibold text-gray-800 transition-colors duration-300 transform dark:text-white hover:text-gray-600">
              {postListItemDto.subject}
            </span>
            <div
              className="dark:text-white text-sm"
              dangerouslySetInnerHTML={{__html : postListItemDto.summary}}
            />
          </div>
        </div>

        {/* 댓글 */}
        <div className="flex justify-between mt-4">
          <Button
            variant="icon"
            className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors duration-300">
            <Heart />{postListItemDto.viewCount}
          </Button>
          <Button variant="icon" className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors duration-300">
            <Eye />{postListItemDto.viewCount}
          </Button>
          <Button variant="icon" className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors duration-300">
            <MessageCircle />{postListItemDto.commentCount}
          </Button>
        </div>
      </Link>
    </div>
  );
}