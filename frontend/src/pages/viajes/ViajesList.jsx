import React, { useState, useEffect, useMemo } from 'react';
import Pagination from '../../utils/Pagination';
import API from '../../utils/API';
import AnimatedPage from '../../utils/AnimatedPage';
import ViajesTable from './ViajesTable';
import SearchBar from '../../utils/SearchBar';


function ViajesList() {

    let PageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [viajes, setViajes] = useState([]);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return viajes.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, viajes]);

    useEffect(() => {
        API.post('ptr/viajes/list/',{ fecha_inicio: '' , fecha_fin: '', campo: campo })
            .then(res => {
            setViajes(res.data);
            })
        .catch(err => {
            console.log(err);
        })
    }, []);

    const campo = localStorage.getItem('campo');

    const filterViajes = () => {
        const filtered = viajes.filter(viaje => {
            return (
                viaje.asociado.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
                viaje.campo_destino.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
                viaje.folio.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
                viaje.status.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
                viaje.fecha_salida.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
                viaje.lugar_salida.toLowerCase().indexOf(search.toLowerCase()) !== -1
            );
        });
        if (search === '') {
            API.post('ptr/viajes/list/',{ fecha_inicio: startDate, fecha_fin: endDate, campo: campo })
            .then(res => {
                setViajes(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        } else {
            setViajes(filtered);
        }
    };

    useEffect(() => {
        filterViajes();
    }, [search]);

    const dateFilter = (e) => {
        e.preventDefault();
        if (startDate > endDate) {
            alert('La fecha de inicio no puede ser mayor a la fecha de fin');
        } else {
            API.post('ptr/viajes/list/', { fecha_inicio: startDate, fecha_fin: endDate, campo: campo })
                .then(res => {
                    setViajes(res.data);          
                })
                .catch(err => {
                    console.log(err);
                })
        }
    };

    const handleReset = () => {
        setSearch('');
        setStartDate('');
        setEndDate('');
        API.post('ptr/viajes/list/',{ fecha_inicio: '', fecha_fin: '', campo: campo })
        .then(res => {
            setViajes(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    };
       

    return (
    <AnimatedPage>
        <main>
            <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
                <h1 className='text-2xl font-semibold text-gray-900'>Reclutamiento</h1>
            </div>
            <div className='px-4 sm:px-6 lg:px-8 w-full max-w-9xl mx-auto'>
                <div className='px-4 sm:px-4 lg:px-8 py-2 w-full max-w-9xl mx-auto mt-4'>
                    <h3 className='text-lg leading-6 font-medium text-gray-900'>Lista de viajes</h3>
                </div>
                <div className='px-8 py-5 sm:p-8 md:p-8'>
                    <div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12 rounded-md'>
                        <div className='col-span-12 md:col-span-6'>
                            <SearchBar callback={(search) => setSearch(search)} />
                        </div>
                        <form onSubmit={dateFilter} className='col-span-12 md:col-span-6'>
                            <div className='flex flex-row justify-center mb-3'>
                                <div className='flex flex-col'>
                                    <label className='px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Fecha Inicio</label>
                                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className='ml-2 w-auto p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent' />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ml-2'>Fecha Fin</label>
                                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className='ml-2 w-auto p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent' />
                                </div>
                            </div>
                            <div className='flex flex-col justify-end md:flex-row md:justify-center'>
                                <button type='submit' className='py-2 px-4 bg-green-500 hover:bg-green-700 text-white rounded mb-3 md:w-1/4'>Filtrar</button>
                                <button className='py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded mb-3 md:ml-2 md:w-1/4' onClick={handleReset}>Limpiar</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='overflow-x-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
                    <div className='flex flex-col'>
                        <div className='-my-2 sm:-mx-6 lg:-mx-8'>
                            <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
                                <ViajesTable viajes={currentTableData} campo={campo} />
                                <Pagination
                                    className="pagination-bar"
                                    currentPage={currentPage}
                                    totalCount={viajes.length}
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
    )
};

export default ViajesList;