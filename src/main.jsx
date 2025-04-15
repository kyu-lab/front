import "./styles/main.css"
import App from './App.jsx'

// import { StrictMode } from 'react' 개발에 필요시 사용
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
