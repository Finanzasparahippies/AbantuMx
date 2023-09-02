import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { setData } from '../../reducers/viajes/solicitudData';
import Pagination from '../../utils/Pagination';
import Swal from 'sweetalert2';
import Toast from '../../utils/Toast';
import API from '../../utils/API';
import { Link } from 'react-router-dom';


const AlmacenesList = ( {setAlmacenes} ) => {

    const dispatch = useDispatch();

    let PageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [almacenes1, setAlmacenes1] = useState([]);
    const [encargados, setEncargados] = useState([]);
    const [modal, setModal] = useState(false);
    const [updateForm, setUpdateForm] = useState({});

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return almacenes1.slice(firstPageIndex, lastPageIndex);
      }, [currentPage, almacenes1]);

    useEffect(() => {
        API.get(`inventario/almacenes/lista`)
        .then(res => {
            setAlmacenes(res.data);
            setAlmacenes1(res.data);
        })
        .catch(err => {
            console.log(err);
        })

        API.get(`users/encargados`)
        .then(res => {
            setEncargados(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);

    const handleDelete = (id) => {
        Swal.fire({
          title: 'Confirmación',
          text: "¿Estás seguro de eliminar este almacen?",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '¡Sí, eliminar!'
        }).then((result) => {
          if (result.isConfirmed) {
            API.delete(`inventario/almacenes/eliminar/${id}/`)
              .then(res => {
                API.get(`inventario/almacenes/lista`)
                    .then(res => {
                        setAlmacenes(res.data);
                        setAlmacenes1(res.data);
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
              title: 'Almacen eliminado'
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

    const handleEdit = (almacen) => {
        setUpdateForm(almacen);
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
        API.put(`inventario/almacenes/editar/${updateForm.id}/`, updateForm)
            .then(res => {
                setTimeout(() => {
                    Swal.close();
                    Toast.fire({
                        icon: 'success',
                        title: 'Almacen actualizado'
                    });
                API.get(`inventario/almacenes/lista`)
                    .then(res => {
                        setAlmacenes(res.data);
                        setAlmacenes1(res.data);
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
        setModal(false);
    };

    const handleCancel = () => {
        setModal(!modal);
    };

        
return (
    console.log(almacenes1),
    console.log(updateForm),
    <>
    <div className='px-4 sm:px-4 lg:px-8 py-2 w-full max-w-9xl mx-auto mt-4'>
        <h3 className='text-lg leading-6 font-medium text-gray-900'>Lista de Almacenes</h3>
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
                                Nombre
                                </th>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Direccion
                                </th>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Telefono
                                </th>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Email
                                </th>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Responsable
                                </th>
                                <th scope='col' className='px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {currentTableData && currentTableData?.map(almacen => (
                            <tr key={almacen.id}>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{almacen.nombre}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{almacen.direccion}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{almacen.telefono}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{almacen.email}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{almacen.encargado}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                                    <button className='bg-gray-100 hover:bg-gray-500 text-gray-800 hover:text-white py-1 px-2 rounded ml-2 border border-gray-800' onClick={() => handleEdit(almacen)}>Editar</button>
                                    <button className='bg-red-100 hover:bg-red-500 text-red-800 hover:text-white py-1 px-2 rounded ml-2 border border-red-800' onClick={() => handleDelete(almacen.id)}>Eliminar</button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={almacenes1.length}
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
                                        <label htmlFor='direccion' className='block text-sm font-medium text-gray-700'>
                                            Direccion
                                        </label>
                                        <textarea
                                            type='text'
                                            name='direccion'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-slate-100'
                                            value={updateForm.direccion}
                                            onChange={handleInputChange}
                                        />
                                    </div>                            
                                    <div className='col-span-12 sm:col-span-3'>
                                        <label htmlFor='telefono' className='block text-sm font-medium text-gray-700'>
                                            Telefono
                                        </label>
                                        <input
                                            type='text'
                                            name='telefono'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                            onChange={handleInputChange}
                                            value={updateForm.telefono}
                                        />
                                    </div>
                                    <div className='col-span-12 sm:col-span-3'>
                                        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                                            Email
                                        </label>
                                        <input
                                            type='email'
                                            name='email'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                            onChange={handleInputChange}
                                            value={updateForm.email}
                                        />
                                    </div>
                                    <div className='col-span-12 sm:col-span-3'>
                                        <label htmlFor='encargado' className='block text-sm font-medium text-gray-700'>
                                            Responsable
                                        </label>
                                        <select 
                                            name='encargado'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                            onChange={handleInputChange}
                                        >
                                            <option value=''>Seleccione un responsable</option>
                                            {encargados.map((encargado) => (
                                                ( encargado.id === updateForm.encargado_id ? 
                                                    <option key={encargado.id} value={encargado.id} selected> {encargado.nombres + ' ' + encargado.apellidos} </option> 
                                                    : <option key={encargado.id} value={encargado.id}> {encargado.nombres + ' ' + encargado.apellidos} </option>
                                            )))}
                                        </select>
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

export default AlmacenesList