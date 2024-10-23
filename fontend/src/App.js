import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NavBar from "./Components/NavBar/NavBar";
import AppRoutes from "./Components/Routes/Routes";

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer />
      <NavBar />
      <AppRoutes />
    </Router>
  );
}

export default App;
