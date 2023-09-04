import React, { useState, useEffect, useMemo } from 'react';
import Pagination from '../utils/Pagination';
import AnimatedPage from '../utils/AnimatedPage';
import Swal from 'sweetalert2';
import API from '../utils/API';

function CreateUser() {

  const Roles = [
    { name: 'Administrador', value: 'Administrador' },
    { name: 'Médico', value: 'Médico' },
    { name: 'Paciente', value: 'Paciente' }
  ];

  let PageSize = 10;
  const [users, setUsers] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState(false);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return users.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, users]);

  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    id_empleado: '',
    rol: '',
    password: '',
    email: '',
  });

  const [editForm, setEditForm] = useState({});

  const [foto, setFoto] = useState('');

  const [foto2, setFoto2] = useState('');

  useEffect(() => {
    const getUsers = async () => {
      const res = await API.get(`/users/list`);
      setUsers(res.data);
    }
    const getAlmacenes = async () => {
      const res = await API.get(`/inventario/almacenes/lista`);
      setAlmacenes(res.data);
    }
    getUsers();
    getAlmacenes();
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
      loading: true,
      title: 'Creando usuario...',
      showConfirmButton: false,
      timer: 3000
    });
    
    API.post(`/users/create/`, { 'foto': foto, 'nombres': form.nombres, 'apellidos': form.apellidos, 'id_empleado': form.id_empleado, 'rol': form.rol, 'email': form.email, 'password': form.password },
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        console.log(res);
        setTimeout(() => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario creado correctamente',
            showConfirmButton: false,
            timer: 3000
          });
          setForm({
            nombres: '',
            apellidos: '',
            id_empleado: '',
            rol: '',
            password: '',
            email: '',
          });
          setFoto('');
          API.get(`/users/list`)
            .then(res => {
              setUsers(res.data);
            }
            )
            .catch(err => {
              console.log(err);
            }
            )
        }, 3000);
      })
      .catch(err => {
        console.log(err);
        if (err.response.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Usuario ya existe',
            showConfirmButton: false,
            timer: 2000
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al crear usuario',
            showConfirmButton: false,
            timer: 2000
          });
        }
      })
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Estás seguro de eliminar este usuario?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        API.delete(`/users/delete/${id}/`)
          .then(res => {
            console.log(res);
            const newUsers = users.filter(user => user.id !== id);
            setUsers(newUsers);
          })
          .catch(err => {
            console.log(err);
          })
        Swal.fire(
          '¡Eliminado!',
          'El usuario ha sido eliminado.',
          'success'
        )
      }
    })
  };

  const handleInputChng = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    Swal.fire({
      loading: true,
      title: 'Actualizando usuario...',
      showConfirmButton: false,
      timer: 3000
    });
    API.put(`/users/update/${editForm.id}/`, { 'foto': foto2, 'nombres': editForm.nombres, 'apellidos': editForm.apellidos, 'id_empleado': editForm.id_empleado, 'rol': editForm.rol, 'email': editForm.email, 'password': editForm.password, 'almacen': editForm.almacen },
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        setModal(!modal);
        setEditForm({});
        setFoto2('');
        console.log(res);
        setTimeout(() => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario actualizado correctamente',
            showConfirmButton: false,
            timer: 3000
          });
          setModal(!modal);
          API.get(`/users/list`)
            .then(res => {
              setUsers(res.data);
            })
            .catch(err => {
              console.log(err);
            })
        }, 3000);
      })
      .catch(err => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar usuario',
          showConfirmButton: false,
          timer: 2000
        });
      }
    )
  };

  const handleCancel = () => {
    setModal(!modal);
    setEditForm({});
    setFoto2('');
  };

  const handleEdit = (id) => {
    const user = users.find(user => user.id === id);
    setEditForm({
      id: user.id,
      nombres: user.nombres,
      apellidos: user.apellidos,
      id_empleado: user.id_empleado,
      foto: user.foto,
      rol: user.rol,
      email: user.email,
      password: null,
      almacen: user.almacen,
    });
    setModal(!modal);
  };

  const editFoto = (e) => {
    setFoto2(e.target.files[0]);
    setEditForm({
      ...editForm,
      foto: URL.createObjectURL(e.target.files[0])
    });
  };

  return (
    console.log(form),
    console.log(editForm),
    console.log(foto),
    <AnimatedPage>
        <main>
            <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
            <h1 className='text-2xl font-semibold text-gray-900'>Usuarios</h1>
            </div>
            { localStorage.getItem('rol') === 'Administrador' ? (
            <div className='px-4 sm:px-6 lg:px-8 w-full max-w-9xl mx-auto'>
              <form className='space-y-8 divide-y divide-gray-200' onSubmit={handleSubmit}>
                <div className='space-y-8 divide-y divide-gray-200 sm:space-y-5'>
                  <div>
                    <div>
                      <h3 className='text-lg leading-6 font-medium text-gray-900'>Nuevo Usuario</h3>
                    </div>
                    <div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
                      <div className='sm:col-span-3'>
                        <label htmlFor='nombres' className='block text-sm font-medium text-gray-700'>Nombre(s) *</label>
                        <input placeholder='Nombre(s)' type='text' name='nombres' className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' onChange={handleInputChange} value={form.nombres} />
                      </div>
                      <div className='sm:col-span-3'>
                        <label htmlFor='apellidos' className='block text-sm font-medium text-gray-700'>Apellido(s) *</label>
                        <input placeholder='Apellido(s)' type='text' name='apellidos' className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' onChange={handleInputChange} value={form.apellidos} />
                      </div>
                      <div className='sm:col-span-2'>
                        <label htmlFor='id_empleado' className='block text-sm font-medium text-gray-700'>Nombre de usuario *</label>
                        <input placeholder='Nombre de usuario' type='text' name='id_empleado' className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' onChange={handleInputChange} value={form.id_empleado} />
                      </div>
                      <div className='sm:col-span-2'>
                        <label htmlFor='rol' className='block text-sm font-medium text-gray-700'>Rol *</label>
                        <select name='rol' className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' onChange={handleInputChange} value={form.rol}>
                          <option value=''>Selecciona un rol</option>
                          {Roles.map((rol) => (
                            <option key={rol.value} value={rol.value}>
                              {rol.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='sm:col-span-2'>
                        <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Contraseña *</label>
                        <input placeholder='Contraseña' type='password' name='password' className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' onChange={handleInputChange} value={form.password} />
                      </div>
                      <div className='sm:col-span-2'>
                        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
                        <input placeholder='Email' type='email' name='email' className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' onChange={handleInputChange} value={form.email} />
                      </div>
                      <div className='sm:col-span-2'>
                        <label htmlFor='almacen' className='block text-sm font-medium text-gray-700'>Almacen</label>
                        <select name='almacen' className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' onChange={handleInputChange} value={form.almacen}>
                          <option value=''>Selecciona un almacen</option>
                          {almacenes.map((almacen) => (
                            <option key={almacen.id} value={almacen.id}>
                              {almacen.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='sm:col-span-2'>
                        <label htmlFor='foto' className='block text-sm font-medium text-gray-700'>Foto</label>
                        <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files[0]) } />
                      </div>
                    </div>
                  </div>
                </div>          
                <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
                  <div className='flex justify-center'>
                    <button type='submit' className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'>
                      Guardar
                    </button>
                  </div>
                </div>
              </form>
            </div>
            ) : (
              <div></div>
            )}
            <div className='px-4 sm:px-4 lg:px-8 py-2 w-full max-w-9xl mx-auto'>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>Lista de Usuarios</h3>
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
                              Foto
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Nombre
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Apellido
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Usuario
                              </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Rol
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Almacen
                            </th>
                            <th scope='col' className='px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                          {currentTableData && currentTableData.map(user => (
                          <tr key={user.id}>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='flex-shrink-0 h-10 w-10'>
                                  <img className='h-10 w-10 rounded-full' src={user.foto ? user.foto : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt='' />
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900'>
                                    {user.nombres}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='text-sm text-gray-900'>{user.apellidos}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
                                {user.id_empleado}
                              </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                              {user.rol}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                              {user.almacen}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                             {localStorage.getItem('rol') === 'Administrador' ? (
                              <div className='flex justify-center'>
                              <a href='#' className='bg-gray-100 hover:bg-gray-500 text-gray-800 hover:text-white py-1 px-2 rounded border border-gray-800' onClick={() => handleEdit(user.id)}>Editar</a>
                              <a href='#' className='bg-green-100 hover:bg-green-500 text-green-800 hover:text-white py-1 px-2 rounded ml-2 border border-green-800' onClick={() => handleDelete(user.id)}>Eliminar</a>
                              </div>
                            ) : (
                              null
                            )}
                            </td>
                          </tr>
                          ))}
                        </tbody>
                      </table>
                      <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={users.length}
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
                <div className="flex justify-center p-8 rounded-t border-b bg-gray-50">
                    <h1 className="text-2xl font-bold text-green-600">
                        Editar usuario {editForm.nombres} {editForm.apellidos}
                    </h1>
                </div>
                <div className='flex flex-col w-max-content bg-white p-2'>
                  <div className='py-4 align-middle inline-block sm:px-12 lg:px-12'>
                    <div className='flex justify-center'>
                      { editForm.foto === null ? (
                        <img className='h-30 w-30 rounded-full' src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' alt='' />
                      ) : (
                        <img className='h-20 w-20 rounded-full' src={editForm.foto} alt='' />
                      )}
                    </div>
                  </div>
                      <form className='py-4 align-middle inline-block sm:px-8 lg:px-12' onSubmit={e => handleUpdate(e)}>    
                            <div className='shadow overflow-hidden border-b border-gray-200'>
                                <div className='px-4 py-5 bg-white sm:p-12 md:p-8'>
                                    <div className='grid grid-rows-12 gap-6'>
                                        <div className='col-span-12 sm:col-span-6'>
                                            <label htmlFor='nombres' className='block text-sm font-medium text-gray-700'>
                                                Nombres
                                            </label>
                                            <input 
                                                type='text' 
                                                name='nombres' 
                                                className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                onChange={e => handleInputChng(e)}
                                                value={editForm.nombres}
                                            />
                                        </div>
                                        <div className='col-span-12 sm:col-span-3'>
                                            <label htmlFor='apellidos' className='block text-sm font-medium text-gray-700'>
                                                Apellidos
                                            </label>
                                            <input
                                                type='text'
                                                name='apellidos'
                                                className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                onChange={e => handleInputChng(e)}
                                                value={editForm.apellidos}
                                            />
                                        </div>
                                        <div className='col-span-12 sm:col-span-3'>
                                            <label htmlFor='id_empleado' className='block text-sm font-medium text-gray-700'>
                                                Nombre de Usuario
                                            </label>
                                            <input
                                                type='text'
                                                name='id_empleado'
                                                className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                onChange={e => handleInputChng(e)}
                                                value={editForm.id_empleado}
                                            />
                                        </div>
                                        <div className='col-span-12 sm:col-span-2'>
                                            <label htmlFor='rol' className='block text-sm font-medium text-gray-700'>
                                                Rol
                                            </label>
                                            <select 
                                                name='rol'
                                                className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                onChange={e => handleInputChng(e)}
                                                value={editForm.rol} >
                                                <option value=''>Seleccione un rol</option>
                                                {Roles.map((rol, index) => (
                                                    rol.name === editForm.rol ?
                                                    <option key={index} value={rol.value} selected>{rol.name}</option>
                                                    : <option key={index} value={rol.value}>{rol.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='col-span-12 sm:col-span-2'>
                                            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                                                Email
                                            </label>
                                            <input
                                                type='email'
                                                name='email'
                                                className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                onChange={e => handleInputChng(e)}
                                                value={editForm.email}
                                            />
                                        </div>
                                        <div className='col-span-12 sm:col-span-2'>
                                            <label htmlFor='almacen' className='block text-sm font-medium text-gray-700'>
                                                Almacen
                                            </label>
                                            <select
                                                name='almacen'
                                                className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                onChange={e => handleInputChng(e)}
                                                value={editForm.almacen}
                                            >
                                                <option value=''>Seleccione un almacen</option>
                                                {almacenes.map((almacen, index) => (
                                                    almacen.nombre === editForm.almacen ?
                                                    <option key={index} value={almacen.nombre} selected>{almacen.nombre}</option>
                                                    : <option key={index} value={almacen.nombre}>{almacen.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='col-span-12 sm:col-span-2'>
                                            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                                                Contraseña
                                            </label>
                                            <input
                                                type='password'
                                                name='password'
                                                className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                onChange={e => handleInputChng(e)}
                                                value={editForm.password}
                                            />
                                        </div>
                                        <div className='col-span-12 sm:col-span-2'>
                                            <label htmlFor='foto2' className='block text-sm font-medium text-gray-700'>
                                                Foto
                                            </label>
                                            <input 
                                              type="file" 
                                              accept="image/*" 
                                              onChange={editFoto}
                                              value={editForm.foto2}
                                            />
                                        </div>
                                        <div className='p-2 text-center sm:justify-center'>
                                            <button type='submit' className='bg-blue-100 hover:bg-blue-500 text-blue-800 hover:text-white py-1 px-2 rounded border border-blue-800'>
                                                 Guardar
                                            </button>
                                        </div>
                                        <div className='p-2 text-center sm:justify-center'>
                                            <button type='button' className='bg-green-100 hover:bg-green-500 text-green-800 hover:text-white py-1 px-2 rounded border border-green-800' onClick={handleCancel}>
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

export default CreateUser;