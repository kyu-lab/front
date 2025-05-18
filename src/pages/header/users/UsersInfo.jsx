import React, {useEffect, useState} from 'react';
import userStore from "../../../utils/userStore.js";
import {useNavigate, useParams} from "react-router-dom";
import {uploadUserImg} from "@/service/fileService.js";
import {alertStatus} from "@/utils/enums.js";
import uiStore from "../../../utils/uiStore.js";
import {getUserInfo} from "@/service/usersService.js";
import {Card, CardContent} from "@/components/ui/card.jsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {Camera, Clock, Eye, MessageSquare, ThumbsUp, Upload, User} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";
import {ScrollArea} from "@/components/ui/scroll-area.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";

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
  const [postCount, setPostCount] = useState(0);
  const [followCount, setFollowCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [userImg, setUserImg] = useState(null);
  const [backgroundImage, setbackgroundImage] = useState(null);

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
          setPostCount(data.postCount);
          setFollowCount(data.followerCount);
          setFollowingCount(data.followingCount);
        }
      } catch (error) {

      }
    }
    void loadUserInfo();
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

  const handleUploadBackgroundImg = async (e) => {
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

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the user's activity from an API
    // For this example, we'll use mock data
    const mockActivities = [
      {
        id: 1,
        type: "like",
        content: "게시물에 좋아요를 눌렀습니다",
        date: "2023-05-15T10:30:00",
        target: "여행 사진 모음",
      },
      {
        id: 2,
        type: "comment",
        content: "댓글을 작성했습니다: '정말 멋진 사진이네요!'",
        date: "2023-05-14T15:45:00",
        target: "제주도 여행기",
      },
      {
        id: 3,
        type: "view",
        content: "게시물을 조회했습니다",
        date: "2023-05-14T09:20:00",
        target: "맛집 추천",
      },
      {
        id: 4,
        type: "like",
        content: "게시물에 좋아요를 눌렀습니다",
        date: "2023-05-13T18:10:00",
        target: "일상 스케치",
      },
      {
        id: 5,
        type: "comment",
        content: "댓글을 작성했습니다: '좋은 정보 감사합니다'",
        date: "2023-05-12T11:05:00",
        target: "여행 팁",
      },
      {
        id: 6,
        type: "view",
        content: "게시물을 조회했습니다",
        date: "2023-05-11T14:30:00",
        target: "사진 촬영 팁",
      },
      {
        id: 7,
        type: "like",
        content: "게시물에 좋아요를 눌렀습니다",
        date: "2023-05-10T20:15:00",
        target: "일상 공유",
      },
    ]

    // Simulate API delay
    setTimeout(() => {
      setActivities(mockActivities)
      setLoading(false)
    }, 1000)
  }, [userId])

  const getActivityIcon = (type) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="h-4 w-4 text-rose-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "view":
        return <Eye className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const filterActivities = (type) => {
    if (type === "all") return activities
    return activities.filter((activity) => activity.type === type)
  }

  return (
    <div className="flex flex-col gap-6 bg-gray-100 dark:bg-gray-900">
      <div className="min-h-screen bg-gray-100">
        <Card className="absolute w-full overflow-hidden">
          <div
            className="h-40 w-full"
            style={{
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : "linear-gradient(to right, #4f46e5, #3b82f6)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bottom-2 right-2 rounded-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="" className='rounded-full'>
                    <Camera className="h-4 w-4 mr-2" /> 배경이미지
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup>
                    <DropdownMenuRadioItem>
                      배경 업로드
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem>
                      배경 삭제
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* 사용자 이미지와 소개 */}
          <CardContent className="relative px-40">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-10 mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src={name || undefined} alt={<User />} />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>

                {/* Profile image button */}
                <div className="absolute -bottom-0 right-1 h-8 w-8">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="icon" className='rounded-full bg-gray-200'>
                        <Upload className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuRadioGroup>
                        <DropdownMenuRadioItem>
                          이미지 업로드
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem>
                          이미지 삭제
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold">{name}</h2>
                <p className="text-muted-foreground">ㅇㅇ</p>
              </div>
            </div>

            <div className="flex gap-4 mt-4 ml-20">
              <div className="text-center">
                <span className="font-bold">{postCount}</span> <span className="text-sm text-muted-foreground">게시물</span>
              </div>
              <div className="text-center">
                <span className="font-bold">{followCount}</span> <span className="text-sm text-muted-foreground">팔로워</span>
              </div>
              <div className="text-center">
                <span className="font-bold">{followingCount}</span> <span className="text-sm text-muted-foreground">팔로잉</span>
              </div>
            </div>
          </CardContent>

          {/* 사용자 이미지 */}
          <Input
            id="userImg"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadUserImg}
          />

          {/* 백그라운드 */}
          <Input
            id="backgroundImg"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadBackgroundImg}
          />

          {/* 본문 */}
          <CardContent className="relative px-40">
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="like">좋아요</TabsTrigger>
                <TabsTrigger value="comment">댓글</TabsTrigger>
                <TabsTrigger value="view">조회</TabsTrigger>
              </TabsList>

              {["all", "like", "comment", "view"].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <ScrollArea className="h-[300px] pr-4">
                    {loading ? (
                      <div className="space-y-4">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i} className="flex items-start gap-4 py-4">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="space-y-4 pt-2">
                        {filterActivities(tab).length > 0 ? (
                          filterActivities(tab).map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4 py-4 border-b last:border-0">
                              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                {getActivityIcon(activity.type)}
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium">{activity.content}</p>
                                <p className="text-xs text-muted-foreground">
                                  {activity.target} • {formatDate(activity.date)}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center text-muted-foreground">활동 내역이 없습니다</div>
                        )}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
