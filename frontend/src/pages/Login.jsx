import React, {useEffect, useState} from 'react';
import '../css/login.css';
import Swal from 'sweetalert2';
import Images from '../images/images';
import { Link } from 'react-router-dom';
import Registro from './Registro';


async function loginUser(credentials) {
  const {email, password} = credentials;
    return fetch(`${import.meta.env.VITE_APP_API_URL}/api/users/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
        }).then(
          data => data.json()
        ).catch(
          err => console.log(err)
        )
}


function Login() {

  const [signup, setSignup] = useState(false);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [visible, setVisible] = useState(false);

  if (signup) {
    return <Registro />;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      email,
      password
    });
    
   if (token.access) {
       localStorage.setItem('id', token.id);
       localStorage.setItem('token', token.access);
       localStorage.setItem('name', token.name);
       localStorage.setItem('last_name', token.last_name);
       localStorage.setItem('rol', token.rol);
       localStorage.setItem('foto', token.foto);
       localStorage.setItem('email', token.email);
       localStorage.setItem('phone', token.phone);
       window.location.href = '/';
     } else {
         Swal.fire({
             icon: 'error',
             title: 'Oops...',
             text: 'Usuario o contraseña incorrectos',
         })
     }
  }


  return (
    <section className="h-screen">
      <div className="px-6 h-full text-gray-800"> {/* style={{backgroundImage: `url(${Fondo})`}} */}
        <div
          className="flex xl:justify-center lg:justify-center justify-center items-center flex-wrap h-full g-6"
        >
          <div
            className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0"
          >
            <img src={Images.logoDark} alt="login" className="w-half" />
          </div>
          <div className="w-12/12 sm:w-4/12 mb-12 md:mb-0">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-row items-center justify-center lg:justify-center mb-3">
                <h1 className="text-4xl font-bold text-gray-800">Inicio de Sesión</h1>
                <p className="text-sm text-gray-500 ml-2"></p>
              </div>
              <div className="mb-6">
                <input
                  type="email"
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  name = "id_empleado"
                  placeholder="Usuario"
                  onChange={e => setEmail(e.target.value.toLowerCase())}
                  value={email}
                />
              </div>
              <div className="mb-6 flex flex-row items-center justify-between relative">
                {visible ? (
                    <span onClick={() => setVisible(false)} className="fas fa-eye-slash flex items-center cursor-pointer absolute right-2"></span>
                  ) : (
                    <span onClick={() => setVisible(true)} className="fas fa-eye flex items-center cursor-pointer absolute right-2"></span>
                  )}
                <input
                  type={visible ? "text" : "password"}
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  name = "password"
                  placeholder="Contraseña"
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                />
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="inline-block px-7 py-3 bg-green-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                  Iniciar sesión
                </button>
              </div>
            </form>
          </div>
          <div className="w-full text-center text-gray-500">
            <Link className="text-sm underline" onClick={() => setSignup(true)}>
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>
        </div>
      </div>
    </section>
    )
}

export default Login