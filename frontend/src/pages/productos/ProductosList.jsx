import React, { useState, useEffect, useMemo } from 'react';
import Pagination from '../../utils/Pagination';
import Swal from 'sweetalert2';
import Toast from '../../utils/Toast';
import API from '../../utils/API';


const ProductosList = ( {setProductos} ) => {

    let PageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [productos1, setProductos1] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [modal, setModal] = useState(false);
    const [updateForm, setUpdateForm] = useState({
        nombre: "",
        categoria: "",
        precio: "",
        descripcion: "",
        imagen: ""
    });
    const [imagen2, setImagen2] = useState('');

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return productos1.slice(firstPageIndex, lastPageIndex);
      }, [currentPage, productos1]);

    useEffect(() => {
        API.get(`inventario/productos/lista`)
        .then(res => {
            setProductos(res.data);
            setProductos1(res.data);
        })
        .catch(err => {
            console.log(err);
        })

        API.get(`inventario/categorias/lista`)
        .then(res => {
            setCategorias(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);

    const handleDelete = (id) => {
        Swal.fire({
          title: 'Confirmación',
          text: "¿Estás seguro de eliminar este producto?",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '¡Sí, eliminar!'
        }).then((result) => {
          if (result.isConfirmed) {
            API.delete(`inventario/productos/eliminar/${id}/`)
              .then(res => {
                API.get(`inventario/productos/lista`)
                    .then(res => {
                        setProductos(res.data);
                        setProductos1(res.data);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                })
                .catch(err => {
                    console.log(err);
                })
            Toast.fire({
              icon: 'success',
              title: 'Producto eliminado'
            });
          }
        })
    };

    const handleInputChange = (e) => {
        setUpdateForm({
            ...updateForm,
            [e.target.name]: e.target.value
        }); 
    };

    const handleEdit = (producto) => {
        setUpdateForm(producto);
        setModal(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        Swal.fire({
            loading: true,
            title: 'Actualizando',
            text: 'Espere por favor...',
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 2000
        });
        API.put(`inventario/productos/editar/${updateForm.id}/`, {'imagen': imagen2, 'nombre': updateForm.nombre, 'descripcion': updateForm.descripcion, 'categoria': updateForm.categoria, 'precio': updateForm.precio},
            {
                headers: {
                'Content-Type': 'multipart/form-data'
                }
            })
            .then(res => {
                setTimeout(() => {
                    Swal.close();
                    Toast.fire({
                        icon: 'success',
                        title: 'Producto actualizado'
                    });
                API.get(`inventario/productos/lista`)
                    .then(res => {
                        setProductos(res.data);
                        setProductos1(res.data);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                })
                .catch(err => {
                    console.log(err);
                })
            })
            .catch(err => {
                console.log(err);
            })
        setImagen2('');
        setModal(false);
    };

    const editImagen = (e) => {
        setImagen2(e.target.files[0]);
        setUpdateForm({
          ...updateForm,
          imagen: URL.createObjectURL(e.target.files[0])
        });
      };

    const handleCancel = () => {
        setModal(!modal);
    };

        
return (
    <>
    <div className='px-4 sm:px-4 lg:px-8 py-2 w-full max-w-9xl mx-auto mt-4'>
        <h3 className='text-lg leading-6 font-medium text-gray-900'>Lista de Productos</h3>
    </div>
    <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
        <div className='flex flex-col'>
            <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
                <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Imagen
                                </th>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Nombre
                                </th>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Descripcion
                                </th>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Categoria
                                </th>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Precio
                                </th>
                                <th scope='col' className='px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {currentTableData && currentTableData?.map(producto => (
                            <tr key={producto.id}>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <div className='ml-4'>
                                            { producto.imagen ? (
                                            <img
                                                className='h-20 w-20'
                                                src={producto.imagen}
                                                alt=''
                                            />
                                            ) : (
                                            <img
                                                className='h-20 w-20'
                                                src='https://via.placeholder.com/150'
                                                alt=''
                                            />
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{producto.nombre}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{producto.descripcion}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{producto.categoria}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>${producto.precio}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                                    <button className='bg-gray-100 hover:bg-gray-500 text-gray-800 hover:text-white py-1 px-2 rounded ml-2 border border-gray-800' onClick={() => handleEdit(producto)}>Editar</button>
                                    <button className='bg-red-100 hover:bg-red-500 text-red-800 hover:text-white py-1 px-2 rounded ml-2 border border-red-800'onClick={() => handleDelete(producto.id)}>Eliminar</button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={productos1.length}
                        pageSize={PageSize}
                        onPageChange={page => setCurrentPage(page)}
                    />
                    </div>
                </div>
            </div>
        </div>
        <div className={!modal ? 'fixed hidden inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full display-none':'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full display-block'}>
            <div className='relative top-20 px-10 sm:px-6 lg:px-8 py-8 mx-auto align-center justify-center max-w-2xl sm:max-w-2xl md:max-w-7xl'>
                <div className='flex flex-col w-max-content bg-white p-2'>
                    <div className="flex justify-center p-8 rounded-t border-b">
                        <h1 className="text-2xl font-bold text-red-600">
                            {updateForm.nombre}
                        </h1>
                    </div>
                    <div className='py-4 align-middle inline-block sm:px-12 lg:px-12'>
                        <div className='flex justify-center'>
                        { updateForm.imagen === null ? (
                            <img className='h-30 w-30 rounded-full' src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' alt='' />
                        ) : (
                            <img className='h-20 w-20 rounded-full' src={updateForm.imagen} alt='' />
                        )}
                        </div>
                    </div>
                    <form className='py-4 align-middle inline-block sm:px-8 lg:px-12' onSubmit={handleUpdate}>          
                        <div className='shadow overflow-hidden border-b border-gray-200'>
                            <div className='px-4 py-5 bg-white sm:p-12 md:p-8'>
                                <div className='grid grid-rows-12 gap-6'>
                                    <div className='col-span-12 sm:col-span-6'>
                                        <label htmlFor='nombre' className='block text-sm font-medium text-gray-700'>
                                            Nombre
                                        </label>
                                        <input 
                                            type='text' 
                                            name='nombre' 
                                            value={updateForm.nombre} 
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-slate-100'
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className='col-span-12 sm:col-span-3'>
                                        <label htmlFor='descripcion' className='block text-sm font-medium text-gray-700'>
                                            Descripcion
                                        </label>
                                        <textarea
                                            type='text'
                                            name='descripcion'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-slate-100'
                                            value={updateForm.descripcion}
                                            onChange={handleInputChange}
                                        />
                                    </div>                            
                                    <div className='col-span-12 sm:col-span-3'>
                                        <label htmlFor='hora_salida' className='block text-sm font-medium text-gray-700'>
                                            Categoria
                                        </label>
                                        <select
                                            name='categoria'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                            onChange={handleInputChange}
                                        >
                                            <option value=''>Seleccione una categoria</option>
                                            {categorias.map(categoria => (
                                                updateForm.categoria === categoria.nombre ?
                                                <option key={categoria.id} value={categoria.nombre} selected>{categoria.nombre}</option>
                                                : <option key={categoria.id} value={categoria.nombre}>{categoria.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='col-span-12 sm:col-span-3'>
                                        <label htmlFor='precio' className='block text-sm font-medium text-gray-700'>
                                            Precio
                                        </label>
                                        <input
                                            type='number'
                                            name='precio'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                            onChange={handleInputChange}
                                            value={updateForm.precio}
                                        />
                                    </div>
                                    <div className='col-span-12 sm:col-span-3'>
                                        <label htmlFor='imagen' className='block text-sm font-medium text-gray-700'>
                                            Imagen
                                        </label>
                                        <input
                                            type='file'
                                            name='imagen'
                                            accept='image/*'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                            onChange={(e) => editImagen(e)}
                                        />
                                    </div>
                                    <div className='p-4 text-center sm:justify-center'>
                                        <button type='submit' className='bg-red-100 hover:bg-red-500 text-red-800 hover:text-white py-1 px-2 rounded border border-red-800'>
                                            Guardar
                                        </button>
                                        <button type='button' className='bg-red-100 hover:bg-red-500 text-red-800 hover:text-white py-1 px-2 rounded border border-red-800 ml-4' onClick={handleCancel}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default ProductosList