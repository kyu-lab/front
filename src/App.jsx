import { Route, Routes } from "react-router-dom";
import routes from "./utils/Routes.jsx";
import Header from "./pages/header/Header.jsx";

export default function App() {
  return (
    <div className="relative z-10 min-h-screen bg-gray-200">
      <Header />
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 p-4">
          <main className="w-full">
          <Routes>
            {
              routes.map((route, idx) => {
                return <Route key={idx} path={route.path} element={route.element} />
              })
            }
          </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}
