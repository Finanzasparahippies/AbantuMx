import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import Select from "react-select";
import API from "../../utils/API";
import StocksList from "./StocksList";
import Toast from "../../utils/Toast";
import AnimatedPage from "../../utils/AnimatedPage";

function Stocks() {

  const Tipos = [
    { id: 1, nombre: "Entrada" },
    { id: 2, nombre: "Salida" },
  ];

  const [stocks, setStocks] = useState([]);
  const [productos, setProductos] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [form, setForm] = useState({
    producto: "",
    cantidad: "",
    almacen: "",
    usuario: localStorage.getItem("name"),
  });

  const handleInputChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSelectChange = (value, actionMeta) => {
    setForm({
      ...form,
      [actionMeta.name]: value.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    API.post("inventario/stocks/crear/", form)
      .then((res) => {
        Toast.fire({
          icon: "success",
          title: "Stock agregado",
        });
        window.location.reload();
      })
      .catch((err) => {
        Toast.fire({
          icon: "error",
          title: "Error al agregar stock",
        });
      });
  };

  useEffect(() => { 
    API.get("inventario/stocks/lista")
    .then((res) => { setStocks(res.data)})
    .catch((err) => { console.log(err) })

    API.get("inventario/productos/lista")
    .then((res) => { setProductos(res.data)})
    .catch((err) => { console.log(err) })

    API.get("inventario/almacenes/lista")
    .then((res) => { setAlmacenes(res.data)})
    .catch((err) => { console.log(err) })
  }, [])

  return (
    console.log(form),
    <AnimatedPage>
      <main>
        <div className="flex flex-row py-12">
          <div className="flex flex-col w-1/2 ml-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Stock
            </h1>
          </div>
          <div className="flex flex-col md:w-1/5 ml-auto w-1/2">
            
          </div>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 w-full max-w-9xl mx-auto">
          <form
            className="space-y-8 divide-y divide-gray-200"
            onSubmit={handleSubmit}
          >
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
              <div>
                <h3 className="text-xl leading-6 font-medium text-gray-900">
                  Nuevo Stock
                </h3>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="producto"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Producto
                  </label>
                  <Select
                    name="producto"
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    onChange={(value, actionMeta) => handleSelectChange(value, actionMeta)}
                    options={productos.map((producto) => ({
                      value: producto.id,
                      label: producto.nombre
                    }))}
                    value={form.producto ? form.producto.nombre : null}
                    placeholder='Selecciona un producto'
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="almacen"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Almacen
                  </label>
                  <select
                    id="almacen"
                    name="almacen"
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    onChange={handleInputChange}
                    value={form.almacen}
                    required
                  >
                    <option value="">Seleccione un almacen</option>
                    {almacenes?.map((almacen) => (
                      <option key={almacen.id} value={almacen.id}>{almacen.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-1">
                  <label
                    htmlFor="tipo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tipo
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    onChange={handleInputChange}
                    value={form.tipo}
                    required
                  >
                    <option value="">Seleccione un tipo</option>
                    {Tipos.map((tipo) => (
                      <option key={tipo.id} value={tipo.nombre}>{tipo.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-1">
                  <label
                    htmlFor="cantidad"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Cantidad
                  </label>
                  <input
                    type="number"
                    name="cantidad"
                    id="cantidad"
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    onChange={handleInputChange}
                    value={form.cantidad}
                    required
                  />
                </div>
                <motion.div>
                  <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                    <div className="flex justify-center">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Guardar
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </form>
        </div>
        <StocksList setStocks={setStocks} />
      </main>
    </AnimatedPage>
  );
}

export default Stocks;
