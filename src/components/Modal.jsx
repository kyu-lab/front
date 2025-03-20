export default function Modal({ onClose, children, isDesktop }) {
  // 데스크톱에서만 외부 클릭 시 닫기
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && isDesktop) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* 데스크톱: 모달, 모바일: 전체 페이지 */}
      <div
        className={`bg-white dark:bg-gray-900 ${
          isDesktop
            ? 'rounded-lg w-full max-w-md p-6 mx-4 md:mx-0 md:max-w-lg relative'
            : 'w-full h-full p-4'
        }`}
      >

      {/* 동적 콘텐츠 */}
      {children}
      </div>
    </div>
  );
}