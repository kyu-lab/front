import React from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {
  User,
} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {Card, CardContent} from "@/components/ui/card.jsx";
import {Link} from "react-router-dom";

export function MyFollower({myFollowerList}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {myFollowerList.map((follower, index) => (
        <Card key={index} className="overflow-hidden rounded-md shadow hover:shadow-md transition-shadow">

          {/* 상단 배경 이미지 영역 */}
          <div className="h-24 w-full bg-gray-300">
            {follower.bannerUrl && (
              <img
                src={follower.bannerUrl}
                alt="배경 이미지"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* 사용자 정보 영역 */}
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Avatar className="w-10 h-10">
                <AvatarImage src={follower.iconUrl} alt="user" />
                <AvatarFallback><User /></AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">
                <Link to={`/user/${follower.userId}/info`} className="hover:underline">
                  {follower.name}
                </Link>
              </h3>
            </div>
            {/*<p className="text-sm text-gray-600">{follower.description}</p>*/}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function MyFollowerLoading() {
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
                <Skeleton className="h-4 w-[50px]" />
              </h3>
            </div>
            <p className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[50px]" />
              <Skeleton className="h-4 w-[100px]" />
            </p>
          </CardContent>
        </Card>
    ))}
    </>
  );
}