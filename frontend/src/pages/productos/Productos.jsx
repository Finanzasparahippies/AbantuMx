import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import API from "../../utils/API";
import ProductosList from "./ProductosList";
import Toast from "../../utils/Toast";
import AnimatedPage from "../../utils/AnimatedPage";

function Productos() {

	const [productos, setProductos] = useState([]);
	const [categorias, setCategorias] = useState([]);
	const [imagen, setImagen] = useState('');


	const [form, setForm] = useState({
		nombre: "",
		categoria: "",
		precio: "",
		descripcion: ""
	});

	const handleInputChange = (event) => {
		setForm({
			...form,
			[event.target.name]: event.target.value,
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		API.post("inventario/productos/crear/", { 'imagen': imagen, 'nombre': form.nombre, 'categoria': form.categoria, 'precio': form.precio, 'descripcion': form.descripcion },
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then((res) => {
				Toast.fire({
					icon: "success",
					title: "Producto agregado",
				});
				window.location.reload();
			})
			.catch((err) => {
				Toast.fire({
					icon: "error",
					title: "Error al agregar producto",
				});
			});
	};

	useEffect(() => {
		API.get("inventario/productos/lista")
			.then((res) => { setProductos(res.data) })
			.catch((err) => { console.log(err) })

		API.get("inventario/categorias/lista")
			.then((res) => { setCategorias(res.data) })
			.catch((err) => { console.log(err) })
	}, [])

	return (
		<AnimatedPage>
			<main>
				<div className="flex flex-row py-12">
					<div className="flex flex-col w-1/2 ml-8">
						<h1 className="text-2xl font-semibold text-gray-900">
							Productos
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
									Nuevo Producto
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
										htmlFor="categoria"
										className="block text-sm font-medium text-gray-700"
									>
										Categoria
									</label>
									<select
										id="categoria"
										name="categoria"
										className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
										onChange={handleInputChange}
										value={form.categoria}
										required
									>
										<option value="">Seleccione una categoria</option>
										{categorias?.map((categoria) => (
											<option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
										))}
									</select>
								</div>
								<div className="sm:col-span-2">
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
										onChange={handleInputChange}
										value={form.precio}
										required
									/>
								</div>
								<div className="sm:col-span-2">
									<label
										htmlFor="descripcion"
										className="block text-sm font-medium text-gray-700"
									>
										Descripcion
									</label>
									<textarea
										rows={3}
										name="descripcion"
										id="descripcion"
										className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
										onChange={handleInputChange}
										value={form.descripcion}
										required
									/>
								</div>
								<div className="sm:col-span-2">
									<label
										htmlFor="imagen"
										className="block text-sm font-medium text-gray-700"
									>
										Imagen
									</label>
									<input
										type="file"
										name="imagen"
										accept="image/*"
										className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
										onChange={(e) => setImagen(e.target.files[0])}
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
				<ProductosList setProductos={setProductos} />
			</main>
		</AnimatedPage>
	);
}

export default Productos;
