import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setData } from '../../reducers/viajes/viajeData';
import { useDispatch } from 'react-redux';
import Toast from '../../utils/Toast';
import API from '../../utils/API';
import Swal from 'sweetalert2';


const ViajesTable = ({viajes}) => {

    const dispatch = useDispatch();

    const campo = localStorage.getItem('campo');
    
    const [campos, setCampos] = useState([]);
    const [lineas, setLineas] = useState([]);
    const [salidas, setSalidas] = useState([]);
    const [modal, setModal] = useState(false);

    const [form, setForm] = useState({
        fecha_salida: '',
        hora_salida: '',
        campo_destino_id: '',
        lugar_salida_id: '',
        linea_transporte_id: '',
        referencia_viaje: '',
        placas_transporte: '',
        nombre_conductor: '',
        telefono_conductor: '',
        numero_economico: '',
        licencia_conductor: '',
        vigencia_licencia: '',
        poliza_seguro: '',
        vigencia_poliza: '',
        status: '',
        folio: ''
    });

    useEffect(() => {
        const getLugares = async () => {
            await API.get('ptr/salidas/list')
            .then(res => {
                setSalidas(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        }
        const getLineas = async () => {
            await API.get('ptr/lineas/list')
            .then(res => {
                setLineas(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        }
        const getCampos = async () => {
            await API.get('campos/list')
            .then(res => {
                setCampos(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        }
        getLugares();
        getLineas();
        getCampos();
    }, []);

    const handleDeleteViaje = (id) => {
        Swal.fire({
          title: '¿Estás seguro de cancelar este viaje?',
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'Regresar',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '¡Sí, Cancelar!'
        }).then((result) => {
          if (result.isConfirmed) {
            API.post(`/ptr/viajes/delete/${id}/`)
              .then(res => {
                setTimeout(() => {
                    window.location.reload();
                    }, 2000);
              })
              .catch(err => {
                console.log(err);
              })
            Toast.fire({
              icon: 'success',
              title: 'Viaje cancelado'
            });
          }
        })
    };

    const handleEdit = (viaje) => {
        setModal(!modal);
        setForm(viaje);
    };

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleCancel = () => {
        setModal(!modal);
        setForm({
            fecha_salida: '',
            hora_salida: '',
            campo_destino_id: '',
            lugar_salida_id: '',
            linea_transporte_id: '',
            referencia_viaje: '',
            placas_transporte: '',
            nombre_conductor: '',
            telefono_conductor: '',
            numero_economico: '',
            licencia_conductor: '',
            vigencia_licencia: '',
            poliza_seguro: '',
            vigencia_poliza: '',
            status: '',
            folio: ''
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        Swal.fire({
            loading: true,
            title: 'Actualizando viaje...',
            showConfirmButton: false,
            timer: 2000
          });
        setTimeout(() => {
        API.post(`/ptr/viajes/update/`, form)
        .then(res => {
            setModal(!modal);
            setForm({
                fecha_salida: '',
                hora_salida: '',
                campo_destino_id: '',
                lugar_salida_id: '',
                linea_transporte_id: '',
                referencia_viaje: '',
                placas_transporte: '',
                nombre_conductor: '',
                telefono_conductor: '',
                numero_economico: '',
                licencia_conductor: '',
                vigencia_licencia: '',
                poliza_seguro: '',
                vigencia_poliza: '',
                status: '',
                folio: ''
            });
            Toast.fire({
                icon: 'success',
                title: 'Viaje actualizado'
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        })
        .catch(err => {
            Toast.fire({
                icon: 'error',
                title: 'Error al actualizar'
            });
        })
    }
    , 2000);
    };

    return (
        console.log(form),
        <>
        <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
                <tr>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Folio
                    </th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Cantidad
                    </th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Asociado
                    </th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Origen
                    </th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Destino
                    </th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Fecha
                    </th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Hora
                    </th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Status
                    </th>
                    <th scope='col' className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Acciones
                    </th>
                </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
                {viajes ? viajes.map((viaje, id) => (
                campo === viaje.campo_destino || campo === 'TODOS' ? (
                <tr key={id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                            <div className='ml-4'>
                                <div className='text-sm font-medium text-gray-900'>
                                    {viaje.folio}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{viaje.cantidad}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{viaje.asociado}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{viaje.lugar_salida ? viaje.lugar_salida : 'No definido'}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{viaje.campo_destino}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'>
                            {viaje.fecha_salida ? viaje.fecha_salida.split('T')[0] : 'Sin fecha'}
                        </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {viaje.hora_salida ? viaje.hora_salida.slice(0, 5) : 'No definida'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                        {viaje.status === 'Activo' ? 
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-600'>
                            {viaje.status}
                        </span>
                        : viaje.status === 'Aceptado' ?
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-600'>
                            {viaje.status}
                        </span>
                        : viaje.status === 'En curso' ?
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-600'>
                            {viaje.status}
                        </span>
                        : viaje.status === 'Finalizado' ?
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-600'>
                            {viaje.status}
                        </span>
                        : viaje.status === 'Rechazado' ?
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-600'>
                            {viaje.status}
                        </span>
                        :
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600'>
                            {viaje.status}
                        </span>
                        }
                    </td>
                    {viaje.status !== 'Cancelado' ? (  
                    <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                        <a href='#' className='bg-red-100 hover:bg-red-500 text-red-800 hover:text-white py-1 px-2 rounded mr-2 border border-red-800' onClick={() => handleEdit(viaje)}>Editar</a>
                        <Link to='/reclutamiento/viajes/detalle' className='bg-blue-100 hover:bg-blue-700 text-blue-800 hover:text-white py-1 px-2 rounded mr-2 border border-blue-800' onClick={() => dispatch(setData({
                            viaje: viaje.id,
                            folio: viaje.folio,
                            campo: viaje.campo_destino,
                            status: viaje.status,
                            origen: viaje.lugar_salida,
                            })
                        )}>  Detalle</Link>
                        {!viaje.aceptado ? (
                        <a href='#' className='bg-red-100 hover:bg-red-500 text-red-800 hover:text-white py-1 px-2 rounded mr-2 border border-red-800' onClick={() => handleDeleteViaje(viaje.id)}>Cancelar</a>
                        ) : (null)}
                    </td>
                    ) : (
                    <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'></td>
                    )}
                </tr>
                ) : (null)
                )) : null}
            </tbody>
        </table>
        <div className={!modal ? 'fixed hidden inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full display-none':'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full display-block'}>
            <div className='relative top-20 px-10 sm:px-6 lg:px-8 py-8 mx-auto align-center justify-center max-w-2xl sm:max-w-2xl md:max-w-7xl'>
                <div className='flex flex-col w-max-content bg-white p-2'>
                    <div className="flex justify-center p-8 rounded-t border-b">
                        <h1 className="text-2xl font-bold text-red-600">
                            Viaje {form.folio}
                        </h1>
                    </div>
                    <form className='py-4 align-middle inline-block sm:px-8 lg:px-12' onSubmit={handleUpdate}>          
                        <div className='shadow overflow-hidden border-b border-gray-200'>
                            <div className='px-4 py-5 bg-white sm:p-12 md:p-8'>
                                <div className='grid grid-rows-12 gap-6'>
                                    <div className='col-span-12 sm:col-span-6'>
                                        <label htmlFor='asociado' className='block text-sm font-medium text-gray-700'>
                                            Asociado
                                        </label>
                                        <input 
                                            type='text' 
                                            name='asociado' 
                                            value={form.asociado} 
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-slate-100'
                                            disabled
                                        />
                                    </div>
                                    <div className='col-span-12 sm:col-span-3'>
                                        <label htmlFor='cantidad' className='block text-sm font-medium text-gray-700'>
                                            Cantidad de personas
                                        </label>
                                        <input
                                            type='number'
                                            name='cantidad'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-slate-100'
                                            value={form.cantidad}
                                            disabled 
                                        />
                                    </div>
                                    <div className='col-span-12 sm:col-span-3'>
                                        <label htmlFor='fecha_salida' className='block text-sm font-medium text-gray-700'>
                                            Fecha de salida
                                        </label>
                                        <input
                                            type='date'
                                            name='fecha_salida'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                            onChange={handleInputChange}
                                            value={form.fecha_salida?.split('T')[0]}
                                        />
                                    </div>
                                    <div className='col-span-12 sm:col-span-3'>
                                        <label htmlFor='hora_salida' className='block text-sm font-medium text-gray-700'>
                                            Hora de salida
                                        </label>
                                        <input
                                            type='time'
                                            name='hora_salida'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                            onChange={handleInputChange}
                                            value={form.hora_salida}
                                        />
                                    </div>
                                    <div className='col-span-12 sm:col-span-3'>
                                        <label htmlFor='lugar_salida' className='block text-sm font-medium text-gray-700'>
                                            Campo de destino
                                        </label>
                                        <select name='campo_destino' className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' onChange={handleInputChange}>
                                            <option value=''>Seleccione un campo de destino</option>
                                            {campos.map((campo) => (
                                                campo.nombre !== 'TODOS' ? (
                                                campo.id === form.campo_destino_id ?
                                                <option key={campo.id} value={campo.nombre} selected>{campo.nombre}</option>
                                                : <option key={campo.id} value={campo.nombre}>{campo.nombre}</option>
                                                ) : (null)
                                            ))}
                                        </select>
                                    </div>
                                    <div className='col-span-12 sm:col-span-3'>
                                        <label htmlFor='lugar_salida' className='block text-sm font-medium text-gray-700'>
                                            Lugar de salida
                                        </label>
                                        <select name='lugar_salida_id' className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' onChange={handleInputChange}>
                                            <option value=''>Seleccione un lugar de salida</option>
                                                {salidas.map((salida) => (
                                                salida.id === form.lugar_salida_id ?
                                                <option key={salida.id} value={salida.id} selected>{salida.nombre}</option>
                                                : <option key={salida.id} value={salida.id}>{salida.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='col-span-12 sm:col-span-2'>
                                        <label htmlFor='linea_transporte' className='block text-sm font-medium text-gray-700'>
                                            Línea de Transporte
                                        </label>
                                        <select name='linea_transporte_id' className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' onChange={handleInputChange}>
                                            <option value=''>Seleccione una línea de transporte</option>
                                            {lineas && lineas.map((linea) => (
                                                linea.id === form.linea_transporte_id ? 
                                                <option key={linea.id} value={linea.id} selected> {linea.nombre}</option>
                                                : <option key={linea.id} value={linea.id}> {linea.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='col-span-12 sm:col-span-1'>
                                        <label htmlFor='status' className='block text-sm font-medium text-gray-700 mb-3'>Status</label>
                                        { form.status === 'Activo' ? 
                                            <h1 className='text-blue-500 font-bold'>Activo</h1>
                                            : form.status === 'Aceptado' ?
                                            <h1 className='text-yellow-500 font-bold'>Aceptado</h1>
                                            : form.status === 'En curso' ?
                                            <h1 className='text-orange-500 font-bold'>En curso</h1>
                                            : form.status === 'Finalizado' ?
                                            <h1 className='text-green-500 font-bold'>Finalizado</h1>
                                            : form.status === 'Cancelado' ?
                                            <h1 className='text-gray-500 font-bold'>Cancelado</h1>
                                            : <h1 className='text-red-500 font-bold'>Rechazado</h1>
                                        }
                                    </div>
                                    <div className='col-span-12 sm:col-span-2'>
                                        <label htmlFor='referencia_viaje' className='block text-sm font-medium text-gray-700'>
                                            Referencia de viaje
                                        </label>
                                        <input
                                            type='text'
                                            name='referencia_viaje'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                            value={form.referencia_viaje}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className='col-span-12 sm:col-span-2'>
                                        <label htmlFor='placas_transporte' className='block text-sm font-medium text-gray-700'>
                                            Placas de transporte
                                        </label>
                                        <input
                                            type='text'
                                            name='placas_transporte'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                            value={form.placas_transporte}
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                    <div className='col-span-12 sm:col-span-2'>
                                        <label htmlFor='nombre_conductor' className='block text-sm font-medium text-gray-700'>
                                            Nombre de conductor
                                        </label>
                                        <input
                                            type='text'
                                            name='nombre_conductor'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                            value={form.nombre_conductor}
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                    <div className='col-span-12 sm:col-span-2'>
                                        <label htmlFor='numero_economico' className='block text-sm font-medium text-gray-700'>
                                            Número económico
                                        </label>
                                        <input
                                            type='text'
                                            name='numero_economico'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                            value={form.numero_economico}
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                    <div className='col-span-12 sm:col-span-2'>
                                        <label htmlFor='telefono_conductor' className='block text-sm font-medium text-gray-700'>
                                            Teléfono de conductor
                                        </label>
                                        <input
                                            type='text'
                                            name='telefono_conductor'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                            value={form.telefono_conductor}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className='col-span-12 sm:col-span-2'>
                                        <label htmlFor='licencia_conductor' className='block text-sm font-medium text-gray-700'>
                                            Licencia de conductor
                                        </label>
                                        <input
                                            type='text'
                                            name='licencia_conductor'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                            value={form.licencia_conductor}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className='col-span-12 sm:col-span-2'>
                                        <label htmlFor='vigencia_licencia' className='block text-sm font-medium text-gray-700'>
                                            Vigencia de licencia
                                        </label>
                                        <input
                                            type='date'
                                            name='vigencia_licencia'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                            value={form.vigencia_licencia}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className='col-span-12 sm:col-span-2'>
                                        <label htmlFor='poliza_seguro' className='block text-sm font-medium text-gray-700'>
                                            Póliza de seguro
                                        </label>
                                        <input
                                            type='text'
                                            name='poliza_seguro'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                            value={form.poliza_seguro}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className='col-span-12 sm:col-span-2'>
                                        <label htmlFor='vigencia_poliza' className='block text-sm font-medium text-gray-700'>
                                            Vigencia de póliza
                                        </label>
                                        <input
                                            type='date'
                                            name='vigencia_poliza'
                                            className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                            value={form.vigencia_poliza}
                                            onChange={handleInputChange}
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
    </>
    )
}

export default ViajesTable;