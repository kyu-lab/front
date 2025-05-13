import React, {useRef} from "react";

import uiStore from "../utils/uiStore.js";

export default function Dialog({isDesktop}) {
  const btnRef = useRef(null);
  const {isOpen, header, body, useMobileMode, hasPrevious, onBack, closeDialog} = uiStore(state => state.dialog);

  if (!isOpen) {
    return null;
  }

  // 데스크톱에서만 외부 클릭 시 닫기
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && isDesktop) {
      closeDialog();
    }
  };

  // 모바일 사용 유무에 따라 스타일 설정
  let styles = "rounded-3xl w-96 p-5 relative";
  if (useMobileMode) {
    styles = isDesktop ? "rounded-3xl w-96 p-5 relative" : "w-full h-full p-4";
  }

  // 뒤로 가기 버튼
  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack();
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* 데스크톱: 모달, 모바일: 전체 페이지 */}
      <div className={`bg-white dark:bg-gray-900 ${styles}`}>
        <div className="flex justify-between items-center mb-4">
          {
            hasPrevious &&
            <div>
              <button ref={btnRef} onClick={handleBack}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5 rounded-3xl text-black dark:text-white bg-gray-300">
                  <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/>
                </svg>
              </button>
            </div>
          }
          <div>
            <span className="text-black dark:text-gray-200">{header}</span>
          </div>
          <div>
            <button onClick={closeDialog}>
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5 rounded-3xl text-black dark:text-white bg-gray-300">
                <path d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" />
              </svg>
            </button>
          </div>
        </div>
        {/* 다이얼로그 본문 */}
        {body && React.cloneElement(body, {btnRef})}
      </div>
    </div>
  );
}