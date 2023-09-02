import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from '../pages/Dashboard';
import Usuarios from '../pages/Usuarios';
import Login from '../pages/Login';
import Productos from "../pages/productos/Productos";
import Categorias from "../pages/categorias/Categorias";
import Almacenes from "../pages/almacenes/Almacenes";
import Movimientos from "../pages/movimientos/Movimientos";
import Ventas from "../pages/pos/Ventas";
import VentasList from "../pages/pos/VentasList";
import Stocks from "../pages/stock/Stocks";
import { AnimatePresence } from "framer-motion";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import Footer from "../partials/Footer";

function AnimatedRoutes() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <AnimatePresence>
          <Routes location={location} key={location.pathname}>
            {/* Core */}
            <Route path="/login" element={<Login />} />
            <Route exact path="/" element={<Dashboard />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
            <Route exact path="/usuarios" element={<Usuarios />} />
            {/* Inventario */}
            <Route exact path="/inventario/productos" element={<Productos />} />
            <Route exact path="/inventario/categorias" element={<Categorias />} />
            <Route exact path="/inventario/almacenes" element={<Almacenes />} />
            <Route exact path="/inventario/stocks" element={<Stocks />} />
            <Route exact path="/inventario/movimientos" element={<Movimientos />} />
            {/* POS */}
            <Route exact path="/pos/venta" element={<Ventas />} />
            <Route exact path="/pos/venta/lista" element={<VentasList />} />
          </Routes>
          </AnimatePresence>
          <Footer />
        </div>
    </div>
  );
}

export default AnimatedRoutes;