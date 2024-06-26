import React, { useState, useEffect } from 'react';
import AnimatedPage from '../utils/AnimatedPage';
import * as Tabs from "@radix-ui/react-tabs";
import API from '../utils/API';
import Swal from 'sweetalert2';



function Contribucion() {

  const [selectedTab, setSelectedTab] = useState("Red 100");
  const [red, setRed] = useState({});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const tabItems = [
    "Red 100",
    "Red 500",
    "Red 1000",
  ];

  useEffect(() => {
    API.get(`/api/sistema/donaciones-info/${localStorage.getItem("id")}/`).then(res => {
      setRed(res.data[0][selectedTab]);
    }).catch(err => {
      console.log(err);
    });
  }, [selectedTab]);

  const handleTabChange = (val) => {
    setSelectedTab(val);
  }

  
  const handleSubmit = (e) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Estás a punto de enviar tu comprobante de contribución.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#03E19B',
      cancelButtonColor: '#9c9c9c',
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Enviando comprobante...',
          text: 'Por favor espera un momento.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          }
        });
        API.post(`/api/sistema/crear-donacion/`, {
          red: selectedTab,
          donador: localStorage.getItem("id"),
          beneficiario: red.beneficiario_id,
          evidencia: image
        }, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          Swal.close();
          Swal.fire({
            title: '¡Comprobante enviado!',
            text: 'Tu comprobante ha sido enviado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            window.location.reload();
          });
          console.log(res.data.message);
        }).catch(err => {
          Swal.close();
          Swal.fire({
            title: '¡Error!',
            text: err.response.data.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        });
      }}
    );
  }


  return (
    console.log(red),
    <AnimatedPage>
      <main className="bg-gray-100 h-screen overflow-y-auto p-4">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-gray-800 text-xl font-extrabold sm:text-2xl">Envía tu Comprobante de Contribución</h2>
          <p className="text-gray-600 mt-2">Aquí puedes ver la información bancaria de cada red a la que te has unido para enviar tu comprobante de contribución.</p>
        </div>
      <Tabs.Root
        className="max-w-screen-xl mt-2 mx-auto px-4 md:px-8"
        value={selectedTab}
        onValueChange={(val) => handleTabChange(val)}
      >
        <Tabs.List
          className="hidden bg-gray-100 py-1.5 px-2.5 rounded-lg gap-x-3 overflow-x-auto text-sm sm:flex"
          aria-label="Manage your account"
        >
          {tabItems.map((item, idx) => (
            <Tabs.Trigger
              key={idx}
              className="data-[state=active]:bg-[#029d85] data-[state=active]:text-white data-[state=active]:shadow-sm py-1.5 px-3 rounded-lg duration-150 text-gray-500 hover:text-white hover:bg-[#029d85] active:bg-[#029d85] font-medium"
              value={item}
            >
              {item}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <div className="relative text-gray-500 sm:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="pointer-events-none w-5 h-5 absolute right-2 inset-y-0 my-auto"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
          <select
            value={selectedTab}
            className="py-2 px-3 w-full bg-transparent appearance-none outline-none border rounded-lg shadow-sm focus:border-green-600 text-sm"
            onChange={(e) => handleTabChange(e.target.value)}
          >
            {tabItems.map((item, idx) => (
              <option key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200 mt-4 max-w-screen-xl mx-auto">
          {red && Object.keys(red).length > 0 ? (
            <div className="p-3">
              <div className="mt-4">
                <h1 className="text-2xl font-bold text-[#029d85]">¡Recuerda que tu fecha de contribución en esta red es el {red.fecha.toString().split('T')[0][8] + red.fecha.toString().split('T')[0][9]} de cada mes!</h1>
              </div>
              <div className="mt-8">
                <h3 className="text-xl text-[#029d85] font-bold">Esta es la información bancaria para enviar tu contribución en tu red {selectedTab}.</h3>
                <div className="mt-4">
                  <div className="flex items-center">
                    <p className="text-sm text-[#029d85] font-bold mr-2">Nombre:</p>
                    <p className="text-sm font-semibold text-gray-800">{red.beneficiario}</p>
                  </div>
                  <div className="flex items-center mt-2">
                    <p className="text-sm text-[#029d85] font-bold mr-2">Banco:</p>
                    <p className="text-sm font-semibold text-gray-800">{red.bank}</p>
                  </div>
                  <div className="flex items-center mt-2">
                    <p className="text-sm text-[#029d85] font-bold mr-2">Número de Tarjeta:</p>
                    <p className="text-sm font-semibold text-gray-800">{red.bank_card}</p>
                  </div>
                  <div className="flex items-center mt-2">
                    <p className="text-sm text-[#029d85] font-bold mr-2">CLABE Interbancaria:</p>
                    <p className="text-sm font-semibold text-gray-800">{red.bank_clabe}</p>
                  </div>
                  <div className="flex items-center mt-2">
                    <p className="text-sm text-[#029d85] font-bold mr-2">Número de Cuenta:</p>
                    <p className="text-sm font-semibold text-gray-800">{red.bank_account}</p>
                  </div>
                </div>
              </div>
              
              {red.donacion_mes ? ( 
              <div className="mt-4">
                <div className="flex flex-col mt-4 md:flex-row items-center">
                  
                  <div className="max-w-md h-40 rounded-lg border-2 border-dashed flex items-center justify-center">
                      <label htmlFor="file" className="cursor-pointer text-center p-4 md:p-8" hidden={preview}>
                          <svg className="w-10 h-10 mx-auto" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12.1667 26.6667C8.48477 26.6667 5.5 23.6819 5.5 20C5.5 16.8216 7.72428 14.1627 10.7012 13.4949C10.5695 12.9066 10.5 12.2947 10.5 11.6667C10.5 7.0643 14.231 3.33334 18.8333 3.33334C22.8655 3.33334 26.2288 6.19709 27.0003 10.0016C27.0556 10.0006 27.1111 10 27.1667 10C31.769 10 35.5 13.731 35.5 18.3333C35.5 22.3649 32.6371 25.7279 28.8333 26.5M25.5 21.6667L20.5 16.6667M20.5 16.6667L15.5 21.6667M20.5 16.6667L20.5 36.6667" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          <p className="mt-3 text-gray-700 max-w-xs mx-auto">Haz click para <span className="font-medium text-[#03E19B]">Subir tu comprobante</span></p>
                      </label>
                      <input 
                        id="file" 
                        type="file" 
                        className="hidden" 
                        accept='image/*' 
                        onChange={(e) => {
                          setImage(e.target.files[0])
                          setPreview(URL.createObjectURL(e.target.files[0]))
                        }} 
                      />
                      <img src={preview} alt="" className={preview ? "w-full h-full object-cover rounded-lg" : "hidden"} />
                  </div>
                  <div className="flex flex-col items-start justify-center ml-4 mt-2 md:mt-0">
                    <button className="px-4 py-2 bg-[#03E19B] text-white rounded-lg font-semibold hover:bg-[#029d85] duration-150 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSubmit} disabled={image ? false : true}>Enviar Comprobante</button>
                    <p className="text-sm text-gray-600">Sube tu comprobante de contribución</p>
                    <p className="text-xs text-gray-400">Formatos permitidos: .jpg, .png, .bmp</p>
                    <button className="mt-4 px-4 py-2 bg-[#03E19B] text-white rounded-lg font-semibold hover:bg-[#029d85] duration-150" hidden={image ? false : true } onClick={() => {setImage(null) ; setPreview(null)}}>Volver a subir imagen</button>
                  </div>
                </div>
              </div>
              ) : (
                <div className="mt-4">
                  <p className="text-xl font-semibold text-[#03E19B]">Ya has enviado tu comprobante de contribución de este mes.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3">
              <p className="text-gray-600 text-lg">No te has unido a esta red.</p>
              <p className="text-gray-600 text-md">Para unirte a esta red, ve a la sección de redes y únete a la red de tu elección.</p>
              <button className="px-4 py-2 bg-[#03E19B] text-white rounded-lg font-semibold hover:bg-[#029d85] duration-150 mt-4" onClick={() => window.location.href = '/inicio/redes'}>Ir a Redes</button>
            </div>
          )}
        </div>
      </Tabs.Root>
      </main>
    </AnimatedPage>
  );
}

export default Contribucion;