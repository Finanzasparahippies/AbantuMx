import React, { useState, useEffect } from 'react';
import { setData } from '../../reducers/viajes/solicitudData';
import { useSelector, useDispatch} from 'react-redux';
import Toast from '../../utils/Toast';
import Select from 'react-select';
import API from '../../utils/API';
import Swal from 'sweetalert2';
import AnimatedPage from '../../utils/AnimatedPage';


function Viajes() {

  const dispatch = useDispatch();

  const { campo, id, cantidad, folio, fecha, asociadosReq } = useSelector(state => state.solicitudData );
  const [asociados, setAsociados] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [asocs, setAsocs] = useState([]);
  const [consecutivo, setConsecutivo] = useState('');
  const [form, setForm] = useState({
        asociado: '',
        solicitud : id,
        cantidad: '',
        fecha_salida: '',
        hora_salida: '',
        campo_destino: campo,
        lugar_salida: '',
        referencia_viaje: '',
        linea_transporte: '',
        placas_transporte: '',
        numero_economico: '',
        nombre_conductor: '',
        telefono_conductor: '',
        licencia_conductor: '',
        vigencia_licencia: '',
        poliza_seguro: '',
        vigencia_poliza: '',
        suma: '',
        folio: consecutivo
  });

  const asoc = asociados.find((asociado) => asociado.id === form.asociado);

  useEffect(() => {
    API.get('/users/list_asociados').then(res => {setAsociados(res.data);}).catch(err => {console.log(err);});
    API.get('/ptr/salidas/list').then(res => {setLugares(res.data);}).catch(err => {console.log(err);});
    API.get('/ptr/lineas/list').then(res => {setLineas(res.data);}).catch(err => {console.log(err);});
    API.post('/ptr/viajes/prelist/', { folio: folio }).then(res => {setAsocs(res.data);}).catch(err => {console.log(err);});
  }, []);

  const handleInputChange = (e) => {
        if (asocs.length > 0) {
          setConsecutivo(folio + '-V' + (parseInt(asocs[0]?.folio.split('V').pop()) + 1))
          } else {
          setConsecutivo(folio + '-V1')
          }
        setForm({
          ...form,
          [e.target.name]: e.target.value,
          suma: cantidad - form.cantidad,
          folio: consecutivo
        });
  }

  const handleSelectChange = (value, actionMeta) => {
    if (asocs.length > 0) {
    setConsecutivo(folio + '-V' + (parseInt(asocs[0]?.folio.split('V').pop()) + 1))
    } else {
      setConsecutivo(folio + '-V1')
    }
    setForm({
      ...form,
      [actionMeta.name]: value.value,
      folio: consecutivo
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Guardando...',
      allowOutsideClick: false,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    if (form.asociado !== '' || form.cantidad !== '' || form.fecha_salida !== '' || form.hora_salida !== '' || form.lugar_salida !== '') {
    if (cantidad - form.cantidad >= 0) {
     setTimeout(() => {
      API.post('/ptr/viajes/create/', form)
        .then(res => {
          Toast.fire({
            icon: 'success',
            title: 'Viaje registrado',
          });
          dispatch(setData({
            id: id,
            campo: campo,
            cantidad: cantidad - form.cantidad,
            folio: folio,
            fecha: fecha,
            asociadosReq: asociadosReq
          }));
          setForm({
            ...form,
            asociado: '',
            solicitud : id,
            cantidad: '',
            fecha_salida: '',
            hora_salida: '',
            campo_destino: campo,
            lugar_salida: '',
            referencia_viaje: '',
            linea_transporte: '',
            placas_transporte: '',
            numero_economico: '',
            nombre_conductor: '',
            telefono_conductor: '',
            licencia_conductor: '',
            vigencia_licencia: '',
            poliza_seguro: '',
            vigencia_poliza: '',
            suma: '',
            folio: consecutivo    
          });
          API.post('/ptr/viajes/prelist/', { folio: folio }).then(res => {setAsocs(res.data);}).catch(err => {console.log(err);});
        })
        .catch(err => {
          Toast.fire({
            icon: 'error',
            title: 'Error al registrar viaje',
          });
        });
      }, 2000);
    } else {
      Toast.fire({
        icon: 'error',
        title: 'Cantidad de personas menor a las seleccionadas',
      });
    }
  } else {
    if (form.asociado === '') {
      Toast.fire({
        icon: 'error',
        title: 'Selecciona un asociado',
      });
    }
    if (form.cantidad === '') {
      Toast.fire({
        icon: 'error',
        title: 'Ingresa la cantidad de personas',
      });
    }
    if (form.fecha_salida === '') {
      Toast.fire({
        icon: 'error',
        title: 'Ingresa la fecha de salida',
      });
    }
    if (form.hora_salida === '') {
      Toast.fire({
        icon: 'error',
        title: 'Ingresa la hora de salida',
      });
    }
    if (form.lugar_salida === '') {
      Toast.fire({
        icon: 'error',
        title: 'Ingresa el lugar de salida',
      });
    }
  }
}

const handleConfirm = (e) => {
  e.preventDefault();
  setForm({
    ...form
  });
  Swal.fire({
    title:  `¿Estás seguro de registrar el viaje ${consecutivo}?`,
    text: form.asociado !== '' ? 'El viaje se registrará con el asociado ' + asoc.nombres +' '+ asoc.apellidos + ' con ' + form.cantidad +  ' personas' : 'Selecciona un asociado',
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '¡Sí, guardar!'
  })
  .then((result) => {
    if (result.isConfirmed) {
      handleSubmit(e);
    }
  })}  

  return (
    <AnimatedPage>   
        <main>
          <div className="flex flex-row py-12">
            <div className='flex flex-col w-1/2 ml-8 md:ml-20'>
              <h1 className='text-2xl font-semibold text-gray-900'>Reclutamiento - Viajes</h1>
              <table className='w-1/2 mt-4'>
                <thead className='w-full items-center bg-white divide-y divide-gray-200'>
                  <tr className='w-full'>                  
                    <th className='p-4 text-xs border-gray-500 font-semibold text-left text-gray-500 uppercase bg-gray-100'>Asociado sugerido</th>
                    <th className='p-4 text-xs border-gray-500 font-semibold text-left text-gray-500 uppercase bg-gray-100'>Cantidad</th>
                  </tr>
                </thead>
                <tbody className='items-center w-full bg-white divide-y divide-gray-200'>
                  {asociadosReq && asociadosReq.map((asociado, index) => (
                    <tr className='w-full mb-4' key={index}>
                      <td className='p-4 text-sm border border-gray-200'>{asociado.nombres + ' ' + asociado.apellidos}</td>
                      <td className='p-4 text-sm border border-gray-200'>{asociado.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='flex flex-col md:w-1/5 ml-auto md:mr-2 w-1/2'>
              { cantidad - form.cantidad > 0 ? (
              <h1 className='text-2xl font-semibold text-red-600'>{cantidad - form.cantidad} personas disponibles</h1>
              ) : (
              <h1 className='text-2xl font-semibold text-red-600'>No hay personas por asignar</h1>
              )}
              <h4 className='text-md font-medium text-gray-900'>Folio: {consecutivo}</h4>
              <h5 className='text-md font-medium text-gray-900'>Fecha requerida: {fecha}</h5>
            </div>
          </div>
          <div className='px-4 sm:px-6 lg:px-8 w-full max-w-9xl mx-auto'>
            <form className='space-y-8 divide-y divide-gray-200'>
              <div className='space-y-8 divide-y divide-gray-200 sm:space-y-5'>
                  <div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
                    <div className='sm:col-span-2'>
                      <label htmlFor='asociado' className='block text-sm font-medium text-gray-700'>Asociado *</label>
                      <Select
                          name='asociado'
                          onChange={(value, actionMeta) => handleSelectChange(value, actionMeta)}
                          options={asociados.map((asociado) => ({
                            value: asociado.id,
                            label: asociado.nombres + ' ' + asociado.apellidos
                          }))}
                          placeholder='Selecciona un asociado'
                          value={ asoc ? { value: asoc.id, label: asoc.nombres + ' ' + asoc.apellidos } : null }
                          required
                        />
                    </div>
                    <div className='sm:col-span-1'>
                      <label htmlFor='cantidad' className='block text-sm font-medium text-gray-700'>Cantidad de personas *</label>
                      <input type='number' name='cantidad' className='mt-1 block w-full py-2 px-3 border border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md' max='10000' min='0' placeholder='0' onChange={handleInputChange} required value={form.cantidad} />
                    </div>
                    <div className='sm:col-span-1'>
                      <label htmlFor='fecha_salida' className='block text-sm font-medium text-gray-700'>Fecha salida *</label>
                      <input type='date' name='fecha_salida' className='mt-1 block w-full py-2 px-3 border border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md' onChange={handleInputChange} value={form.fecha_salida} required />
                    </div>
                    <div className='sm:col-span-1'>
                      <label htmlFor='hora_salida' className='block text-sm font-medium text-gray-700'>Hora salida *</label>
                      <input type='time' name='hora_salida' className='mt-1 block w-full py-2 px-3 border border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md' onChange={handleInputChange} value={form.hora_salida} required />
                    </div>
                    <div className='sm:col-span-1'>
                      <label htmlFor='lugar_salida' className='block text-sm font-medium text-gray-700'>Lugar de salida *</label>
                      <select name='lugar_salida' className='mt-1 block w-full py-2 px-3 border border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md' onChange={handleInputChange} value={form.lugar_salida} required>
                        <option value=''>Selecciona un lugar</option>
                        {lugares && lugares.map((lugar, index) => (
                          <option key={index} value={lugar.id}>{lugar.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className='sm:col-span-1'>
                      <label htmlFor='referencia_viaje' className='block text-sm font-medium text-gray-700'>Referencia de viaje</label>
                      <input placeholder='Referencia' type='text' name='referencia_viaje' className='mt-1 block w-full py-2 px-3 border border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md' onChange={handleInputChange} value={form.referencia_viaje} />
                    </div>
                    <div className='sm:col-span-1'>
                      <label htmlFor='linea_transporte' className='block text-sm font-medium text-gray-700'>Línea de transporte</label>
                      <select id='linea_transporte' name='linea_transporte' autoComplete='linea_transporte' className='mt-1 block w-full py-2 px-3 border border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md' onChange={handleInputChange} value={form.linea_transporte}>
                        <option value=''>Selecciona una linea</option>
                        {lineas && lineas.map((linea, index) => (
                          <option key={index} value={linea.id}>{linea.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className='sm:col-span-1'>
                      <label htmlFor='placas_transporte' className='block text-sm font-medium text-gray-700'>Placas de transporte</label>
                      <input placeholder='Placas' type='text' name='placas_transporte' id='placas_transporte' className='mt-1 block w-full py-2 px-3 border border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md' onChange={handleInputChange} value={form.placas_transporte} />
                    </div>
                    <div className='sm:col-span-1'>
                      <label htmlFor='numero_economico' className='block text-sm font-medium text-gray-700'>Número económico</label>
                      <input placeholder='Número económico' type='text' name='numero_economico' id='numero_economico' className='mt-1 block w-full py-2 px-3 border border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md' onChange={handleInputChange} value={form.numero_economico} />
                    </div>
                    <div className='sm:col-span-2'>
                      <label htmlFor='nombre_conductor' className='block text-sm font-medium text-gray-700'>Nombre de conductor</label>
                      <input placeholder='Nombre de conductor' type='text' name='nombre_conductor' id='nombre_conductor' className='mt-1 block w-full py-2 px-3 border border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md' onChange={handleInputChange} value={form.nombre_conductor} />
                    </div>
                    <div className='sm:col-span-1'>
                      <label htmlFor='telefono_conductor' className='block text-sm font-medium text-gray-700'>Teléfono de conductor</label>
                      <input placeholder='Teléfono de conductor' type='text' name='telefono_conductor' id='telefono_conductor' className='mt-1 block w-full py-2 px-3 border border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md' onChange={handleInputChange} value={form.telefono_conductor} />
                    </div>
                    <div className='sm:col-span-1'>
                      <label htmlFor='licencia_conductor' className='block text-sm font-medium text-gray-700'>Licencia de conductor</label>
                      <input placeholder='Licencia de conductor' type='text' name='licencia_conductor' id='licencia_conductor' className='mt-1 block w-full py-2 px-3 border border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md' onChange={handleInputChange} value={form.licencia_conductor} />
                    </div>
                    <div className='sm:col-span-1'>
                      <label htmlFor='vigencia_licencia' className='block text-sm font-medium text-gray-700'>Vigencia de licencia</label>
                      <input placeholder='Vigencia de licencia' type='date' name='vigencia_licencia' id='vigencia_licencia' className='mt-1 block w-full py-2 px-3 border border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md' onChange={handleInputChange} value={form.vigencia_licencia} />
                    </div>
                    <div className='sm:col-span-1'>
                      <label htmlFor='poliza_seguro' className='block text-sm font-medium text-gray-700'>Póliza de seguro</label>
                      <input placeholder='Póliza de seguro' type='text' name='poliza_seguro' id='poliza_seguro' className='mt-1 block w-full py-2 px-3 border border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md' onChange={handleInputChange} value={form.poliza_seguro} />
                    </div>
                    <div className='sm:col-span-1'>
                      <label htmlFor='vigencia_poliza' className='block text-sm font-medium text-gray-700'>Vigencia de póliza</label>
                      <input placeholder='Vigencia de póliza' type='date' name='vigencia_poliza' id='vigencia_poliza' className='mt-1 block w-full py-2 px-3 border border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md' onChange={handleInputChange} value={form.vigencia_poliza} />
                    </div>
                  </div>
              </div>          
              <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
                <div className='flex justify-center'>
                  <button type='button' className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500' onClick={handleConfirm}>
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className='px-4 sm:px-6 lg:px-8 w-full max-w-9xl mx-auto'>
            <div className='px-4 sm:px-4 lg:px-8 py-2 w-full max-w-9xl mx-auto mt-4'>
              <h3 className='text-lg leading-6 font-medium text-gray-900'>Lista de viajes solicitud {folio}</h3>
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
                              Folio
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Nombre
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Cantidad de personas
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Fecha de salida
                            </th>
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                          {asocs && asocs.map(asoc => (
                            asoc.status === "Cancelado" || asoc.status === "Rechazado" ?
                            null :
                            <tr key={asoc.id}>
                              <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-900'>{asoc.folio}</div>
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='flex items-center'>
                                  <div className='ml-4'>
                                    <div className='text-sm font-medium text-gray-900'>
                                      {asoc.asociado}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-900'>{asoc.cantidad}</div>
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-900'>{asoc.fecha_salida ? asoc.fecha_salida.split('T')[0] : 'Sin fecha'}</div>
                              </td>
                            </tr>
                          ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
      </AnimatedPage>
  )
}

export default Viajes;