import React, { useState, useEffect, useMemo } from 'react';
import Pagination from '../../utils/Pagination';
import AnimatedPage from '../../utils/AnimatedPage';
import { useSelector } from 'react-redux';
import API from '../../utils/API';
import Swal from 'sweetalert2';
import Toast from '../../utils/Toast';
import '../../css/login.css';

function DetalleViaje() {

  const { viaje, folio, campo, status, origen  } = useSelector(state => state.viajeData);

  let PageSize = 10;
  const [IDs, setIDs] = useState([]);
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [foto, setFoto] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [curpError, setCurpError] = useState(false);
  const [claveError, setClaveError] = useState(false);
  const [cpError, setCpError] = useState(false);
  const [sexoError, setSexoError] = useState(false);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return IDs.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, IDs]);

  const [form, setForm] = useState({
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: '',
    sexo: '',
    curp: '',
    clave_elector: '',
    calle: '',
    colonia: '',
    numero: '',
    codigo_postal: '',
    municipio: '',
    localidad: '',
    estado: '',
    clave_estado: '',
    cod_campo: ''
  })


  useEffect(() => {
    const getIDs = async () => {
      const res = await API.get(`ptr/viajes/identificaciones/list/${viaje}`);
      setIDs(res.data);
    }
    getIDs();
  }, []);

  const handleFoto = (foto) => {
    setFoto(foto);
    setModal(true);
  }
    
  const handleEdit = (detalle) => {
    setModal2(!modal2)
    setForm(detalle)
  }

  const handleCancel = () => {
    setModal2(!modal2)
    setForm({
      nombres: '',
      apellido_paterno: '',
      apellido_materno: '',
      fecha_nacimiento: '',
      sexo: '',
      curp: '',
      clave_elector: '',
      calle: '',
      colonia: '',
      numero: '',
      codigo_postal: '',
      municipio: '',
      localidad: '',
      estado: '',
      clave_estado: '',
      cod_campo: '',
    })
  }

  const handleInputChange = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value
    });
  };
  
  const handleUpdate = (e) => {
    e.preventDefault();
    Swal.fire({
        loading: true,
        title: 'Actualizando detalles...',
        showConfirmButton: false,
        timer: 2000
      });
    setTimeout(() => {
    API.put(`ptr/viajes/identificaciones/update/${form.id}/`, form)
    .then(res => {
        setModal2(!modal2);
        setForm({
          nombres: '',
          apellido_paterno: '',
          apellido_materno: '',
          fecha_nacimiento: '',
          sexo: '',
          curp: '',
          clave_elector: '',
          calle: '',
          colonia: '',
          numero: '',
          codigo_postal: '',
          municipio: '',
          localidad: '',
          estado: '',
          clave_estado: '',
          cod_campo: ''
        })
        Toast.fire({
            icon: 'success',
            title: 'Detalles actualizado'
        });
        const getIDs = async () => {
          const res = await API.get(`ptr/viajes/identificaciones/list/${viaje}`);
          setIDs(res.data);
        }
        getIDs();
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

const handleSync = () => {
  Swal.fire({
    loading: true,
    title: 'Sincronizando empleados...',
    showConfirmButton: false,
    timer: 2000
  })
  setTimeout(() => {
    API.put(`ptr/viajes/identificaciones/sync/${viaje}/`)
    .then(res => {
      Toast.fire({
        icon: 'success',
        title: 'Datos sincronizados'
    });
    const getIDs = async () => {
      const res = await API.get(`ptr/viajes/identificaciones/list/${viaje}`);
      setIDs(res.data);
    }
    getIDs();
  })
  .catch(err => {
    if (err.response.status === 400) {
      Toast.fire({
        icon: 'warning',
        title: 'No hay empleados para sincronizar'
    });
    } else {
    Toast.fire({
        icon: 'error',
        title: 'Error al sincronizar'
    });
    }
  })
}
, 2000);
};

const handleConfirm = () => {
  Swal.fire({
    title:  `¿Estás seguro de sincronizar los empleados?`,
    text: 'Se sincronizaran los empleados que no se encuentren en la base de datos del viaje ' + folio,
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '¡Sí, sincronizar!'
  })
  .then((result) => {
    if (result.isConfirmed) {
      handleSync();
    }
  })}

  const curpValidation = (e) => {
    const curp = e.target.value;
    const curpRegex = /^[A-Z]{4}[0-9]{6}[H,M][A-Z]{5}[A-Z,0-9][0-9]$/;
    if (!curpRegex.test(curp) && curp.length > 0) {
      setCurpError(true);
    } else {
      setCurpError(false);
    }
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const claveElectorValidation = (e) => {
    const clave_elector = e.target.value;
    const claveElectorRegex = /^[A-Z]{6}[0-9]{8}[A-Z]{1}[0-9]{3}$/;
    if (!claveElectorRegex.test(clave_elector) && clave_elector.length > 0) {
      setClaveError(true);
    } else {
      setClaveError(false);
    }
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const cpValidation = (e) => {
    const codigo_postal = e.target.value;
    const cpRegex = /^[0-9]{5}$/;
    if (!cpRegex.test(codigo_postal) && codigo_postal.length > 0) {
      setCpError(true);
    } else {
      setCpError(false);
    }
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const sexoValidation = (e) => {
    const sexo = e.target.value;
    const sexoRegex = /^[H,M]$/;
    if (!sexoRegex.test(sexo) && sexo.length > 0) {
      setSexoError(true);
    } else {
      setSexoError(false);
    }
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const handleDelete = (id) => {
    Swal.fire({
      title:  `¿Estás seguro de eliminar el empleado?`,
      text: 'Se eliminará el empleado del viaje ' + folio,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminar!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        API.delete(`ptr/viajes/identificaciones/delete/${id}/`)
        .then(res => {
          Toast.fire({
            icon: 'success',
            title: 'Empleado eliminado'
        });
        const getIDs = async () => {
          const res = await API.get(`ptr/viajes/identificaciones/list/${viaje}`);
          setIDs(res.data);
        }
        getIDs();
      })
      .catch(err => {
        Toast.fire({
            icon: 'error',
            title: 'Error al eliminar'
        });
      })
      }
    })
  }

  return (
    console.log(IDs),
    <AnimatedPage>
        <main>
          <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
            <h1 className='text-2xl font-semibold text-gray-900'>Detalle de viaje {folio}</h1>
            <h1 className='text-xl font-semibold text-gray-900'>Origen: {origen}</h1>
            <h1 className='text-xl font-semibold text-gray-900'>Destino: {campo}</h1>
            {status === 'Activo' ? ( 
            <h1 className='text-xl font-semibold text-blue-500'>{status}</h1>
            ) : status === 'Finalizado' ? (
            <h1 className='text-xl font-semibold text-green-500'>{status}</h1>
            ) : status === 'Rechazado' ? (
            <h1 className='text-xl font-semibold text-red-500'>{status}</h1>
            ) : status === 'Cancelado' ? (
            <h1 className='text-xl font-semibold text-gray-500'>{status}</h1>
            ) : status === 'Aceptado' ? (
            <h1 className='text-xl font-semibold text-yellow-500'>{status}</h1>
            ) : (
            <h1 className='text-xl font-semibold text-orange-500'>{status}</h1>
            )}
            </div>
            <div className='px-4 sm:px-4 lg:px-8 py-2 w-full max-w-9xl mx-auto'>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>Lista de empleados</h3>
            </div>
            <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
              <div className='flex flex-col'>
                  <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2' onClick={handleConfirm}>
                    Sincronizar empleados
                  </button>
                <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                  <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
                    <div className='overflow-auto shadow border-b border-gray-200 sm:rounded-lg'>
                      <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                          <tr>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Acciones
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Estatus
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Sincronizado
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Nombres
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Apellido Paterno
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Apellido Materno
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Fecha de nacimiento
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Sexo
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              CURP
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Clave de elector
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Calle
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Número
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Colonia
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Código postal
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Municipio
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Localidad
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Estado
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Clave estado
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Codigo campo
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Foto frontal
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Foto posterior
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Foto credencial
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Foto acta
                            </th>
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                          {currentTableData && currentTableData.map((credencial, id) => (
                          <tr key={id} className= {credencial.vetado === true || credencial.status === 'Fuera' ? 'bg-red-200' : 'bg-white'}>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  {credencial.estatus === 'No sincronizado' ? (
                                  <a className='bg-red-100 hover:bg-red-500 text-red-800 hover:text-white py-1 px-2 rounded border border-red-800' onClick={() => handleEdit(credencial)}>
                                    Editar
                                  </a>
                                  ) : ( <div className='text-sm font-medium text-gray-900'></div>
                                  )}
                                </div>
                                <div className='ml-4'>
                                  {credencial.estatus === 'No sincronizado' ? (
                                  <a className='bg-red-100 hover:bg-red-500 text-red-800 hover:text-white py-1 px-2 rounded border border-red-800' onClick={() => handleDelete(credencial)}>
                                    Eliminar
                                  </a>
                                  ) : ( <div className='text-sm font-medium text-gray-900'></div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    { credencial.vetado === true ? (
                                    <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-600'>
                                      Vetado
                                    </span>
                                    ) : 
                                    credencial.status === 'Fuera' ? (
                                    <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-600'>
                                      Fuera del transporte
                                    </span>
                                    ) : (
                                    <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-600'>
                                      Activo
                                    </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  { credencial.estatus === 'No sincronizado' ? (
                                  <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-600'>
                                    {credencial.estatus}
                                  </span>
                                  ) : (
                                  <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-600'>
                                    {credencial.estatus}
                                  </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    {credencial.nombres}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    {credencial.apellido_paterno}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    {credencial.apellido_materno}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    {credencial.fecha_nacimiento}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    {credencial.sexo}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    {credencial.curp}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    {credencial.clave_elector}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    {credencial.calle}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    {credencial.numero}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    {credencial.colonia}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    {credencial.codigo_postal}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    {credencial.municipio}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    {credencial.localidad}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    {credencial.estado}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    {credencial.clave_estado}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    {credencial.cod_campo}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  { credencial.frontal !== null && credencial.frontal !== import.meta.env.VITE_APP_API_URL + '/photos/null' ?
                                  <img src={credencial.frontal} alt='Foto frontal' className='w-24 h-12' onClick={() => handleFoto(credencial.frontal)} />
                                  : <div className='text-sm font-medium text-gray-900'>No aplica</div>
                                  }
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  {credencial.posterior !== null && credencial.posterior !== import.meta.env.VITE_APP_API_URL + '/photos/null' ?
                                  <img src={credencial.posterior} alt='Foto posterior' className='w-24 h-12' onClick={() => handleFoto(credencial.posterior)} />
                                  : <div className='text-sm font-medium text-gray-900'>No aplica</div>
                                  }
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  {credencial.foto !== null && credencial.foto !== import.meta.env.VITE_APP_API_URL + '/photos/null' ?
                                  <img src={credencial.foto} alt='Foto' className='w-24 h-12' onClick={() => handleFoto(credencial.foto)} />
                                  : <div className='text-sm font-medium text-gray-900'>No aplica</div>
                                  }
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  {credencial.acta !== null && credencial.acta !== import.meta.env.VITE_APP_API_URL + '/photos/null' ?
                                  <img src={credencial.acta} alt='Acta' className='w-24 h-12' onClick={() => handleFoto(credencial.acta)} />
                                  : <div className='text-sm font-medium text-gray-900'>No aplica</div>
                                  }
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
                        totalCount={IDs.length}
                        pageSize={PageSize}
                        onPageChange={page => setCurrentPage(page)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={!modal ? 'fixed hidden inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full display-none':'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full display-block'}>
              <div className='relative top-20 px-10 sm:px-6 lg:px-8 py-8 mx-auto align-center justify-center max-w-2xl sm:max-w-2xl md:max-w-7xl'>
                <span className='absolute top-0 right-0 pt-4 pr-4'>
                  <button type='button' className='text-gray-200 hover:text-white' onClick={() => setModal(!modal)}>
                    <span className='sr-only'>Cerrar</span>
                    <svg className='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </span>
                <img src={foto} alt='Foto' className='w-screen' />
              </div>
            </div>
            <div className={!modal2 ? 'fixed hidden inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full display-none':'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full display-block'}>
              <div className='relative top-20 px-10 sm:px-6 lg:px-8 py-8 mx-auto align-center justify-center max-w-2xl sm:max-w-2xl md:max-w-7xl'>
                <div className="flex justify-center p-8 rounded-t border-b bg-gray-50">
                    <h1 className="text-2xl font-bold text-red-600">
                        Detalles de {form.nombres} {form.apellido_paterno} {form.apellido_materno}
                    </h1>
                </div>
                <div className='flex flex-row w-max-content bg-white p-2'>
                      <div className='py-4 align-middle inline-block img-container sm:px-8 lg:px-12'>
                        {form.frontal !== null || form.frontal !== import.meta.env.VITE_APP_API_URL + '/photos/null' ?
                        <img src={form.frontal} alt='Foto frontal' className='w-260 h-160' />
                        : <img src={form.acta} alt='Foto acta' className='w-260 h-160' />
                        }
                      </div>
                      <form className='py-4 align-middle inline-block sm:px-8 lg:px-12' onSubmit={e => handleUpdate(e)}>    
                            <div className='shadow overflow-hidden border-b border-gray-200'>
                                <div className='px-4 py-5 bg-white sm:p-12 md:p-8'>
                                    <div className='grid grid-rows-12 gap-6'>
                                        <div className='col-span-12 sm:col-span-2'>
                                            <label htmlFor='nombres' className='block text-sm font-medium text-gray-700'>
                                                Nombres
                                            </label>
                                            <input 
                                                type='text' 
                                                name='nombres' 
                                                className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                value={form.nombres}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </div>
                                        <div className='col-span-12 sm:col-span-2'>
                                            <label htmlFor='apellido_paterno' className='block text-sm font-medium text-gray-700'>
                                                Apellido Paterno
                                            </label>
                                            <input
                                                type='text'
                                                name='apellido_paterno'
                                                className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                value={form.apellido_paterno}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </div>
                                        <div className='col-span-12 sm:col-span-2'>
                                            <label htmlFor='apellido_materno' className='block text-sm font-medium text-gray-700'>
                                                Apellido Materno
                                            </label>
                                            <input
                                                type='text'
                                                name='apellido_materno'
                                                className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                value={form.apellido_materno}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </div>
                                        <div className='col-span-12 sm:col-span-3'>
                                            <label htmlFor='fecha_nacimiento' className='block text-sm font-medium text-gray-700'>
                                                Fecha de nacimiento
                                            </label>
                                            <input
                                                type='date'
                                                name='fecha_nacimiento'
                                                className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                value={form.fecha_nacimiento}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </div>
                                        <div className='col-span-12 sm:col-span-3'>
                                            <label htmlFor='sexo' className='block text-sm font-medium text-gray-700'>
                                                Sexo
                                            </label>
                                            <input
                                                type='text'
                                                name='sexo'
                                                length='1'
                                                className={sexoError === false ? 'mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' : 'mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'}
                                                value={form.sexo}
                                                onChange={e => sexoValidation(e)}
                                            />
                                            {sexoError === true ? <p className='text-red-500 text-sm'>Sexo no válido</p> : null}
                                        </div>
                                        <div className='col-span-12 sm:col-span-6'>
                                            <label htmlFor='curp' className='block text-sm font-medium text-gray-700'>
                                                CURP
                                            </label>
                                            <input
                                                type='text'
                                                name='curp'
                                                length='18'
                                                className={curpError === false ? 'mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' : 'mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md'}
                                                value={form.curp}
                                                onChange={e => curpValidation(e)}
                                            />
                                            {curpError === true ? <p className='text-red-500 text-sm'>CURP no válida</p> : null}
                                        </div>
                                        <div className='col-span-12 sm:col-span-6'>
                                            <label htmlFor='clave_elector' className='block text-sm font-medium text-gray-700'>
                                                Clave de elector
                                            </label>
                                            <input
                                                type='text'
                                                name='clave_elector'
                                                length='18'
                                                className={claveError === false ? 'mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' : 'mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md'}
                                                value={form.clave_elector}
                                                onChange={e => claveElectorValidation(e)}
                                            />
                                            {claveError === true ? <p className='text-red-500 text-sm'>Clave de elector no válida</p> : null}
                                        </div>
                                        <div className='col-span-12 sm:col-span-4'>
                                            <label htmlFor='calle' className='block text-sm font-medium text-gray-700'>
                                                Calle
                                            </label>
                                            <input
                                                type='text'
                                                name='calle'
                                                className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                value={form.calle}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </div>
                                        <div className='col-span-12 sm:col-span-2'>
                                            <label htmlFor='numero' className='block text-sm font-medium text-gray-700'>
                                                Numero
                                            </label>
                                            <input
                                                type='text'
                                                name='numero'
                                                length='6'
                                                className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                value={form.numero}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </div>
                                        <div className='col-span-12 sm:col-span-3'>
                                            <label htmlFor='colonia' className='block text-sm font-medium text-gray-700'>
                                                Colonia
                                            </label>
                                            <input
                                                type='text'
                                                name='colonia'
                                                className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                value={form.colonia}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </div>
                                        <div className='col-span-12 sm:col-span-3'>
                                            <label htmlFor='codigo_postal' className='block text-sm font-medium text-gray-700'>
                                                Codigo Postal
                                            </label>
                                            <input
                                                type='number'
                                                name='codigo_postal'
                                                length='5'
                                                className={cpError === false ? 'mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' : 'mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md'}
                                                value={form.codigo_postal}
                                                onChange={e => cpValidation(e)}
                                            />
                                            {cpError === true ? <p className='text-red-500 text-sm'>Codigo postal no válido</p> : null}
                                        </div>
                                        <div className='col-span-12 sm:col-span-3'>
                                            <label htmlFor='municipio' className='block text-sm font-medium text-gray-700'>
                                                Municipio
                                            </label>
                                            <input
                                                type='text'
                                                name='municipio'
                                                className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                value={form.municipio}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </div>
                                        <div className='col-span-12 sm:col-span-3'>
                                            <label htmlFor='localidad' className='block text-sm font-medium text-gray-700'>
                                                Localidad
                                            </label>
                                            <input
                                                type='text'
                                                name='localidad'
                                                className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                value={form.localidad}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </div>
                                        <div className='col-span-12 sm:col-span-3'>
                                            <label htmlFor='estado' className='block text-sm font-medium text-gray-700'>
                                                Estado
                                            </label>
                                            <input
                                                type='text'
                                                name='estado'
                                                className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                value={form.estado}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </div>
                                        <div className='col-span-12 sm:col-span-3'>
                                            <label htmlFor='clave_estado' className='block text-sm font-medium text-gray-700'>
                                                Clave estado
                                            </label>
                                            <input
                                                type='number'
                                                length='2'
                                                name='clave_estado'
                                                className='mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                value={form.clave_estado}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </div>
                                        <div className='p-2 text-center sm:justify-center'>
                                            <button type='submit' className='bg-red-100 hover:bg-red-500 text-red-800 hover:text-white py-1 px-2 rounded border border-red-800' disabled={cpError === true || curpError === true || claveError === true || sexoError === true ? true : false}>
                                                 Guardar
                                            </button>
                                        </div>
                                        <div className='p-2 text-center sm:justify-center'>
                                            <button type='button' className='bg-red-100 hover:bg-red-500 text-red-800 hover:text-white py-1 px-2 rounded border border-red-800' onClick={handleCancel}>
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
            </main>
    </AnimatedPage>
  );
}

export default DetalleViaje;