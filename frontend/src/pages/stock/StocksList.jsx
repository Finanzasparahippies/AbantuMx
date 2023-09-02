import React, { useState, useEffect, useMemo } from 'react';
import Pagination from '../../utils/Pagination';
import Swal from 'sweetalert2';
import Toast from '../../utils/Toast';
import API from '../../utils/API';

const StocksList = ( {setStocks} ) => {

    let PageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [stocks1, setStocks1] = useState([]);
    const [productos, setProductos] = useState([]);
    const [almacenes, setAlmacenes] = useState([]);
    const [modal, setModal] = useState(false);
    const [updateForm, setUpdateForm] = useState({
        producto: "",
        cantidad: "",
        almacen: "",
    });

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return stocks1.slice(firstPageIndex, lastPageIndex);
      }, [currentPage, stocks1]);

    useEffect(() => {
        API.get(`inventario/stocks/lista`)
        .then(res => {
            setStocks(res.data);
            setStocks1(res.data);
        })
        .catch(err => {
            console.log(err);
        })

        API.get(`inventario/productos/lista`)
        .then(res => {
            setProductos(res.data);
        })
        .catch(err => {
            console.log(err);
        })

        API.get(`inventario/almacenes/lista`)
        .then(res => {
            setAlmacenes(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);

    const handleDelete = (id) => {
        Swal.fire({
          title: 'Confirmación',
          text: "¿Estás seguro de eliminar este stock?",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '¡Sí, eliminar!'
        }).then((result) => {
          if (result.isConfirmed) {
            API.delete(`inventario/stocks/eliminar/${id}/`)
              .then(res => {
                API.get(`inventario/stocks/lista`)
                    .then(res => {
                        setStocks(res.data);
                        setStocks1(res.data);
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
              title: 'Stock eliminado'
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

    const handleEdit = (stock) => {
        setUpdateForm(stock);
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
        API.put(`inventario/stocks/editar/${updateForm.id}/`, updateForm)
            .then(res => {
                setTimeout(() => {
                    Swal.close();
                    Toast.fire({
                        icon: 'success',
                        title: 'Stock actualizado'
                    });
                API.get(`inventario/stocks/lista`)
                    .then(res => {
                        setStocks(res.data);
                        setStocks1(res.data);
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
    <>
    <div className='px-4 sm:px-4 lg:px-8 py-2 w-full max-w-9xl mx-auto mt-4'>
        <h3 className='text-lg leading-6 font-medium text-gray-900'>Lista de Stock</h3>
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
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {currentTableData && currentTableData?.map(stock => (
                            <tr key={stock.id}>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{stock.producto}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{stock.almacen}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900'>{stock.cantidad}</div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={stocks1.length}
                        pageSize={PageSize}
                        onPageChange={page => setCurrentPage(page)}
                    />
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default StocksList