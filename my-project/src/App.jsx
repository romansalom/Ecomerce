
import './App.css'
import { Route, Routes, useLocation } from "react-router-dom";
import Home from './pages/home/home';
import Registro from './pages/home/register';
function App() {

  return (
    <div>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registro" element={<Registro />} />
      </Routes>

    </div>
   
  )
}

export default App
