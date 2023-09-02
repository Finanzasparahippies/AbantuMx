import React, { useState, useEffect, useMemo } from 'react'
import API from '../../utils/API'
import moment from 'moment'
import SearchBar from '../../utils/SearchBar'
import Pagination from '../../utils/Pagination';
import Toast from '../../utils/Toast'

const VentasList = () => {

    const [ventas, setVentas] = useState([])
    const [search, setSearch] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [modal, setModal] = useState(false)
    const [details, setDetails] = useState([])

    let PageSize = 10;

    const [currentPage, setCurrentPage] = useState(1);
    const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return ventas.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, ventas]);

    useEffect(() => {
        API.get('/pos/venta/lista')
            .then(res => {
                setVentas(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const filterVentas = () => {
        const filtered = ventas.filter(venta => {
            return (
                venta.folio.toLowerCase().includes(search.toLowerCase()) ||
                venta.cliente.toLowerCase().includes(search.toLowerCase()) ||
                venta.vendedor.toLowerCase().includes(search.toLowerCase())
            );
        });
        if (search === '') {
            API.get('pos/venta/lista')
            .then(res => {
                setVentas(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        } else {
            setVentas(filtered);
        }
    };

    useEffect(() => {
        filterVentas();
    }, [search]);

    const dateFilter = (e) => {
        e.preventDefault();
        if (startDate > endDate) {
            Toast.fire({
                icon: 'error',
                title: 'La fecha de inicio no puede ser mayor a la fecha final'
            })
        } else {
            API.post('pos/venta/fecha/', { fecha_inicio: startDate, fecha_fin: endDate })
                .then(res => {
                    setVentas(res.data);          
                })
                .catch(err => {
                    if (err.response.status === 404) {
                        Toast.fire({
                            icon: 'error',
                            title: 'No hay ventas en el rango de fechas seleccionado'
                        })
                    }
                })
        }
    };

    const handleReset = () => {
        setSearch('');
        setStartDate('');
        setEndDate('');
        API.get('pos/venta/lista')
        .then(res => {
            setVentas(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    };

    const handleDetail = (id) => {
        ventas.find(venta => {
            if (venta.id === id) {
                setDetails(venta)
                setModal(true)
            }
        })
    }

    const handleClose = () => {
        setModal(false)
        setDetails([])
    }

    const sumTotal = ventas.reduce((acc, item) => acc + item.total, 0);


          


  return (
    console.log(ventas),
    console.log(currentTableData),
    <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
            <div>
                <h2 className="text-2xl font-semibold leading-tight">Ventas</h2>
            </div>
            <div className="my-2 flex sm:flex-row flex-col">
                <div className="flex flex-row mb-1 sm:mb-0">
                    <div className="block relative p-1 pl-2">
                        <SearchBar callback={(search) => setSearch(search)} />
                    </div>
                </div>
                <div className="block relative p-1 pl-2">
                    <form onSubmit={dateFilter}>
                        <div className="flex flex-row mb-1 sm:ml-2">
                            <div className="block relative">
                                <input
                                    type="date"
                                    name="startDate"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="border rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:shadow-outline"
                                    placeholder="Fecha de inicio"
                                />
                            </div>
                            <div className="block relative ml-2">
                                <input
                                    type="date"
                                    name="endDate"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className="border rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:shadow-outline"
                                    placeholder="Fecha final"
                                />
                            </div>
                            <div className="block relative ml-2">
                                <button
                                    type="submit"
                                    className="bg-gray-500 text-white active:bg-gray-500 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 hover:bg-gray-700"
                                    style={{ transition: "all .15s ease" }}
                                >
                                    Filtrar
                                </button>
                            </div>
                            <div className="block relative">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="bg-red-600 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 hover:bg-red-700"
                                    style={{ transition: "all .15s ease" }}
                                >
                                    Limpiar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th
                                    scope="col"
                                    className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                >
                                    Folio 
                                </th>
                                <th
                                    scope="col"
                                    className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                >
                                    Fecha y hora
                                </th>
                                <th
                                    scope="col"
                                    className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                >
                                    Cliente
                                </th>
                                <th
                                    scope="col"
                                    className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                >
                                    Total
                                </th>
                                <th
                                    scope="col"
                                    className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                >
                                    Vendedor 
                                </th>
                                <th scope="col" className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTableData && currentTableData.map(venta => (
                                <tr key={venta.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex items-center">
                                            <div className="font-medium text-gray-900">
                                                {venta.folio}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex items-center">
                                            <div className="font-medium text-gray-900">
                                                {moment(venta.fecha).format('DD/MM/YYYY')} - {moment(venta.fecha).format('hh:mm a')}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex items-center">
                                            <div className="font-medium text-gray-900">
                                                {venta.cliente}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex items-center">
                                            <div className="font-medium text-gray-900">
                                                ${venta.total}{venta.total?.toString().includes('.') ? '0':'.00'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex items-center">
                                            <div className="font-medium text-gray-900">
                                                {venta.vendedor}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex items-center">
                                            <div className="font-medium text-gray-900">
                                                <button className="bg-gray-500 text-white active:bg-gray-500 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 hover:bg-gray-700" type="button" style={{ transition: "all .15s ease" }} onClick={() => handleDetail(venta.id)}>
                                                    Detalles 
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={ventas.length}
                        pageSize={PageSize}
                        onPageChange={page => setCurrentPage(page)}
                    />
                    <div className={!modal ? 'fixed hidden inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full display-none':'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full display-block z-50'}>
                        <div className='relative top-20 px-10 sm:px-6 lg:px-8 py-8 mx-auto align-center justify-center max-w-2xl sm:max-w-2xl md:max-w-7xl'>
                            <div className="flex justify-center p-8 rounded-t border-b bg-gray-50">
                                <h1 className="text-2xl font-bold text-red-600">
                                    Detalles de la venta {details.folio}
                                </h1>
                            </div>
                            <div className='flex flex-col w-max-content bg-white p-2'>
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                            >
                                                Producto
                                            </th>
                                            <th 
                                                scope="col"
                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                            >
                                                Descripción
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                            >
                                                Cantidad
                                            </th>
                                            <th 
                                                scope="col"
                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                            >
                                                Precio
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                            >
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {details.productos?.map(detalle => (
                                        <tr key={detalle.id}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div className="flex items-center">
                                                    <div className="font-medium text-gray-900">
                                                        {detalle.producto}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div className="flex items-center">
                                                    <div className="font-medium text-gray-900">
                                                        {detalle.nota ? detalle.nota : 'N/A'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div className="flex items-center">
                                                    <div className="font-medium text-gray-900">
                                                        {detalle.cantidad}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div className="flex items-center">
                                                    <div className="font-medium text-gray-900">
                                                        ${detalle.total / detalle.cantidad}{(detalle.total / detalle.cantidad)?.toString().includes('.') ? '0':'.00'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div className="flex items-center">
                                                    <div className="font-medium text-gray-900">
                                                        ${detalle.total}{detalle.total?.toString().includes('.') ? '0':'.00'}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className='flex flex-col w-max-content bg-white p-2'>
                                    <div className='flex col-span-2 justify-end mb-3'>
                                        Total de la venta: ${details.total}{details.total?.toString().includes('.') ? '0':'.00'}
                                    </div>
                                    <div className='flex col-span-2 justify-end'>
                                        <button className="bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1" type="button" style={{ transition: "all .15s ease" }} onClick={handleClose}>
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-600">
            Total del rango: ${sumTotal}{sumTotal.toString().includes('.') ? '0':'.00'}
        </h2>
    </div>
    
    );
};

export default VentasList;