import React from "react";
import {formatRelativeTime} from "@/utils/dateUtils.js";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {
  Eye,
  Heart, MessageCircle,
  User,
} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Link} from "react-router-dom";
import {Skeleton} from "@/components/ui/skeleton.jsx";

export function MyPost({myPostList}) {
  return (
    <div className="max-w-5xl">
      {myPostList.map((myPost, index) => (
      <div key={index} className='px-6 py-4 bg-white rounded-2xl shadow-md dark:bg-gray-900 space-y-4'>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={myPost.writerInfo.imgUrl} alt="user" />
                <AvatarFallback><User /></AvatarFallback>
              </Avatar>
              {myPost.writerInfo.name}
            </div>
            <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">{formatRelativeTime(myPost.postListItemDto.createdAt)}</span>
          </div>
        </div>

        <Link to={`/post/${myPost.postListItemDto.id}`}>
          <div className="max-w-2xl overflow-hidden bg-white dark:bg-gray-900">
            <div className="px-1.5 py-3">
                <span className="block mt-2 text-xl font-semibold text-gray-800 transition-colors duration-300 transform dark:text-white hover:text-gray-600">
                  {myPost.postListItemDto.subject}
                </span>
              <div
                className="dark:text-white text-sm"
                dangerouslySetInnerHTML={{__html : myPost.postListItemDto.summary}}
              />
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button
              variant="icon"
              className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors duration-300">
              <Heart />{myPost.postListItemDto.likeCount}
            </Button>
            <Button variant="icon" className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors duration-300">
              <Eye />{myPost.postListItemDto.viewCount}
            </Button>
            <Button variant="icon" className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors duration-300">
              <MessageCircle />{myPost.postListItemDto.commentCount}
            </Button>
          </div>
       </Link>
      </div>
      ))}
    </div>
  );
}

export function MyPostLoading() {
  return (
    <>
    {Array(7)
    .fill(0)
    .map((_, index) => (
      <div key={index} className="max-w-3xl px-6 py-4 bg-white rounded-2xl shadow-md dark:bg-gray-900">
        <div className='space-x-0.5'>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-[50px]" />
              </div>
              <Skeleton className="h-4 w-[30px]" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[350px]" />
          </div>
        </div>
      </div>
    ))}
    </>
  );
}