import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {signUp} from "../service/usersService.js";

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [passWord, setPassWord] = useState("");

  const handleSignUp = async () => {
    try {
      const response = await signUp({name: name, passWord: passWord});
      alert(response.message);
      navigate('/login');
    } catch (error) {
      alert('회원 가입 실패');
      console.error("회원 가입 실패 ", error);
    }
  };


  return (
    <>
      <h1>SignUp Page</h1>
      <div>
        <input
            value={name}
            type={"text"}
            onChange={e => setName(e.target.value)}
            placeholder={"등록할 계정을 입력해주세요"}
        />
        <br />
        <input
            value={passWord}
            type={"password"}
            onChange={e => setPassWord(e.target.value)}
            placeholder={"비밀번호를 입력해주세요"}
        />
        <br />
        <button onClick={handleSignUp}>SignUp</button>
      </div>
      <Link to={"/login"}>Go to Login Page</Link>
    </>
  );
}