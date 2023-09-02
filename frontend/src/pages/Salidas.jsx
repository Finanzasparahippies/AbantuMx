import React, { useState, useEffect, useMemo } from 'react';
import Pagination from '../utils/Pagination';
import Swal from 'sweetalert2';
import API from '../utils/API';
import Toast from '../utils/Toast';
import AnimatedPage from '../utils/AnimatedPage';


function Salidas() {
  
  let PageSize = 10;
  const [salidas, setSalidas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return salidas.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, salidas]);

  const [form, setForm] = useState({
    nombre: '',
  });

  useEffect(() => {
    const getSalidas = async () => {
      const res = await API.get('/ptr/salidas/list/');
      setSalidas(res.data);
    }
    getSalidas();
  }, []);

  const handleInputChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    Swal.fire({
      title: 'Creando salida...',
      allowOutsideClick: false,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    API.post('/ptr/salidas/create/', form)
      .then(res => {
        console.log(res);
        setTimeout(() => {
          Toast.fire({
            icon: 'success',
            title: 'Salida creada correctamente'
          });
          setForm({
            nombre: '',
          });
        }, 2000);
        currentTableData.push(res.data);
      })
      .catch(err => {
        console.log(err);
        if (err.response.status === 400) {
          Toast.fire({
            icon: 'error',
            title: 'Salida ya existe'
          });
        } else {
          Toast.fire({
            icon: 'error',
            title: 'Error al crear salida',
          });
        }
      })
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Estás seguro de eliminar esta salida?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        API.delete(`/ptr/salidas/delete/${id}/`)
          .then(res => {
            console.log(res);
            const newSalidas = salidas.filter(salida => salida.id !== id);
            setSalidas(newSalidas);
          })
          .catch(err => {
            console.log(err);
          })
        Toast.fire({
          icon: 'success',
          title: 'Salida eliminada correctamente'
        });
      }
    })
  };

  return (
    <AnimatedPage>
        <main>
            <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
            <h1 className='text-2xl font-semibold text-gray-900'>Reclutamiento - Salidas</h1>
            </div>
            <div className='px-4 sm:px-6 lg:px-8 w-full max-w-9xl mx-auto'>
              <form className='space-y-8 divide-y divide-gray-200' onSubmit={handleSubmit}>
                <div className='space-y-8 divide-y divide-gray-200 sm:space-y-5'>
                  <div>
                    <div>
                      <h3 className='text-lg leading-6 font-medium text-gray-900'>Nueva salida</h3>
                    </div>
                    <div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
                      <div className='sm:col-span-3'>
                        <label htmlFor='nombre' className='block text-sm font-medium text-gray-700'>Nombre</label>
                        <input placeholder='Nombre salida' type='text' name='nombre' className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' onChange={handleInputChange} value={form.nombre} />
                      </div>
                    </div>
                  </div>
                </div>          
                <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
                  <div className='flex justify-center'>
                    <button type='submit' className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
                      Guardar
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className='px-4 sm:px-4 lg:px-8 py-2 w-full max-w-9xl mx-auto'>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>Lista de salidas</h3>
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
                            <th scope='col' className='px-6 py-3 uppercase text-xs tracking-wider'>
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                          {currentTableData && currentTableData.map((salida, id) => (
                          <tr key={id}>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    {salida.nombre}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                                <a href='#' className='bg-red-100 hover:bg-red-500 text-red-800 hover:text-white py-1 px-2 rounded border border-red-800'>Editar</a>
                                <a href='#' className='bg-red-100 hover:bg-red-500 text-red-800 hover:text-white py-1 px-2 rounded ml-2 border border-red-800' onClick={() => handleDelete(salida.id)}>Eliminar</a>
                            </td>
                          </tr>
                          ))}
                        </tbody>
                      </table>
                      <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={salidas.length}
                        pageSize={PageSize}
                        onPageChange={page => setCurrentPage(page)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
    </AnimatedPage>
  );
}

export default Salidas;