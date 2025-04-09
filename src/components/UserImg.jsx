import React from "react";

export default function UserImg({imgUrl}) {
  const IMAGE_URL = import.meta.env.VITE_BASE_API_URL + "/file";
  return (
    <>
      {imgUrl &&
        <img
          src={IMAGE_URL + imgUrl}
          alt="UserImg"
          className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center"
        />
      }
      {!imgUrl &&
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-5 h-5 text-black dark:text-blue-100">
          <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      }
    </>

  )
}