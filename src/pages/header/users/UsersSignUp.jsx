import {useState} from "react";

import {signUp} from "./service/usersService.js";

export default function UsersSignUp() {
  const [name, setName] = useState("");
  const [password, setPassWord] = useState("");

  const handleSignUp = async () => {
    try {
      const response = await signUp({name: name, passWord: password});
      alert(response.message);
    } catch (error) {
      alert('회원 가입 실패');
      console.error("회원 가입 실패 ", error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white">Username</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
          placeholder="Choose a username"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white">Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
          placeholder="Create a password"
          onChange={(e) => setPassWord(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        onClick={handleSignUp}
      >
        Sign Up
      </button>
    </div>
  );
}