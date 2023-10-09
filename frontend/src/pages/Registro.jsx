import React, { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import API from '../utils/API';
import Toast from '../utils/Toast';
import Login from '../pages/Login';
import AnimatedPage from '../utils/AnimatedPage';

const BANKS = [
    'CITIBANAMEX',
    'BBVA',
    'SANTANDER',
    'BANCOMER',
    'BANORTE',
    'HSBC',
    'INBURSA',
    'SCOTIABANK',
    'BANBAJIO',
    'BANREGIO',
    'BANCO AZTECA',
    'BANCO FAMSA',
    'BANCO AFIRME',
    'BANCOPPEL',
    'BANCO COMPARTAMOS',
    'BANCO BASE',
    'MULTIVA',
    'SABADELL',
    'MIFEL',
    'BANSEFI',
    'BANJERCITO',
    'BANCOFON',
    'BANCO DEL BIENESTAR',
    'INVEX',
    'BANCO REGIONAL DE MONTERREY',
    'BANCREA',
    'ACTINVER',
    'BANSEFI',
    'STP',
    'OTRO'
];



function Registro() {

  const [signup, setSignup] = useState(true);
  const [emailError, setEmailError] = useState(false);

  

  const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        rfc: '',
        bank_card: '',
        bank_account: '',
        bank_clabe: '',
        terms: false,
        email: '',
        password: '',
    });

    if (!signup) {
        return <Login />;
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleEmail = (e) => {
        const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        const email = e.target.value;
        if (!regex.test(email) && email.length > 0) {
          setEmailError(true);
        } else {
          setEmailError(false);
        }
        setForm({
          ...form,
          [e.target.name]: e.target.value.toLowerCase()
        });
    }

    const handleCheck = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.checked
        });
    }

    const handleSubmit = async (e) => {
        API.post('/api/users/register/', form)
        .then(res => {
            Toast.fire({
                icon: 'success',
                title: 'Usuario registrado correctamente'
            });
            setTimeout(() => {
            window.location.href = '/';
            }
            , 1250);
        })
        .catch(err => {
            Toast.fire({
                icon: 'error',
                title: 'Error al registrar usuario'
            });
        });
        e.preventDefault();
    }



  return (
    console.log(form),
    <AnimatedPage>
        <main>
            <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
                <h1 className='text-2xl font-semibold text-gray-900'>Registro</h1>
            </div>
            <div className='px-4 sm:px-6 lg:px-8 w-full max-w-9xl mx-auto'>
              <form className='space-y-8 divide-y divide-gray-200' onSubmit={handleSubmit}>
                <div className='space-y-8 divide-y divide-gray-200 sm:space-y-5'>
                  <div>
                    <div>
                      <h3 className='text-lg leading-6 font-medium text-gray-900'>Registro de nuevo usuario</h3>
                    </div>
                    <div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
                      <div className='sm:col-span-3'>
                        <label htmlFor='first_name' className='block text-sm font-medium text-gray-700'>Nombres</label>
                        <input placeholder='Nombres' type='text' name='first_name' className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' value={form.first_name} onChange={handleChange} />
                      </div>
                      <div className='sm:col-span-3'>
                        <label htmlFor='first_name' className='block text-sm font-medium text-gray-700'>Apellidos</label>
                        <input placeholder='Apellidos' type='text' name='last_name' className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' value={form.last_name}onChange={handleChange} />
                      </div>
                      <div className='sm:col-span-3'>
                        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Correo Electrónico</label>
                        <input placeholder='Correo Electrónico' type='text' name='email' className={emailError === false ? 'mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' : 'mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-red-500 rounded-md' } value={form.email} onChange={handleEmail} />
                        {emailError === true ? <p className='mt-2 text-sm text-red-600' id='email-error'>Correo electrónico inválido</p> : null}
                      </div>
                      <div className='sm:col-span-3'>
                        <label htmlFor='first_name' className='block text-sm font-medium text-gray-700'>Teléfono</label>
                        <input placeholder='Telefono' type='text' name='phone' className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' value={form.phone} onChange={handleChange} />
                      </div>
                      <div className='sm:col-span-3'>
                        <label htmlFor='rfc' className='block text-sm font-medium text-gray-700'>RFC</label>
                        <input placeholder='RFC' type='text' name='rfc' className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' value={form.rfc} onChange={handleChange} />
                      </div>
                      <div className='sm:col-span-3'>
                        <label htmlFor='bank' className='block text-sm font-medium text-gray-700'>Banco</label>
                        <select name='bank' className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' onChange={handleChange} > 
                            <option value=''>Selecciona un banco</option>
                            {BANKS.map((bank, index) => (
                                <option key={index} value={bank}>{bank}</option> 
                            ))}
                        </select> 
                      </div>
                      <div className='sm:col-span-3'>
                        <label htmlFor='bank_card' className='block text-sm font-medium text-gray-700'>Tarjeta de Banco</label>
                        <input placeholder='Sólo para recibir depósitos o transferencias' type='text' name='bank_card' className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' value={form.bank_card} onChange={handleChange} />
                      </div>
                      <div className='sm:col-span-3'>
                        <label htmlFor='bank_account' className='block text-sm font-medium text-gray-700'>Cuenta Bancaria</label>
                        <input placeholder='Sólo para recibir depósitos o transferencias' type='text' name='bank_account' className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' value={form.bank_account} onChange={handleChange} />
                      </div>
                      <div className='sm:col-span-3'>
                        <label htmlFor='bank_clabe' className='block text-sm font-medium text-gray-700'>CLABE interbancaria</label>
                        <input placeholder='18 Dígitos de la Clabe interbancaria' type='text' name='bank_clabe' className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' value={form.bank_clabe} onChange={handleChange} />
                      </div>
                      <div className='sm:col-span-3'>
                        <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</label>
                        <input placeholder='Ingrese su contraseña' type='password' name='password' className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' value={form.password} onChange={handleChange} />
                      </div>
                      <div className='sm:col-span-2'>
                        <label htmlFor='terms' className='block text-sm font-medium text-gray-700'>Terminos y Condiciones</label>
                        <input type='checkbox' name='terms' className='mt-1 focus:ring-green-500 focus:border-green-500 block shadow-sm sm:text-sm border-gray-300 rounded-md' value={form.terms} onChange={handleCheck} />
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
            <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
                <div className='flex justify-center'>
                    <Link onClick={() => setSignup(false)} className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
                      ¿Ya tienes una cuenta? Inicia Sesión
                    </Link>
                </div>
            </div>
          </main>
    </AnimatedPage>
  );
}

export default Registro;
