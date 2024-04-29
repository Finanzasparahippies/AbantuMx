import React, { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import API from '../utils/API';
import Toast from '../utils/Toast';
import Login from '../pages/Login';
import Images from '../images/images';
import AnimatedPage from '../utils/AnimatedPage';

const BANKS = [
    'CITIBANAMEX',
    'BBVA',
    'SANTANDER',
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
  const [clabeError, setclabeError] = useState(false);
  const [tarjetaError, setTarjetaError] = useState(false);
  const [bankAccountError, setBankAccountError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [foto, setFoto] = useState('');
  const [viewPass, setViewPass] = useState(false);
  const [viewPass2, setViewPass2] = useState(false);

  const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        bank_card: '',
        bank_account: '',
        bank_clabe: '',
        terms: false,
        email: '',
        password: '',
        password2: '',
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

    const handleCLABE = (e) => {
        const regexCLABE = /^\d{18}$/;
        const bank_clabe = e.target.value;
        if (!regexCLABE.test(bank_clabe)) {
          setclabeError(true);
        } else {
          setclabeError(false);
        };

        setForm({
          ...form,
          [e.target.name]: e.target.value
        });
    }

    const handleTarjeta = (e) => {
        const regexTarjeta = /^\d{16}$/;
        const bank_card = e.target.value;
        if (!regexTarjeta.test(bank_card)) {
          setTarjetaError(true);
        } else {
          setTarjetaError(false);
        };

        setForm({
          ...form,
          [e.target.name]: e.target.value
        });
    }

    const handleBankAccount = (e) => {
        const regexBankAccount = /^\d{10}$/;
        const bank_account = e.target.value;
        if (!regexBankAccount.test(bank_account)) {
          setBankAccountError(true);
        } else {
          setBankAccountError(false);
        };

        setForm({
          ...form,
          [e.target.name]: e.target.value
        });
    }

    const handleCheck = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.checked
        });
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (emailError === true || clabeError === true || tarjetaError === true || bankAccountError === true) {

        Swal.fire({
          title: 'Error',
          text: 'Por favor, revisa los campos marcados en rojo',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      } else {
        await API.post('/api/users/register/', {
            first_name: form.first_name,
            last_name: form.last_name,
            phone: form.phone,
            bank: form.bank,
            bank_card: form.bank_card,
            bank_account: form.bank_account,
            bank_clabe: form.bank_clabe,
            email: form.email,
            password: form.password,
            terms: form.terms
          },
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(res => {
              Toast.fire({
                  icon: 'success',
                  title: 'Usuario registrado correctamente'
              });
              setTimeout(() => {
                window.location.href = '/login'; 
              }
              , 1250);
          })
          .catch(err => {
            console.log(err);
            if (err.response.status === 400) {
              Toast.fire({
                  icon: 'error',
                  title: 'Error al registrar usuario',
                  text: err.response.data.message
              });
            } else {
              Toast.fire({
                  icon: 'error',
                  title: 'Error al registrar usuario',
                  text: 'Error del servidor'
              });
            }
          });
    }
  }

  const handlePassword = (e) => {
    if (e.target.value !== form.password) {
      setForm({
        ...form,
        [e.target.name]: e.target.value
      });
      setPassError(true);
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value
      });
      setPassError(false);
    }
  }

  return (
    console.log(form),
    console.log(foto),
    <AnimatedPage>
        <main>
            <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
                
            </div>
            <div className='px-4 sm:px-6 lg:px-8 w-full max-w-9xl mx-auto bg-[#03E19B] rounded-3xl shadow p-8'>
            <div className='flex justify-center items-center flex-col mb-8'>
              <img src={Images.logo} alt='logo' className='w-[300px] mx-auto mb-4' />
              <h1 className='text-3xl font-semibold text-white'>Registro de Nuevo Usuario</h1>
            </div>
              <form className='space-y-8 divide-y divide-gray-200' onSubmit={handleSubmit}>
                <div className='space-y-8 divide-y divide-gray-200 sm:space-y-5'>
                  <div>
                    <div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
                      <div className='sm:col-span-3'>
                        <label htmlFor='first_name' className='block text-sm font-medium text-white'>{'Nombre(s)'}</label>
                        <input placeholder='Nombre(s)' type='text' name='first_name' className='text-[#029d85] mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white' value={form.first_name} onChange={handleChange} />
                      </div>
                      <div className='sm:col-span-3'>
                        <label htmlFor='last_name' className='block text-sm font-medium text-white'>{'Apellidos'}</label>
                        <input placeholder='Apellidos' type='text' name='last_name' className='text-[#029d85] mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white' value={form.last_name}onChange={handleChange} />
                      </div>
                      <div className='sm:col-span-3'>
                        <label htmlFor='email' className='block text-sm font-medium text-white'>Correo Electrónico</label>
                        <input placeholder='Correo Electrónico' type='text' name='email' className={emailError === false ? 'text-[#029d85] mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white' : 'text-[#029d85] mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-red-500 rounded-md' } value={form.email} onChange={handleEmail} />
                        {emailError === true ? <p className='mt-2 text-sm text-red-600' id='email-error'>Correo electrónico inválido</p> : null}
                      </div>
                      <div className='sm:col-span-3'>
                        <label htmlFor='phone' className='block text-sm font-medium text-white'>Teléfono</label>
                        <input placeholder='Teléfono a 10 dígitos' type='text' name='phone' className='text-[#029d85] mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white' value={form.phone} onChange={handleChange} maxLength='10' />
                      </div>
                      <div className='sm:col-span-3'>
                        <label htmlFor='bank' className='block text-sm font-medium text-white'>Banco</label>
                        <select name='bank' className='text-[#029d85] mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white' onChange={handleChange} > 
                            <option value=''>Selecciona un banco</option>
                            {BANKS.map((bank, index) => (
                                <option key={index} value={bank}>{bank}</option> 
                            ))}
                        </select> 
                      </div>
                      <div className='sm:col-span-3'>
                        <label htmlFor='bank_card' className='block text-sm font-medium text-white'>Tarjeta de Banco</label>
                        <input placeholder='Sólo para recibir depósitos o transferencias' type='text' name='bank_card' className={tarjetaError === false ? 'text-[#029d85] mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white' : 'text-[#029d85] mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-red-500 rounded-md' } value={form.bank_card} onChange={handleTarjeta} maxLength='16' />
                        {tarjetaError === true ? <p className='mt-2 text-sm text-white bg-red-500 w-1/6 p-2' id='tarjetaError'>Tarjeta inválida</p> : null}
                      </div>
                      <div className='sm:col-span-3'>
                        <label htmlFor='bank_account' className='block text-sm font-medium text-white'>Cuenta Bancaria</label>
                        <input placeholder='Sólo para recibir depósitos o transferencias' type='text' name='bank_account' className={bankAccountError === false ? 'text-[#029d85] mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white' : 'text-[#029d85] mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-red-500 rounded-md' } value={form.bank_account} onChange={handleBankAccount} maxLength='10' />
                        {bankAccountError === true ? <p className='mt-2 text-sm text-white bg-red-500 w-1/6 p-2' id='cuentaError'>Cuenta inválida</p> : null}
                      </div>
                      <div className='sm:col-span-3'>
                        <label htmlFor='bank_clabe' className='block text-sm font-medium text-white'>CLABE Interbancaria</label>
                        <input placeholder='Sólo para recibir depósitos o transferencias' type='text' name='bank_clabe' className={clabeError === false ? 'text-[#029d85] mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white' : 'text-[#029d85] mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-red-500 rounded-md' } value={form.bank_clabe} onChange={handleCLABE} maxLength='18' />
                        {clabeError === true ? <p className='mt-2 text-sm text-white bg-red-500 w-1/6 p-2' id='clabeError'>CLABE inválida</p> : null}
                      </div>
                      <div className='sm:col-span-3 flex flex-row items-center justify-between relative'>
                        <label htmlFor='password' className='block text-sm font-medium text-white mr-2'>Contraseña</label>
                        <span onClick={() => setViewPass(!viewPass)} className={viewPass ? 'fas fa-eye-slash flex items-center cursor-pointer absolute right-2 text-[#029d85]' : 'fas fa-eye flex items-center cursor-pointer absolute right-2 text-[#029d85]'}></span>
                        <input placeholder='Ingresa tu contraseña' type={viewPass ? 'text':'password'} name='password' className={passError === false ? 'mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white' : 'mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-red-500 rounded-md' } value={form.password} onChange={handleChange} />
                      </div>
                      <div className='sm:col-span-3 flex flex-row items-center justify-between relative'>
                        <label htmlFor='password2' className='block text-sm font-medium text-white'>Confirmar Contraseña</label>
                        <span onClick={() => setViewPass2(!viewPass2)} className={viewPass2 ? 'fas fa-eye-slash flex items-center cursor-pointer absolute right-2 text-[#029d85]' : 'fas fa-eye flex items-center cursor-pointer absolute right-2 text-[#029d85]'}></span>
                        <input placeholder='Confirma tu contraseña' type={viewPass2 ? 'text':'password'} name='password2' className={passError === false ? 'mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white' : 'mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-red-500 rounded-md' } value={form.password2} onChange={handlePassword} />
                      </div>
                      <div className='sm:col-span-2'>
                        <label htmlFor='terms' className='block text-sm font-medium text-white'>He leído y acepto los Términos y Condiciones y Aviso de Privacidad.</label>
                        <input type='checkbox' name='terms' className='mt-1 focus:ring-green-500 focus:border-green-500 block shadow-sm sm:text-sm border-gray-300 rounded-md' value={form.terms} onChange={handleCheck} />
                      </div>
                    </div>
                  </div>
                </div>          
                <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
                  <div className='flex justify-center'>
                    <button 
                      type='submit' 
                      className={form.terms ? 'inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:text-black bg-[#029d85] hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white' : 'inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md hover:text-black text-white bg-[#029d85] hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white opacity-50 cursor-not-allowed'} 
                      disabled={!form.terms}
                    >
                      Registrar Usuario
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
                <div className='flex justify-center'>
                    <Link onClick={() => setSignup(false)} className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-[#029d85] bg-[#03E19B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#029d85]'>
                      ¿Ya tienes una cuenta? Inicia Sesión
                    </Link>
                </div>
            </div>
          </main>
    </AnimatedPage>
  );
}

export default Registro;
