import "./App.css";
import HomePage from "./Components/Home/HomePage";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import NavBar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";
import Room from "./Components/Rooms/Room";

import 'react-toastify/dist/ReactToastify.css';

function Layout() {
  const location = useLocation(); // Lấy đường dẫn hiện tại

  return (
    <>
      <NavBar />
      <div className="App"> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/room" element={<Room />} />
        </Routes>
      </div>
      {/* Footer sẽ chỉ hiển thị khi không phải ở trang login hoặc register */}
      {location.pathname !== '/login' && location.pathname !== '/register' && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer />
      <Layout />
    </Router>
  );
}

export default App;
