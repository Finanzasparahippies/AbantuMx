import { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Redes from './pages/Redes';
import Perfil from './pages/Perfil';
import Contribuciones from './pages/Contribuciones';
import Contribucion from './pages/Contribucion';
import Reportes from './pages/Reportes';
import ReportesAdmin from './pages/ReportesAdmin';
import RedesAdmin from './pages/RedesAdmin';
import Login from './pages/Login';
import { AnimatePresence } from "framer-motion";
import Sidebar from "./partials/Sidebar";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import { FloatingWhatsApp } from 'react-floating-whatsapp'
import API from './utils/API';
import './css/style.css';


function App() {

  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]);
  
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
      <>
      <div className="flex h-screen w-full">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              <AnimatePresence>
                <Routes location={location} key={location.pathname}>
                  <Route exact path="/login" element={<Login />} />
                  <Route exact path="/" element={<Dashboard />} />
                  <Route path="*" element={<h1>404 Not Found</h1>} />
                  <Route exact path="/inicio/redes" element={<Redes />} />
                  <Route exact path="/inicio/mi-perfil" element={<Perfil />} />
                  <Route exact path="/inicio/contribuciones" element={<Contribuciones />} />
                  <Route exact path="/inicio/enviar-contribucion" element={<Contribucion />} />
                  <Route exact path="/inicio/reportes" element={<Reportes />} />
                  <Route exact path="/admin/reportes" element={<ReportesAdmin />} />
                  <Route exact path="/admin/redes" element={<RedesAdmin />} />
                </Routes>
              </AnimatePresence>
              <FloatingWhatsApp
                phoneNumber="526623669348"
                accountName="Soporte Abantu"
                avatar="https://i.imgur.com/depT4No.jpeg"
                chatMessage="Hola, ¿en qué podemos ayudarte?"
                statusMessage="En línea"
                backgroundColor="#25d366"
                buttonImage="whatsapp.png"
                placeholder="Escribe tu mensaje"
                />
            <Footer />
          </div>
      </div>
      </>
    );
}

export default App;
