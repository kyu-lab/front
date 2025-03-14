import {Link} from "react-router-dom";

export default function Home() {
  return (
      <>
        <h1>메인페이지</h1>
        <nav>
          <Link to={"login"}>Login</Link>
        </nav>
      </>
  )
}