import React, {useEffect, useRef, useState} from 'react';
import userStore from "../../../utils/userStore.js";
import {useNavigate, useParams} from "react-router-dom";
import {uploadUserImg} from "@/service/fileService.js";
import {alertStatus} from "@/utils/enums.js";
import uiStore from "../../../utils/uiStore.js";
import {getUserInfo} from "@/service/usersService.js";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {Camera, Edit, Upload, User, UserPlus} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {getUserkMarkPost, getUserPosts} from "@/service/postService.js";
import {getFollower, getFollowing} from "@/service/FollowService.js";
import {MyPost, MyPostLoading} from "@/pages/header/users/info/MyPost.jsx";
import {MyFollower, MyFollowerLoading} from "@/pages/header/users/info/MyFollower.jsx";
import {MyFollowing, MyFollowingLoading} from "@/pages/header/users/info/MyFollowing.jsx";
import {MyPostMark, MyPostMarkLoading} from "@/pages/header/users/info/MyPostMark.jsx";
import {MyGroup, MyGroupLoading} from "@/pages/header/users/info/MyGroup.jsx";
import {getUserGroupList} from "@/service/groupService.js";

export default function UsersInfo() {
  // 파라미터
  const {id} = useParams();

  // 페이지이동
  const navigate = useNavigate();

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

    fetchData();
  }, []);

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

  // 탭 관리
  const activeTab = useRef('WRITE-POST');
  const [prevActiveTab, setPrevActiveTab] = useState('');
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState([]);
  const nextCursorRef = useRef(null); // 다음 커서 관리
  const hasMoreRef = useRef(true); // 더 불러올 데이터가 있는지
  const observerRef = useRef(null);

  const fetchData = () => {
    if (prevActiveTab !== activeTab.current) {
      setActivities([]);
      hasMoreRef.current = true;
      nextCursorRef.current = null;
    }

    setLoading(true);
    switch (activeTab.current) {
      case "WRITE-POST":
        void handlePosts();
        break;
      case "MARK-POST":
        void handleMarkPost();
        break;
      case "FOLLOWER":
        void handleFollower();
        break;
      case "FOLLOWING":
        void handleFollowing();
        break;
      case "GROUP":
        void handleGroupList();
        break;
      default:
        navigate("/error500");
        break;
    }
    setPrevActiveTab(activeTab.current);
  }

  const handlePosts = async () => {
    if (!hasMoreRef.current || loading.current) { // 중복 조회 방지
      return;
    }
    try {
      const response = await getUserPosts(id, nextCursorRef.current);
      if (response.postItems.length > 0) {
        setActivities((prev) => [...prev, ...response.postItems]);
      }
      hasMoreRef.current = response.hasMore;
      nextCursorRef.current = response.nextCursor;
    } catch (error) {
      console.error(`게시글 로드 실패 : ${error}`);
      navigate('/error404');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPost = async () => {
    if (!hasMoreRef.current || loading.current) { // 중복 조회 방지
      return;
    }
    try {
      const response = await getUserkMarkPost(id, nextCursorRef.current);
      if (response.postItems.length > 0) {
        setActivities((prev) => [...prev, ...response.postItems]);
      }
      hasMoreRef.current = response.hasMore;
      nextCursorRef.current = response.nextCursor;
    } catch (error) {
      console.error(`게시글 로드 실패 : ${error}`);
      navigate('/error404');
    } finally {
      setLoading(false);
    }
  };

  const handleFollower = async () => {
    if (!hasMoreRef.current || loading.current) { // 중복 조회 방지
      return;
    }
    try {
      const response = await getFollower(id, nextCursorRef.current);
      if (response.userList.length > 0) {
        setActivities((prev) => [...prev, ...response.userList]);
      }
      hasMoreRef.current = response.hasMore;
      nextCursorRef.current = response.nextCursor;
    } catch (error) {
      console.error(`팔로워 로드 실패 : ${error}`);
      navigate('/error404');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowing = async () => {
    if (!hasMoreRef.current || loading) { // 중복 조회 방지
      return;
    }
    try {
      const response = await getFollowing(id, nextCursorRef.current);
      if (response.userList.length > 0) {
        setActivities((prev) => [...prev, ...response.userList]);
      }
      hasMoreRef.current = response.hasMore;
      nextCursorRef.current = response.nextCursor;
    } catch (error) {
      console.error(`팔로워 로드 실패 : ${error}`);
      navigate('/error404');
    } finally {
      setLoading(false);
    }
  };

  const handleGroupList = async () => {
    if (!hasMoreRef.current || loading) { // 중복 조회 방지
      return;
    }
    try {
      const response = await getUserGroupList(id, nextCursorRef.current);
      if (response.groupList.length > 0) {
        setActivities((prev) => [...prev, ...response.groupList]);
      }
      hasMoreRef.current = response.hasMore;
      nextCursorRef.current = response.nextCursor;
    } catch (error) {
      console.error(`팔로워 로드 실패 : ${error}`);
      navigate('/error404');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="relative">
        <div className="h-60 w-full bg-gradient-to-r bg-gray-300 relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className='absolute bottom-4 right-4 bg-white/80 hover:bg-white'>
                <Camera className="h-4 w-4 mr-2" /> 커버 변경
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup>
                <DropdownMenuRadioItem>배경 업로드</DropdownMenuRadioItem>
                <DropdownMenuRadioItem>배경 삭제</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Input
            id="backgroundImg"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadBackgroundImg}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 pb-4 relative">
          {/* 프로필 이미지 */}
          <div className="absolute -top-20 left-8 rounded-full border-4 border-white bg-white shadow-sm">
            <Avatar className="w-36 h-36 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center overflow-hidden relative">
              <AvatarImage src={name || undefined} alt={<User />} />
              <AvatarFallback><User className="w-full h-full" /></AvatarFallback>
            </Avatar>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="icon" className='absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white'>
                  <Upload className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup>
                  <DropdownMenuRadioItem>이미지 업로드</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem>이미지 삭제</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Input
              id="userImg"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadUserImg}
            />
          </div>

          {/* 사용자 정보 및 액션 버튼 */}
          <div className="pt-24 pb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{name}</h1>
              <p className="text-gray-600 mt-1">자기 소개란</p>
              <div className="flex gap-6 mt-3">
                <div>
                  <span className="font-semibold">{postCount}</span>
                  <span className="text-gray-600 text-sm ml-1">게시물</span>
                </div>
                <div>
                  <span className="font-semibold">{followCount}</span>
                  <span className="text-gray-600 text-sm ml-1">팔로워</span>
                </div>
                <div>
                  <span className="font-semibold">{followingCount}</span>
                  <span className="text-gray-600 text-sm ml-1">팔로잉</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {Number(id) !== userInfo.id && (
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="h-4 w-4 mr-2" />팔로우
                  </Button>
                )}
              {Number(id) === userInfo.id && (
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />프로필 편집
                  </Button>
                )}
            </div>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue={`${activeTab.current}`}
        onValueChange={(value) => {
          activeTab.current = value;
          fetchData();
        }}
        className="max-w-5xl mx-auto px-4 py-4"
      >
        <TabsList className="flex gap-2 border-b p-2">
          <TabsTrigger value="WRITE-POST" className="px-4 py-2">작성글</TabsTrigger>
          <TabsTrigger value="MARK-POST" className="px-4 py-2">북마크</TabsTrigger>
          <TabsTrigger value="FOLLOWER" className="px-4 py-2">팔로워</TabsTrigger>
          <TabsTrigger value="FOLLOWING" className="px-4 py-2">팔로잉</TabsTrigger>
          <TabsTrigger value="GROUP" className="px-4 py-2">그룹</TabsTrigger>
        </TabsList>

        <TabsContent value="WRITE-POST">
          {(loading && activities) ? <MyPostLoading /> : <MyPost myPostList={activities} />}
          {
            (!loading && activities.length === 0) &&
            <div className="mt-2 flex items-center justify-center h-full text-gray-500 text-center px-4">
              작성된 게시글이 없습니다.
            </div>
          }
        </TabsContent>
        <TabsContent value="MARK-POST">
          {loading ? <MyPostMarkLoading /> : <MyPostMark myPostList={activities} />}
          {
            (!loading && activities.length === 0) &&
            <div className="mt-2 flex items-center justify-center h-full text-gray-500 text-center px-4">
              북마크한 게시글이 없습니다.
            </div>
          }
        </TabsContent>
        <TabsContent value="FOLLOWER">
          {loading ? <MyFollowerLoading /> : <MyFollower myFollowerList={activities} />}
          {
            (!loading && activities.length === 0) &&
            <div className="mt-2 flex items-center justify-center h-full text-gray-500 text-center px-4">
              팔로우한 사용자가 없습니다.
            </div>
          }
        </TabsContent>
        <TabsContent value="FOLLOWING">
          {loading ? <MyFollowingLoading /> : <MyFollowing myFollowingList={activities} />}
          {
            (!loading && activities.length === 0) &&
            <div className="mt-2 flex items-center justify-center h-full text-gray-500 text-center px-4">
              팔로잉 사용자가 없습니다.
            </div>
          }
        </TabsContent>
        <TabsContent value="GROUP">
          {loading ? <MyGroupLoading /> : <MyGroup myGroupList={activities} />}
          {
            (!loading && activities.length === 0) &&
            <div className="mt-2 flex items-center justify-center h-full text-gray-500 text-center px-4">
              참여한 그룹이 없습니다.
            </div>
          }
        </TabsContent>
      </Tabs>
    </div>
  );
}
