export default function DropDown({menuOpen, children}) {
  return (
    <div
      className="absolute right-0 mt-2 w-56 z-10"
      style={{display: menuOpen ? "block" : "none"}}
    >
      {/* 동적 콘텐츠 */}
      {children}
    </div>
  )
}