export default function DropDown({ profileStatus, children }) {
  return (
    <div
      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-10"
      style={{ display: profileStatus ? "block" : "none" }}
      onMouseLeave={() => profileStatus(false)}
    >
      {/* 동적 콘텐츠 */}
      {children}
    </div>
  )
}