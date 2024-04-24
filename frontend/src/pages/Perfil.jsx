import React, { useState, useEffect, useMemo } from 'react';
import AnimatedPage from '../utils/AnimatedPage';
import copy from "copy-to-clipboard";
import Swal from 'sweetalert2';
import Toast from '../utils/Toast';
import API from '../utils/API';


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
  'BANSEFI',
  'BANJERCITO',
  'BANCO DEL BIENESTAR',
  'INVEX',
  'BANCO REGIONAL DE MONTERREY',
  'BANCREA',
  'ACTINVER',
  'BANSEFI',
  'STP',
  'OTRO'
];

function Perfil() {

  const [restart, setRestart] = useState(false);
  const [perfil, setPerfil] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    bank: '',
    bank_account: '',
    bank_card: '',
    bank_clabe: '',
    profile_img: '',
    codigo: ''
  });

  const [emailError, setEmailError] = useState(false);
  const [clabeError, setclabeError] = useState(false);
  const [TarjetaError, setTarjetaError] = useState(false);
  const [BankAccountError, setBankAccountError] = useState(false);
  const [modal, setModal] = useState(false);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passEye, setPassEye] = useState(false);
  const [passEye2, setPassEye2] = useState(false);


useEffect(() => {
  API.get(`/api/users/get/${localStorage.getItem('id')}/`).then(res => {
    setPerfil(res.data);
  }).catch(err => {
    console.log(err);
  });
}, [restart]);


const copyClipboard = () => {
  copy(`Hola! Te invito a que te unas a la comunidad ABANTU. Utiliza mi código personal: ${perfil.codigo}. Regístrate en abantu.mx.`);
  Toast.fire({
    title: 'Listo',
    text: 'Se ha copiado el codigo de invitacion',
    icon: 'success',

  })
}


const handleSubmit = () => {
  Swal.fire({
    title: '¿Estas seguro?',
    text: "Estas a punto de actualizar tu perfil, ¿estas seguro de querer continuar?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#03E19B',
    cancelButtonColor: '#9c9c9c',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Si, actualizar',
  }).then((result) => {
    if (result.isConfirmed) {
      API.put(`/api/users/update/${localStorage.getItem('id')}/`, perfil).then(res => {
        Swal.fire({
          title: '¡Listo!',
          text: 'Tu perfil ha sido actualizado.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        });
        console.log(res.data.message);
        setRestart(!restart);
      }
      ).catch(err => {
        console.log(err);
        Swal.fire({
          title: '¡Error!',
          text: 'Ha ocurrido un error, intenta de nuevo.',
          icon: 'error',
          showConfirmButton: false,
          timer: 1000
        });
      });
    }
  });
};


const handleChange = (e) => {
  setPerfil({
    ...perfil,
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
  setPerfil({
    ...perfil,
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

  setPerfil({
    ...perfil,
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

  setPerfil({
    ...perfil,
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

  setPerfil({
    ...perfil,
    [e.target.name]: e.target.value
  });
}

const handleCancel = () => {
  setModal(false);
}

const handlePassword = (e) => { 
  if (e.target.name === 'password2') {
    if (e.target.value !== password) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  setPassword2(e.target.value);
  } else {
    if (e.target.value !== password2) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  setPassword(e.target.value);
  }
}


const handleSubmitPassword = () => {
  Swal.fire({
    title: '¿Estas seguro?',
    text: "Estas a punto de cambiar tu contraseña, ¿estas seguro de querer continuar?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#03E19B',
    cancelButtonColor: '#9c9c9c',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Si, cambiar',
  }).then((result) => {
    if (result.isConfirmed) {
      API.put(`/api/users/update-password/${localStorage.getItem('id')}/`, { password: password }).then(res => {
        Swal.fire({
          title: '¡Listo!',
          text: 'Tu contraseña ha sido actualizada.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        });
        setModal(false);
      }
      ).catch(err => {
        console.log(err);
        Swal.fire({
          title: '¡Error!',
          text: 'Ha ocurrido un error, intenta de nuevo.',
          icon: 'error',
          showConfirmButton: false,
          timer: 1000
        });
      });
    }
  });

}


  return (
    <AnimatedPage>
        <main className="bg-gray-100 py-8 flex justify-center items-center">
          <section className="container mx-auto">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-gray-800 text-xl font-extrabold sm:text-2xl">Mi Perfil</h2>
              <p className="text-gray-800 mt-2">Aquí puedes consultar y actualizar la información de tu perfil.</p>
            </div>
            <div className="mx-auto px-4 md:px-8 space-y-6 sm:max-w-mdspace-y-6 text-white sm:max-w-md bg-[#029d85] shadow sm:rounded-lg p-6">
              <div className="text-center py-4">
                <img src={perfil?.profile_img ? perfil?.profile_img : "https://ui-avatars.com/api/?name=" + perfil?.first_name.charAt(0) + "&background=random"} alt="profile" className="w-24 h-24 mx-auto rounded-full" />
                <div className="mt-5 space-y-2">
                  <h3 className="text-white text-2xl font-bold sm:text-3xl">{perfil?.first_name + " " + perfil?.last_name}</h3>
                </div>
                <div className="mt-2 space-y-2">
                  <p className="text-white text-md font-bold">Código de invitación:</p>
                  <p className="text-white text-md font-semibold">{perfil.codigo}</p>
                </div>
                <div className="mt-2 space-y-2">
                  <button
                    className="px-4 py-2 text-black font-medium bg-[#c0fff5] hover:bg-[#03E19B] active:bg-[#03E19B] rounded-lg duration-150"
                    onClick={copyClipboard}
                  >
                    Copiar Código
                  </button>
                </div>
              </div>
              <div>
                <label className="font-bold">
                  Nombre
                </label>
                <input
                  type="text"
                  className="w-full mt-2 px-3 py-2 text-black bg-white outline-none shadow-sm rounded-lg"
                  value={perfil.first_name}
                  onChange={handleChange}
                  name="first_name"
                />
              </div>
              <div>
                <label className="font-bold">
                  Apellido
                </label>
                <input
                  type="text"
                  className="w-full mt-2 px-3 py-2 text-black bg-white outline-none shadow-sm rounded-lg"
                  value={perfil.last_name}
                  name="last_name"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="font-bold">
                  Teléfono
                </label>
                <input
                  type="text"
                  className="w-full mt-2 px-3 py-2 text-black bg-white outline-none shadow-sm rounded-lg"
                  value={perfil.phone}
                  name="phone"
                  onChange={handleChange}
                  maxLength="10"
                />
              </div>
              <div>
                <label className="font-bold">
                  Correo Electrónico
                </label>
                <input
                  type="text"
                  className={!emailError ? "w-full mt-2 px-3 py-2 text-black bg-white outline-none shadow-sm rounded-lg" : "w-full mt-2 px-3 py-2 text-red-600 bg-white outline-none shadow-sm rounded-lg"}
                  value={perfil.email}
                  name="email"
                  onChange={handleEmail}
                />
                {emailError === true ? <p className='mt-2 text-sm text-red-600' id='email-error'>Correo electrónico inválido</p> : null}
              </div>
              <div>
                <label className="font-bold">
                  Banco
                </label>
                <select
                  className="w-full mt-2 px-3 py-2 text-black bg-white outline-none shadow-sm rounded-lg"
                  value={perfil.bank}
                  name="bank"
                  onChange={handleChange}
                >
                  <option value="">Selecciona un banco</option>
                  {BANKS.map((bank, idx) => (
                    <option key={idx} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold">
                  Número de Cuenta
                </label>
                <input
                  type="text"
                  className={!BankAccountError ? "w-full mt-2 px-3 py-2 text-black bg-white outline-none shadow-sm rounded-lg" : "w-full mt-2 px-3 py-2 text-red-600 bg-white outline-none shadow-sm rounded-lg"}
                  value={perfil.bank_account}
                  name="bank_account"
                  onChange={handleBankAccount}
                />
                {BankAccountError === true ? <p className='mt-2 text-sm text-red-600' id='email-error'>Numero de cuenta inválido</p> : null}
              </div>
              <div>
                <label className="font-bold">
                  Número de Tarjeta
                </label>
                <input
                  type="text"
                  className={!TarjetaError ? "w-full mt-2 px-3 py-2 text-black bg-white outline-none shadow-sm rounded-lg" : "w-full mt-2 px-3 py-2 text-red-600 bg-white outline-none shadow-sm rounded-lg"}
                  value={perfil.bank_card}
                  name="bank_card"
                  onChange={handleTarjeta}
                />
                {TarjetaError === true ? <p className='mt-2 text-sm text-red-600' id='email-error'>Numero de tarjeta inválido</p> : null}
              </div>
              <div>
                <label className="font-bold">
                  CLABE
                </label>
                <input
                  type="text"
                  className={!clabeError ? "w-full mt-2 px-3 py-2 text-black bg-white outline-none shadow-sm rounded-lg" : "w-full mt-2 px-3 py-2 text-red-600 bg-white outline-none shadow-sm rounded-lg"}
                  value={perfil.bank_clabe}
                  name="bank_clabe"
                  onChange={handleCLABE}
                />
                {clabeError === true ? <p className='mt-2 text-sm text-red-600' id='email-error'>CLABE inválida</p> : null}
              </div>
              <button
                className="w-full px-4 py-2 text-black font-medium bg-[#c0fff5] hover:bg-[#03E19B] active:bg-[#03E19B] rounded-lg duration-150"
                onClick={handleSubmit}
              >
                Guardar Cambios
              </button>
              <button
                className="w-full px-4 py-2 text-white font-medium bg-gray-600 hover:bg-gray-500 active:bg-white rounded-lg duration-150"
                onClick={() => setModal(true)}
              >
                Cambiar Contraseña
              </button>
            </div>
          </section>
          <div className={ modal ? "fixed inset-0 bg-white bg-opacity-50 overflow-y-auto h-full w-full display-block" : "hidden"}>
            <div className="relative py-4 text-left px-6 bg-white rounded-lg shadow-xl w-11/12 md:w-1/2 mx-auto align-center justify-center my-24">

              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold">Cambiar Contraseña</p>
                <div className="modal-close cursor-pointer z-50" onClick={handleCancel}>
                  <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                    <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                  </svg>
                </div>
              </div>
              <label className="font-bold">
                Contraseña Nueva
              </label>
              <div className="mb-5 flex flex-row items-center justify-between relative">
                <div>
                  {passEye ? <span className="fa-solid fa-eye-slash flex items-center cursor-pointer absolute right-2" onClick={() => setPassEye(!passEye)}></span> : <span className="fa-solid fa-eye flex items-center cursor-pointer absolute right-2" onClick={() => setPassEye(!passEye)}></span>}
                </div>
                <input
                  name="password"
                  type={passEye ? "text" : "password"}
                  className={!passwordError ? "w-full mt-2 px-3 py-2 text-gray-800 bg-white outline-none shadow-sm rounded-lg" : "w-full mt-2 px-3 py-2 text-gray-800 bg-white outline-none shadow-sm rounded-lg border-red-600"}
                  value={password}
                  onChange={(e) => handlePassword(e)}
                />
              </div>
              <label className="font-bold">
                Confirmar Contraseña
              </label>
              <div className="mb-5 flex flex-row items-center justify-between relative">
                <div>
                  {passEye2 ? <span className="fa-solid fa-eye-slash flex items-center cursor-pointer absolute right-2" onClick={() => setPassEye2(!passEye2)}></span> : <span className="fa-solid fa-eye flex items-center cursor-pointer absolute right-2" onClick={() => setPassEye2(!passEye2)}></span>}
                </div>
                <input
                  name="password2"
                  type={passEye2 ? "text" : "password"}
                  className={!passwordError ? "w-full mt-2 px-3 py-2 text-gray-800 bg-white outline-none shadow-sm rounded-lg" : "w-full mt-2 px-3 py-2 text-gray-800 bg-white outline-none shadow-sm rounded-lg border-red-600"}
                  value={password2}
                  onChange={(e) => handlePassword(e)}
                />
              </div>
              {passwordError === true ? <p className='mt-2 text-sm text-red-600' id='email-error'>Las contraseñas no coinciden</p> : null}
              <div className="flex justify-end pt-2">
                <button className="px-4 bg-white p-3 rounded-lg text-green-500 hover:bg-gray-100 hover:text-green-400 mr-2" onClick={handleSubmitPassword}>Cambiar Contraseña</button>
                <button className="modal-close px-4 bg-green-500 p-3 rounded-lg text-white hover:bg-green-400" onClick={handleCancel}>Cancelar</button>
              </div>
            </div>
          </div>
      </main>
    </AnimatedPage>
  );
}

export default Perfil;