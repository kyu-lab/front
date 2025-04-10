import uiStore from "../utils/uiStore.js";
import {promptStatus} from "../utils/enums.js";

export default function Prompt() {
  const {isOpen, message, type, closePrompt, onConfirm, onCancel} = uiStore((state) => state.prompt);

  if (!isOpen) {
    return null;
  }

  let img;
  switch (type) {
    case promptStatus.ERROR:
      img = <FailImg/>
      break;
    case promptStatus.WARN:
      img = <WarnImg/>
      break;
    case promptStatus.INFO:
      img = <InfoImg/>
      break;
    default:
      img = <SuccessImg/>
      break;
  }

  // "Yes" 선택 시 콜백 호출
  const handleYesClick = () => {
    if (onConfirm) {
      onConfirm(); // true를 반환
    }
    closePrompt();
  };

  // "No" 선택 시 콜백 호출
  const handleNoClick = () => {
    if (onCancel) {
      onCancel(); // false를 반환
    }
    closePrompt();
  };

  return (
    <div
      role="prompt"
      className="fixed top-5 left-1/2 transform -translate-x-1/2 rounded-md border border-gray-300 bg-white dark:bg-gray-800 p-4 shadow-sm z-50 max-w-md w-full"
    >
      <div className="flex items-start gap-4">
        {img}

        <div className="flex-1">
          <p className="mt-0.5 text-sm text-gray-700 dark:text-white">{message}</p>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleYesClick}
              type="button"
              className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100"
            >
              Yes
            </button>
            <button
              onClick={handleNoClick}
              type="button"
              className="rounded border border-transparent px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              No
            </button>
          </div>
        </div>

        <button
          onClick={closePrompt}
          className="-m-1 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
          type="button"
          aria-label="Dismiss alert"
        >
          <span className="sr-only">Close Prompt</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export const SuccessImg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6 text-green-600"
      >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

export const InfoImg = () => {
  return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6 text-blue-600">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>
      </svg>
  )
}

export const WarnImg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
     className="size-6 text-yellow-600">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/>
    </svg>
  )
}

export const FailImg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6 text-red-600">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
    </svg>
  )
}