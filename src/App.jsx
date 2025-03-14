import {Route, Routes} from "react-router-dom";
import routes from "./common/routes.jsx";

// 깃허브 테스트
export default function App() {
  return (
    <>
      <Routes>
        {
          routes.map((route, idx) => {
            return <Route key={idx} path={route.path} element={route.element} />
          })
        }
      </Routes>
    </>
  )
}
