/* 미개발 */
export default function UserSidebar() {
  return (
    <aside className="bg-white rounded-lg shadow w-64 p-4 hidden md:block">
      <h2 className="text-lg font-semibold mb-4">사용자 공간</h2>
      <ul className="space-y-2">
        <li><a href="#" className="text-blue-600 hover:underline">r/AskMen</a></li>
        <li><a href="#" className="text-blue-600 hover:underline">r/Women</a></li>
        <li><a href="#" className="text-blue-600 hover:underline">r/apple</a></li>
      </ul>
    </aside>
  );
}