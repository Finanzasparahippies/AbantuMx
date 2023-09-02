import React, { useState, useEffect, useMemo } from "react";
import AnimatedPage from "../../utils/AnimatedPage";
import Pagination from '../../utils/Pagination';
import API from "../../utils/API";
import moment from "moment";


function Productos() {

  let PageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  
  const [movimientos, setMovimientos] = useState([]);
  const currentTableData = useMemo(() => {
      const firstPageIndex = (currentPage - 1) * PageSize;
      const lastPageIndex = firstPageIndex + PageSize;
      return movimientos.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, movimientos]);


  useEffect(() => { 
    API.get("inventario/movimientos/lista")
    .then((res) => { setMovimientos(res.data)})
    .catch((err) => { console.log(err) })
  }, [])

  return (
    <AnimatedPage>
      <main>
        <div className="flex flex-row py-12">
          <div className="flex flex-col w-1/2 ml-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Movimientos
            </h1>
          </div>
          <div className="flex flex-col md:w-1/5 ml-auto w-1/2">
            
          </div>
        </div>
        
        <div className='px-4 sm:px-4 lg:px-8 py-2 w-full max-w-9xl mx-auto mt-4'>
        <h3 className='text-lg leading-6 font-medium text-gray-900'>Lista de Movimientos</h3>
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
                                Producto
                                </th>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Almacen
                                </th>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Cantidad
                                </th>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Tipo
                                </th>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Fecha y hora
                                </th>
                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Usuario
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {currentTableData && currentTableData?.map(movimiento => (
                            <tr key={movimiento.id}>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{movimiento.producto}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{movimiento.almacen}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{movimiento.cantidad}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{movimiento.tipo}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{moment(movimiento.fecha).format('DD/MM/YYYY HH:mm')}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{movimiento.usuario}</div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={movimientos.length}
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

export default Productos;
