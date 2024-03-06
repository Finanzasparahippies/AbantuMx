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


useEffect(() => {
  API.get(`/api/users/get/${localStorage.getItem('id')}/`).then(res => {
    setPerfil(res.data);
  }).catch(err => {
    console.log(err);
  });
}, [restart]);


const copyClipboard = () => {
  copy(perfil.codigo)
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
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Si, actualizar',
  }).then((result) => {
    if (result.isConfirmed) {
      API.put(`/api/users/update/${localStorage.getItem('id')}/`, perfil).then(res => {
        Swal.fire({
          title: '¡Listo!',
          text: 'Tu perfil ha sido actualizado.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
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
          confirmButtonText: 'Aceptar'
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


  return (
    <AnimatedPage>
        <main className="bg-gray-100 py-8 flex justify-center items-center">
          <section className="container mx-auto">
            <h2 className="text-gray-800 text-xl font-extrabold sm:text-2xl">Mi Perfil</h2>
            <p className="text-gray-600 mt-2">Consulta y actualiza tu perfil</p>
            <div className="mx-auto px-4 md:px-8 space-y-6 sm:max-w-mdspace-y-6 text-gray-600 sm:max-w-md bg-white shadow sm:rounded-lg p-6">
              <div className="text-center py-4">
                <img src={perfil?.profile_img ? perfil?.profile_img : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt="profile" className="w-24 h-24 mx-auto rounded-full" />
                <div className="mt-5 space-y-2">
                  <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">{perfil?.first_name + " " + perfil?.last_name}</h3>
                </div>
                <div className="mt-2 space-y-2">
                  <p className="text-gray-800 text-md font-bold">Codigo de invitacion:</p>
                  <p className="text-gray-800 text-md font-semibold">{perfil.codigo}</p>
                </div>
                <div className="mt-2 space-y-2">
                  <button
                    className="px-4 py-2 text-white font-medium bg-green-600 hover:bg-green-500 active:bg-green-600 rounded-lg duration-150"
                    onClick={copyClipboard}
                  >
                    Copiar Codigo
                  </button>
                </div>
              </div>
              <div>
                <label className="font-bold">
                  Nombre
                </label>
                <input
                  type="text"
                  className="w-full mt-2 px-3 py-2 text-gray-600 bg-transparent outline-none shadow-sm rounded-lg"
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
                  className="w-full mt-2 px-3 py-2 text-gray-600 bg-transparent outline-none shadow-sm rounded-lg"
                  value={perfil.last_name}
                  name="last_name"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="font-bold">
                  Telefono
                </label>
                <input
                  type="text"
                  className="w-full mt-2 px-3 py-2 text-gray-600 bg-transparent outline-none shadow-sm rounded-lg"
                  value={perfil.phone}
                  name="phone"
                  onChange={handleChange}
                  maxLength="10"
                />
              </div>
              <div>
                <label className="font-bold">
                  Correo Electronico
                </label>
                <input
                  type="text"
                  className={!emailError ? "w-full mt-2 px-3 py-2 text-gray-600 bg-transparent outline-none shadow-sm rounded-lg" : "w-full mt-2 px-3 py-2 text-red-600 bg-transparent outline-none shadow-sm rounded-lg"}
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
                <input
                  type="text"
                  className="w-full mt-2 px-3 py-2 text-gray-600 bg-transparent outline-none shadow-sm rounded-lg"
                  value={perfil.bank}
                  name="bank"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="font-bold">
                  Numero de Cuenta
                </label>
                <input
                  type="text"
                  className={!BankAccountError ? "w-full mt-2 px-3 py-2 text-gray-600 bg-transparent outline-none shadow-sm rounded-lg" : "w-full mt-2 px-3 py-2 text-red-600 bg-transparent outline-none shadow-sm rounded-lg"}
                  value={perfil.bank_account}
                  name="bank_account"
                  onChange={handleBankAccount}
                />
                {BankAccountError === true ? <p className='mt-2 text-sm text-red-600' id='email-error'>Numero de cuenta inválido</p> : null}
              </div>
              <div>
                <label className="font-bold">
                  Numero de Tarjeta
                </label>
                <input
                  type="text"
                  className={!TarjetaError ? "w-full mt-2 px-3 py-2 text-gray-600 bg-transparent outline-none shadow-sm rounded-lg" : "w-full mt-2 px-3 py-2 text-red-600 bg-transparent outline-none shadow-sm rounded-lg"}
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
                  className={!clabeError ? "w-full mt-2 px-3 py-2 text-gray-600 bg-transparent outline-none shadow-sm rounded-lg" : "w-full mt-2 px-3 py-2 text-red-600 bg-transparent outline-none shadow-sm rounded-lg"}
                  value={perfil.bank_clabe}
                  name="bank_clabe"
                  onChange={handleCLABE}
                />
                {clabeError === true ? <p className='mt-2 text-sm text-red-600' id='email-error'>CLABE inválida</p> : null}
              </div>
              <button
                className="w-full px-4 py-2 text-white font-medium bg-green-600 hover:bg-green-500 active:bg-green-600 rounded-lg duration-150"
                onClick={handleSubmit}
              >
                Guardar Perfil
              </button>
            </div>
          </section>
      </main>
    </AnimatedPage>
  );
}

export default Perfil;