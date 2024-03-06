import React, { useState, useEffect, useMemo } from 'react';
import AnimatedPage from '../utils/AnimatedPage';
import Swal from 'sweetalert2';
import API from '../utils/API';

function Redes() {

  const [modal, setModal] = useState(false);
  const [input1, setInput1] = useState(false);
  const [redes, setRedes] = useState([]);
  const [restart, setRestart] = useState(false);
  const [form, setForm] = useState({
    red: "",
    codigo: "",
    donador_id: localStorage.getItem('id')
  });


useEffect(() => {
  API.get(`/api/sistema/redes/${localStorage.getItem('id')}/`).then(res => {
    setRedes(res.data);
  }).catch(err => {
    console.log(err);
  });
}, [restart]);


const handleModal = (title) => {
  setModal(true);
  setForm({
    ...form,
    red: title
  });
}

const handleSubmit = () => {
  Swal.fire({
    title: '¿Estas seguro?',
    text: "Estas a punto de unirte a esta red.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, unirme'
  }).then((result) => {
    if (result.isConfirmed) {
      handleCancel();
      API.post('/api/users/create-suscripcion/', form).then(res => {
        Swal.fire({
          title: '¡Te has unido a la red!',
          text: 'Ahora formas parte de esta red.',
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
}

const handleCancel = () => {
  setModal(!modal);
  setInput1(false);
  setForm({
    red: "",
    codigo: "",
    donador_id: localStorage.getItem('id')
  });

}



  return (
    <AnimatedPage>
        <main className="bg-gray-100 h-screen overflow-y-auto p-4">
            <section className="py-16">
              <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                  <div className="max-w-md">
                      <h1 className="text-gray-800 text-xl font-extrabold sm:text-2xl">Redes</h1>
                      <p className="text-gray-600 mt-2">Estas son las redes a las que puedes unirte.</p>
                  </div>
                  <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                      {
                          redes.map((item, idx) => (
                              <li className="border rounded-lg bg-white shadow-lg" key={idx}>
                                  <div className="flex items-start justify-between p-4">
                                      <div className="space-y-2">
                                          <svg className="w-10 h-10" viewBox="0 0 43 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <g clip-path="url(#clip0_690_1894)">
                                                  <path d="M14.1693 48C18.08 48 21.254 44.4159 21.254 39.9999V31.9999H14.1693C10.2586 31.9999 7.08459 35.5839 7.08459 39.9999C7.08459 44.4159 10.2586 48 14.1693 48Z" fill="#0ACF83" />
                                                  <path d="M7.08459 23.9999C7.08459 19.5839 10.2586 15.9999 14.1693 15.9999H21.254V31.9998H14.1693C10.2586 32 7.08459 28.4159 7.08459 23.9999Z" fill="#A259FF" />
                                                  <path d="M7.08459 8.00006C7.08459 3.58406 10.2586 0 14.1693 0H21.254V15.9999H14.1693C10.2586 15.9999 7.08459 12.4161 7.08459 8.00006Z" fill="#F24E1E" />
                                                  <path d="M21.2535 0H28.3382C32.2489 0 35.4229 3.58406 35.4229 8.00006C35.4229 12.4161 32.2489 15.9999 28.3382 15.9999H21.2535V0Z" fill="#FF7262" />
                                                  <path d="M35.4229 23.9999C35.4229 28.4159 32.2489 32 28.3382 32C24.4275 32 21.2535 28.4159 21.2535 23.9999C21.2535 19.5839 24.4275 15.9999 28.3382 15.9999C32.2489 15.9999 35.4229 19.5839 35.4229 23.9999Z" fill="#1ABCFE" />
                                              </g>
                                              <defs>
                                                  <clipPath id="clip0_690_1894">
                                                      <rect width="42.5075" height="48" fill="white" />
                                                  </clipPath>
                                              </defs>
                                          </svg>
                                          <h4 className="text-gray-800 font-semibold">{item.nombre}</h4>
                                          <p className="text-gray-600 text-sm">En esta red contribuyes ${item.descripcion} pesos al mes.</p>
                                      </div>
                                      {item.activa ?
                                      <div className="flex items-center justify-center bg-green-100 text-green-500 rounded-lg px-3 py-2">
                                          <p className="text-sm font-semibold">Ya estas en esta red</p>
                                      </div>
                                      :
                                      <button className="text-gray-700 text-sm border rounded-lg px-3 py-2 duration-150 hover:bg-gray-100" onClick={() => handleModal(item.nombre)}>Unirse</button>
                                      }
                                  </div>
                              </li>
                          ))
                      }
                  </ul>
              </div>
          </section>
          <div className={ modal ? "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full display-block" : "hidden"}>
            <div className="relative py-4 text-left px-6 bg-white rounded-lg shadow-xl w-11/12 md:w-1/2 mx-auto align-center justify-center my-24">

              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold">{form.red}</p>
                <div className="modal-close cursor-pointer z-50" onClick={handleCancel}>
                  <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                    <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                  </svg>
                </div>
              </div>

      
            
              <p>¿Tienes un codigo de invitacion? <a href="#" className="text-green-500" onClick={() => setInput1(!input1)}>Click aqui</a></p>

              <input 
                type="text" 
                placeholder="Codigo de invitacion" 
                className={ input1 ? "w-full border rounded-lg p-2 mt-2" : "hidden"}
                name="codigo"
                onChange={(e) => setForm({...form, codigo: e.target.value})} 
              />
  
              <div className="flex justify-end pt-2">
                <button className="px-4 bg-transparent p-3 rounded-lg text-green-500 hover:bg-gray-100 hover:text-green-400 mr-2" onClick={handleSubmit}>Unirse</button>
                <button className="modal-close px-4 bg-green-500 p-3 rounded-lg text-white hover:bg-green-400" onClick={handleCancel}>Cancelar</button>
              </div>
            </div>
          </div>
      </main>
    </AnimatedPage>
  );
}

export default Redes;