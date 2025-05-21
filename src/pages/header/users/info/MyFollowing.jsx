import React from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {
  User,
} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {Card, CardContent} from "@/components/ui/card.jsx";
import {Link} from "react-router-dom";

export function MyFollowing({myFollowingList}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {myFollowingList.map((following, index) => (
        <Card key={index} className="overflow-hidden rounded-md shadow hover:shadow-md transition-shadow">

          {/* 상단 배경 이미지 영역 */}
          <div className="h-24 w-full bg-gray-300">
            {following.bannerUrl && (
              <img
                src={following.bannerUrl}
                alt="배경 이미지"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* 사용자 정보 영역 */}
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Avatar className="w-10 h-10">
                <AvatarImage src={following.iconUrl} alt="user" />
                <AvatarFallback><User /></AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">
                <Link to={`/user/${following.userId}/info`} className="hover:underline">
                  {following.name}
                </Link>
              </h3>
            </div>
            <p className="text-sm text-gray-600">{following.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function MyFollowingLoading() {
  return (
    <>
    {Array(10)
      .fill(0)
      .map((_, index) => (
        <Card key={index} className="overflow-hidden rounded-md shadow hover:shadow-md transition-shadow">
          <div className="h-24 w-full bg-gray-300">
          </div>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <h3 className="text-lg font-semibold">
                <Skeleton className="h-4 w-[70px]" />
              </h3>
            </div>
            <p className="space-y-2">
              <Skeleton className="h-4 w-[50px]" />
              <Skeleton className="h-4 w-[10px]" />
              <Skeleton className="h-4 w-[150px]" />
            </p>
          </CardContent>
        </Card>
    ))}
    </>
  );
}