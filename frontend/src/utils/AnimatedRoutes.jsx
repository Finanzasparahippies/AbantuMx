import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from '../pages/Dashboard';
import Redes from '../pages/Redes';
import Perfil from '../pages/Perfil';
import Contribuciones from '../pages/Contribuciones';
import Login from '../pages/Login';
import { AnimatePresence } from "framer-motion";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import API from './API';

function AnimatedRoutes() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  if (!localStorage.getItem('token')) {
    return <Login />;
  } else {
    const checkToken = async () => {
      await API.post('/api/users/check-token/', {
        token: localStorage.getItem('token')
      }).then(res => {
        console.log(res.data.message);
      }).catch(err => {
          localStorage.clear();
          window.location.href = '/';
      });
  }   
  checkToken();
  }

  return (
    <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <AnimatePresence>
              <Routes location={location} key={location.pathname}>
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/" element={<Dashboard />} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
                <Route exact path="/redes" element={<Redes />} />
                <Route exact path="/mi-perfil" element={<Perfil />} />
                <Route exact path="/contribuciones" element={<Contribuciones />} />
              </Routes>
            </AnimatePresence>
          <Footer />
        </div>
    </div>
  );
}

export default AnimatedRoutes;