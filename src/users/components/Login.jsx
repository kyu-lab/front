import {useState} from "react";
import {login} from "../service/usersService.js";
import {Link} from "react-router-dom";

export default function Login() {
  const[name, setName] = useState("");
  const[passWord, setPassWord] = useState("");

  const handleLogin = async () => {
    try {
      const response = await login({name: name, passWord: passWord});
      console.log("로그인 성공:", response);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <>
      <h1>Login Page</h1>
      <div>
      <input
        value={name}
        type={"text"}
        onChange={e => setName(e.target.value)}
        placeholder={"접속할 계정을 입력해주세요"}
      />
      <br />
      <input
          value={passWord}
          type={"password"}
          onChange={e => setPassWord(e.target.value)}
          placeholder={"비밀번호를 입력해주세요"}
      />
      <br />
      <button onClick={handleLogin}>Login</button>
      </div>
      <Link to={"/sign-up"}>Go to SignUp Page</Link>
    </>
  )
}