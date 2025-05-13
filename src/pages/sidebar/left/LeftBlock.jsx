import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

/* 왼쪽 사이드바 공간 채우기용 */
export default function LeftBlock() {
  return (
    <div className="w-0 md:w-64 p-4 fixed lg:static shrink-0" />
  )
}