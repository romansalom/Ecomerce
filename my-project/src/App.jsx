
import './App.css'
import { Route, Routes, useLocation } from "react-router-dom";
import Home from './pages/home/home'
function App() {

  return (
    <div>
      <Routes>
      <Route path="/" element={<Home />} />
      </Routes>

    </div>
   
  )
}

export default App
