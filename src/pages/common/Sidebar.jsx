/* 미개발 */
export default function Sidebar() {
  return (
    <aside className="bg-white rounded-lg shadow w-64 p-4 hidden md:block">
      <h2 className="text-lg font-semibold mb-4">제목</h2>
      <ul className="space-y-2">
        <li><a href="#" className="text-blue-600 hover:underline">소제목</a></li>
        <li><span className="text-gray-600">보기1</span></li>
        <li><span className="text-gray-600">보기2</span></li>
        <li><span className="text-gray-600">보기3</span></li>
      </ul>
    </aside>
  );
}