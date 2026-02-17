import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Welcome from './pages/Welcome';
import Login from './pages/Login'
import Signup from "./pages/Signup";
import CoverPage from "./pages/CoverPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/app' element={<Main />}></Route>
        <Route path="/home" element={<CoverPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
