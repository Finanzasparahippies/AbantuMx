import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import API from "../../utils/API";
import Toast from "../../utils/Toast";
import Select from "react-select";
import AnimatedPage from "../../utils/AnimatedPage";


function Venta() {

  const [productos, setProductos] = useState([]);
  const [products, setProducts] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [total, setTotal] = useState(0);
  const [clientes, setClientes] = useState([]);
  const [modal, setModal] = useState(false);


  const [form, setForm] = useState({
      fecha: new Date(),
      vendedor: localStorage.getItem("name"),
      cliente: "",
      total: "",
      productos: ""
  });

  const [newConcept, setNewConcept] = useState({
    nombre: "",
    precio: 0,
    cantidad: 0,
    producto: "",
  });


  useEffect(() => { 
    API.get("inventario/productos/lista")
    .then((res) => { setProductos(res.data)})
    .catch((err) => { console.log(err) })

    API.get("pos/cliente/lista")
    .then((res) => { setClientes(res.data)})
    .catch((err) => { console.log(err) })

    API.get("pos/venta/lista")
    .then((res) => { setVentas(res.data)})
    .catch((err) => { console.log(err) })
  }, [])

  useEffect(() => {
    setForm({
      ...form,
      productos: products,
      total: total
    })
  }, [products, total])

  const handleProductUpdate = (option) => {
    if (products.find((product) => product.producto === option.id)) {
      const newProducts = products.map((product) => {
        if (product.producto === option.id) {
          product.cantidad = product.cantidad + 1;
          product.total = product.total + option.precio;
        }
        return product;
      });
      setProducts(newProducts);
      setTotal(total + option.precio * 1);
    } else {
      const newProduct = {
        producto: option.id,
        cantidad: 1,
        precio: option.precio,
        imagen: option.imagen,
        nombre: option.nombre,
        total: option.precio * 1,
      };
      setProducts([...products, newProduct]);
      setTotal(total + option.precio * 1);
    }
  };

  const handleModal = () => {
    if (products.length > 0 && form.cliente !== "") {
      Swal.fire({
        title: "Confirma la venta",
        html: 
        `<div class="flex flex-col">
          <div class="flex flex-row">
            <div class="flex flex-col w-1/2">
              <span class="text-ms text-gray-600">Vendedor: ${localStorage.getItem("nombre")}</span>
            </div>
            <div class="flex flex-col md:w-1/3 w-1/2 justify-end ml-auto">
              <span class="text-ms text-gray-600">Cliente: ${form.cliente_nombre}</span>
            </div>
          </div>
          <div class="flex flex-col mt-4">
            <div class="flex flex-row items-center">
              <div class="flex flex-col w-1/2 justify-center">
              <span class="text-ms text-gray-600">Total: $${total}.00 MXN</span>
              </div>
            </div>
          </div>
        </div>`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#D41919",
        cancelButtonColor: "#A3A3A3",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          handleVenta();
        }
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Selecciona un cliente y agrega productos",
      });
    }
  };
      

  const handleVenta = () => {
    API.post("pos/venta/crear", form)
      .then((res) => {
        Toast.fire({
          icon: "success",
          title: "Venta realizada con éxito",
        });
        setForm({
          ...form,
          fecha: new Date(),
          vendedor: localStorage.getItem("name"),
          total: total,
          productos: products
        });
        setProducts([]);
        setTotal(0);
        API.get("pos/venta/lista")
          .then((res) => {
            setVentas(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
        Toast.fire({
          icon: "error",
          title: "Error al realizar la venta",
        });
      });
  };

  const handleDelete = (producto) => {
    const newProducts = products.filter((product) => product.nombre !== producto.nombre);
    setProducts(newProducts);
    setTotal(total - producto.total);
  };

  const handleQuantity = (nombre, quantity) => {
    const newProducts = products.map((product) => {
      if (product.nombre === nombre) {
        product.cantidad = quantity;
        product.total = quantity * product.precio;
      }
      return product;
    });
    setProducts(newProducts);
    setTotal(
      newProducts.reduce((acc, product) => {
        return acc + product.total;
      }, 0)
    );
  };

  const handleNewProduct = (e) => {
    e.preventDefault();
    if (products.find((product) => product.nombre === newConcept.nombre)) {
      const newProducts = products.map((product) => {
        if (product.nombre === newConcept.nombre) {
          product.cantidad = product.cantidad + newConcept.cantidad;
          product.total = product.total + newConcept.precio * newConcept.cantidad;
        }
        return product;
      });
      setProducts(newProducts);
      setTotal(total + newConcept.precio * newConcept.cantidad);
      setNewConcept({
        nombre: "",
        precio: 0,
        cantidad: 0,
        producto: "",
      });
    } else {
      setProducts([...products,
        {
          nombre: newConcept.nombre,
          precio: newConcept.precio,
          cantidad: newConcept.cantidad,
          total: newConcept.precio * newConcept.cantidad,
          producto: ""
        },
      ]);
      setTotal(total + newConcept.precio * newConcept.cantidad);
      setNewConcept({
        nombre: "",
        precio: 0,
        cantidad: 0,
        producto: "",
      });
    }
  };

  const handleChangeInputNP = (e) => {
    if (e.target.name === "nombre") {
      setNewConcept({
        ...newConcept,
        [e.target.name]: e.target.value,
      });
    } else {
      setNewConcept({
        ...newConcept,
        [e.target.name]: parseInt(e.target.value),
      });
    }
  };

  return (
    <AnimatedPage>
      <main>
        <div className="flex flex-col sm:flex-row py-12 px-16">
          <div className="flex md:w-1/3 sm:w-1/2 w-full flex-col mt-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              Nueva Venta
            </h1>
            <span className="text-ms text-gray-600">
              Folio: V
              {ventas[0]?.next_id.toString().padStart(8, "0") || "00000001"}
            </span>
            <span className="text-ms text-gray-600">
              Vendedor: {localStorage.getItem("nombre")}
            </span>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 w-full sm:w-40"
              onClick={() => setModal(!modal)}
            >
              {modal ? "Cerrar" : "Agregar concepto"}
            </button>
          </div>
          <div className="flex flex-row sm:flex-col md:w-1/3 sm:w-1/2 w-full justify-end ml-auto mt-2">
            <Select
              name="cliente"
              id="cliente"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              options={clientes}
              placeholder="Selecciona un cliente"
              formatOptionLabel={
                (option) => <div>{option.nombre} </div>
              }
              getOptionLabel={(option) => option.nombre}
              getOptionValue={(option) => option.id}
              onChange={(option) => setForm({...form, cliente: option.id, cliente_nombre: option.nombre})}
            />
          </div>
          <div className="flex flex-row sm:flex-col md:w-1/3 sm:w-1/2 w-full justify-end ml-auto mt-2">
            <Select
              name="producto"
              id="producto"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              options={productos}
              placeholder="Selecciona un producto"
              formatOptionLabel={
                (option) => 
                <div>
                  <img 
                    src={option.imagen} 
                    className="w-20 h-20 mr-4" 
                    alt=""
                  /> 
                  {option.nombre} - ${option.precio}{option.precio?.toString().includes('.') ? "0" : ".00"}
                  <div className="text-xl text-gray-600 mt-2">
                    Existencias: {option.stock}
                  </div>
                </div>
              }
              getOptionLabel={(option) => option.nombre}
              getOptionValue={(option) => option.id}
              onChange={(option) => handleProductUpdate(option)}
              value={null}
            />
          </div>
        </div>
        <div className={!modal ? "hidden" : "flex flex-col sm:flex-row py-12 px-16"}>
          <div className="flex flex-col w-full">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <form className="space-y-8 divide-y divide-gray-200" onSubmit={(e) => handleNewProduct(e)}>
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-2">
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
                        value={newConcept.nombre}
                        onChange={(e) => handleChangeInputNP(e)}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                      <label
                        htmlFor="precio"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Precio
                      </label>
                      <input
                        type="number"
                        name="precio"
                        id="precio"
                        className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={newConcept.precio}
                        onChange={(e) => handleChangeInputNP(e)}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
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
                        value={newConcept.cantidad}
                        onChange={(e) => handleChangeInputNP(e)}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                      <label
                        htmlFor="total"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Total
                      </label>
                      <input
                        type="number"
                        name="total"
                        id="total"
                        className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={newConcept.precio * newConcept.cantidad}
                        disabled
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                      <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>     
        <div className="px-4 sm:px-6 lg:px-8 w-full max-w-9xl mx-auto">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Producto
                        </th>
                        <th
                          scope="col"
                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                         >
                          Precio
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Cantidad
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.producto}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10"
                                  src={product.imagen}
                                  alt=""
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {product.nombre}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              ${product.precio}{product.precio?.toString().includes(".") ? "0" : ".00"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <input 
                              type="number"
                              className="w-20"
                              value={product.cantidad}
                              onChange={(e) => handleQuantity(product.nombre, e.target.value)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${product.precio * product.cantidad}{(product.precio * product.cantidad)?.toString().includes(".") ? "0" : ".00"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDelete(product)}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="overflow-hidden mt-4">
                  <div className="float-left">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm text-4xl rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                      onClick={() => handleModal()}
                    >
                      Hacer Venta
                    </button>
                  </div>
                  <table className="w-1/6 divide-y divide-gray-200 float-right border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="row"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${total}{total?.toString().includes(".") ? "0" : ".00"}
                        </td>
                      </tr>
                    </thead>
                  </table>
                </div>
                <div className="overflow-hidden mt-4">
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AnimatedPage>
  );
};

export default Venta;
