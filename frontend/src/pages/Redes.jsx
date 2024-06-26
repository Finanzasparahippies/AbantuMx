import React, { useState, useEffect, useMemo } from 'react';
import AnimatedPage from '../utils/AnimatedPage';
import Swal from 'sweetalert2';
import API from '../utils/API';
import Images from '../images/Images';

function Redes() {

  const [modal, setModal] = useState(false);
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
    title: '¿Estás seguro?',
    text: "Estás a punto de unirte a esta red.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#03E19B',
    cancelButtonColor: '#9c9c9c',
    confirmButtonText: 'Sí, unirme',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      handleCancel();
      API.post('/api/users/create-suscripcion/', form).then(res => {
        Swal.fire({
          title: '¡Te has unido a la red!',
          text: 'Ahora formas parte de esta red.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        });
        console.log(res.data.message);
        setRestart(!restart);
      }
      ).catch(err => {
        handleCancel();
        Swal.fire({
          title: '¡Error!',
          text: err.response.data.message,
          icon: 'error',
          showConfirmButton: false,
          timer: 1000
        });
      });
    }
  });
}

const handleCancel = () => {
  setModal(!modal);
  setForm({
    red: "",
    codigo: "",
    donador_id: localStorage.getItem('id')
  });

}



  return (
    <AnimatedPage>
        <main className="bg-gray-100 h-screen overflow-y-auto">
            <section className="container mx-auto px-6 py-6">
              <div className="max-w-screen-xl mx-auto">
                <div className="flex flex-col items-center mb-8">
                  <h2 className="text-gray-800 text-xl font-extrabold sm:text-2xl">Redes de Contribución</h2>
                  <p className="text-gray-600 mt-2">Estas son las redes a las que puedes unirte.</p>
                </div>
                  <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                      {
                          redes.map((item, idx) => (
                              <li className="border rounded-lg bg-[#03E19B] shadow-lg" key={idx}>
                                  <div className="flex items-start justify-between p-4">
                                      <div className="space-y-2">
                                          <img src={Images.redes} alt="Redes" className="w-20 h-20 object-cover rounded-full" />
                                          <h4 className="text-white font-semibold text-2xl">{item.nombre}</h4>
                                          <p className="text-white text-lg">En esta red contribuyes con ${item.descripcion} pesos al mes.</p>
                                      </div>
                                      {item.activa ?
                                      <div className="flex items-center justify-center bg-[#029d85] text-white rounded-lg px-2 py-1">
                                          <p className="text-lg font-bold">Ya estás en esta red</p>
                                      </div>
                                      :
                                      <button className="font-bold text-lg rounded-lg px-6 py-2 duration-150 hover:bg-[#029d85] bg-white hover:text-white text-[#029d85]" onClick={() => handleModal(item.nombre)}>Unirse</button>
                                      }
                                  </div>
                              </li>
                          ))
                      }
                  </ul>
              </div>
          </section>
          <div className={ modal ? "fixed inset-0 bg-gray-300 bg-opacity-50 overflow-y-auto h-full w-full display-block" : "hidden"}>
            <div className="relative py-4 text-left px-6 bg-[#03E19B] rounded-lg shadow-xl w-11/12 md:w-1/2 mx-auto align-center justify-center my-24">

              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold text-white">{form.red}</p>
                <div className="modal-close cursor-pointer z-50" onClick={handleCancel}>
                  <svg className="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                    <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                  </svg>
                </div>
              </div>

      
            
              <p className="text-white">¿Tienes un código de invitación? Ingresalo aquí.</p>

              <input 
                type="text" 
                placeholder="Código de invitación (Opcional)" 
                className="w-full border rounded-lg p-2 mt-2"
                name="codigo"
                onChange={(e) => setForm({...form, codigo: e.target.value})}
                value={form.codigo}
              />
  
              <div className="flex justify-end pt-2">
                <button className="px-4 p-3 rounded-lg text-[#029d85] hover:text-white font-medium bg-white hover:bg-[#029d85] active:bg-[#029d85] mr-2" onClick={handleSubmit}>Unirse</button>
                <button className="modal-close px-4 bg-[#029d85] hover:bg-white active:bg-white text-white hover:text-[#029d85] p-3 rounded-lg" onClick={handleCancel}>Cancelar</button>
              </div>
            </div>
          </div>
      </main>
    </AnimatedPage>
  );
}

export default Redes;