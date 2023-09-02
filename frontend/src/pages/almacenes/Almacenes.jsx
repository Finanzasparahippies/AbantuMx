import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import API from "../../utils/API";
import AlmacenesList from "./AlmacenesList";
import Toast from "../../utils/Toast";
import AnimatedPage from "../../utils/AnimatedPage";

function Almacenes() {

  const [almacenes, setAlmacenes] = useState([]);
  const [encargados, setEncargados] = useState([]);


  const [form, setForm] = useState({
        nombre: "",
        encargado: "",
        direccion: "",
        telefono: "",
        email: "",
      
  });

  const handleInputChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    API.post("inventario/almacenes/crear/", form)
      .then((res) => {
        Toast.fire({
          icon: "success",
          title: "Almacen agregado",
        });
        window.location.reload();
      })
      .catch((err) => {
        Toast.fire({
          icon: "error",
          title: "Error al agregar almacen",
        });
      });
  };

  useEffect(() => { 
    API.get("inventario/almacenes/lista")
    .then((res) => { setAlmacenes(res.data)})
    .catch((err) => { console.log(err) })

    API.get("users/encargados")
    .then((res) => { setEncargados(res.data)})
    .catch((err) => { console.log(err) })
  }, [])

  return (
    console.log(form),
    <AnimatedPage>
      <main>
        <div className="flex flex-row py-12">
          <div className="flex flex-col w-1/2 ml-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Almacenes
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
                  Nuevo Almacen
                </h3>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    onChange={handleInputChange}
                    value={form.nombre}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Telefono
                  </label>
                  <input
                    type="number"
                    name="telefono"
                    id="telefono"
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    onChange={handleInputChange}
                    value={form.telefono}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    onChange={handleInputChange}
                    value={form.email}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="direccion"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Direccion
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    id="direccion"
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    onChange={handleInputChange}
                    value={form.direccion}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="encargado"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Responsable
                  </label>
                  <select
                    id="encargado"
                    name="encargado"
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    onChange={handleInputChange}
                    value={form.encargado}
                  >
                    <option value="">Selecciona un responsable</option>
                    {encargados.map((encargado) => (
                      <option key={encargado.id} value={encargado.id}>
                        {encargado.nombres} {encargado.apellidos}
                      </option>
                    ))}
                  </select>
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
        <AlmacenesList setAlmacenes={setAlmacenes} />
      </main>
    </AnimatedPage>
  );
}

export default Almacenes;
