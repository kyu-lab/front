export default function SearchPage({ onClose, isDesktop }) {
  return (
    <div
        className={`fixed inset-0 z-50 flex flex-col ${
            isDesktop ? "hidden" : "block"
        } bg-gray-50 dark:bg-gray-900 text-white`}
    >
      <div className="flex items-center p-4 border-b border-gray-700">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full dark:bg-gray-800 text-white p-2 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent"
          />
          <svg
            className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="#9CA3AF"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
            />
          </svg>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-blue-400 hover:text-blue-300"
        >
          Cancel
        </button>
      </div>

      {/* 본문: 검색 기록 없음 메시지 */}
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">No recent searches</p>
      </div>
    </div>
  )
}