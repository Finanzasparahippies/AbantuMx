import React, { useState, useEffect } from 'react';
import AnimatedPage from '../utils/AnimatedPage';
import * as Tabs from "@radix-ui/react-tabs";
import ModalImage from "react-modal-image";
import API from '../utils/API';
import Swal from 'sweetalert2';



function Contribuciones() {

  const [contribuciones, setContribuciones] = useState([]);
  const [modal, setModal] = useState(false);
  const [id, setId] = useState(0);
  const [selectedTab, setSelectedTab] = useState("Red 100");

  const [enviadas, setEnviadas] = useState([]);
  const [recibidas, setRecibidas] = useState([]);
  const [comments, setComments] = useState("");

  const tabItems = [
    "Red 100",
    "Red 500",
    "Red 1000",
  ];

  useEffect(() => {
    handleDonaciones();
  }
  , []);

  const handleDonaciones = () => {
    API.get(`/api/sistema/donaciones/${localStorage.getItem("id")}/`)
      .then((res) => {
        setContribuciones(res.data[0]);
        setEnviadas(res.data[0].donaciones100don);
        setRecibidas(res.data[0].donaciones100ben);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleTabChange = (val) => {
    setSelectedTab(val);
    if (val === "Red 100") {
      setEnviadas(contribuciones.donaciones100don);
      setRecibidas(contribuciones.donaciones100ben)
    }
    if (val === "Red 500") {
      setEnviadas(contribuciones.donaciones500don);
      setRecibidas(contribuciones.donaciones500ben)
    }
    if (val === "Red 1000") {
      setEnviadas(contribuciones.donaciones1000don);
      setRecibidas(contribuciones.donaciones1000ben)
    }
  };

  const handleReport = (id) => {
    setModal(!modal);
    setComments("");
    setId(id);
  }

  const handleReportSend = (id) => {
    Swal.fire({
      'title': 'Reportar donación',
      'text': '¿Estás seguro de reportar esta donación?',
      'icon': 'warning',
      'showCancelButton': true,
      'confirmButtonText': 'Sí',
      'cancelButtonText': 'No',
      'confirmButtonColor': '#03E19B',
      'cancelButtonColor': '#9c9c9c',
      }).then((result) => {
      if (result.isConfirmed) {
        API.post(`/api/sistema/reportar-donacion/`, {
          id: id,
          comments: comments
        })
        .then((res) => {
          setModal(!modal);
          Swal.fire({
            'title': 'Evidencia reportada',
            'text': 'La evidencia ha sido reportada, se revisará en breve',
            'icon': 'success'
          });
          handleDonaciones();
        })
        .catch((error) => {
          setModal(!modal);
          Swal.fire({
            'title': 'Error',
            'text': 'No se pudo reportar la evidencia',
            'icon': 'error'
          });
        });
      }
    });
  }

  const handleCancel = () => {
    setModal(!modal);
  }


  return (
    console.log(enviadas),
    console.log(recibidas),
    <AnimatedPage>
      <main className="bg-gray-100 h-screen overflow-y-auto p-4">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-gray-800 text-xl font-extrabold sm:text-2xl">Contribuciones</h2>
          <p className="text-gray-600 mt-2">Aquí puedes ver tus contribuciones enviadas y recibidas en tus redes.</p>
          <p className="text-gray-600 mt-2">También puedes reportar algun error en las evidencias recibidas.</p>
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
              <option key={idx} idx={idx}>
                {item}
              </option>
            ))}
          </select>
        </div>
        {enviadas.length > 0 ? (
          <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200 mt-4">
            <header className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Enviadas</h2>
            </header>
            <div className="p-3">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  {/* Table header */}
                  <thead className="text-xs uppercase text-slate-400 bg-slate-50 rounded-sm">
                    <tr>
                      <th className="p-2">
                        <div className="font-semibold text-left">Beneficiario</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Red</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Fecha</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Evidencia</div>
                      </th>
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody className="text-sm font-medium divide-y divide-slate-100">
                    {/* Row */}
                    {enviadas.map(donacion => (
                    <tr>
                      <td className="p-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 flex-shrink-0 mr-2 rounded-full overflow-hidden">
                            <img src={donacion.profile_img ? donacion.profile_img : "https://ui-avatars.com/api/?name="+donacion.beneficiario.charAt(0)+"&background=random"} alt="avatar" className="w-10 h-10" />
                          </div>
                          <div className="text-slate-800">{donacion.beneficiario}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">{donacion.red}</div>
                      </td>
                      <td className="p-2">
                        <div className="text-center text-[#029d85]">{donacion.fecha.split('T')[0]}</div>
                      </td>
                      <td className="p-2 flex justify-center">
                        { donacion.evidencia === null ?
                        <div className="text-center">Sin evidencia</div>
                        :
                        <div className="text-center"><ModalImage small={donacion.evidencia} large={donacion.evidencia} alt="evidencia" className="w-16 h-16" hideDownload hideZoom /></div>
                        }
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
      
              </div>
            </div>
          </div>
        ) : (
          <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200 mt-4">
            <header className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Enviadas</h2>
            </header>
            <div className="p-3">
              <p className="text-center text-gray-500">No has enviado donaciones en esta red</p>
            </div>
          </div>
        )}
        {recibidas.length > 0 ? (
          <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200 mt-4">
            <header className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Recibidas</h2>
            </header>
            <div className="p-3">
      
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  {/* Table header */}
                  <thead className="text-xs uppercase text-slate-400 bg-slate-50 rounded-sm">
                    <tr>
                      <th className="p-2">
                        <div className="font-semibold text-left">Donador</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Red</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Fecha</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Evidencia</div>
                      </th>
                      <th className="p-2">
                      </th>
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody className="text-sm font-medium divide-y divide-slate-100">
                    {/* Row */}
                    {recibidas.map(donacion => (
                    <tr>
                      <td className="p-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 flex-shrink-0 mr-2 rounded-full overflow-hidden">
                            <img src={donacion.profile_img ? donacion.profile_img : "https://ui-avatars.com/api/?name="+donacion.donador.charAt(0)+"&background=random"} alt="avatar" className="w-10 h-10" />
                          </div>
                          <div className="text-slate-800">{donacion.donador}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">{donacion.red}</div>
                      </td>
                      <td className="p-2">
                        <div className="text-center text-[#029d85]">{donacion.fecha.split('T')[0]}</div>
                      </td>
                      <td className="p-2 flex justify-center">
                        { donacion.evidencia === null ?
                        <div className="text-center">Sin evidencia</div>
                        :
                        <div className="text-center"><ModalImage small={donacion.evidencia} large={donacion.evidencia} alt="evidencia" className="w-10 h-10" hideDownload hideZoom /></div>
                        }
                      </td>
                      {donacion.reporte === true ?
                      <td className="p-2">
                        <button 
                          className="bg-red-500 text-white font-semibold px-3 py-1 rounded-sm hover:bg-red-600 focus:outline-none focus:ring-0 focus:bg-red-600 active:bg-red-700 transition duration-150 ease-in-out"
                          onClick={() => {
                            handleReport(donacion.id);
                          }}
                        >
                          Reportar
                        </button> 
                      </td>
                      :
                      <td className="p-2">
                        <div className="text-center bg-yellow-600 text-white rounded-full px-2">En revisión</div>
                      </td>
                      }
                    </tr>
                    ))}
                  </tbody>
                </table>
                
              </div>
            </div>
          </div>
        ) : (
          <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200 mt-4">
            <header className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Recibidas</h2>
            </header>
            <div className="p-3">
              <p className="text-center text-gray-500">No has recibido donaciones en esta red</p>
            </div>
          </div>
        )}
      </Tabs.Root>
        <div className={ modal ? "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full display-block" : "hidden"}>
            <div className="relative py-4 text-left px-6 bg-white rounded-lg shadow-xl w-11/12 md:w-1/2 mx-auto align-center justify-center my-24">

              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold">Reportar error</p>
                <div className="modal-close cursor-pointer z-50" onClick={handleCancel}>
                  <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                    <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                  </svg>
                </div>
              </div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comments">
                Comentarios
              </label>
              <textarea className="w-full h-24 px-3 py-2 text-base placeholder-gray-300 border rounded-lg focus:shadow-outline" name="comments" value={comments} onChange={e => setComments(e.target.value)}></textarea>
              <div className="flex justify-end pt-2">
                <button className="px-4 bg-transparent p-3 rounded-lg text-[#029d85] hover:bg-gray-100 hover:text-green-400 mr-2" onClick={handleReportSend.bind(this, id)}>Enviar reporte</button>
                <button className="modal-close px-4 bg-green-500 p-3 rounded-lg text-white hover:bg-green-400" onClick={handleCancel}>Cancelar</button>
              </div>
            </div>
        </div>
      </main>
    </AnimatedPage>
  );
}

export default Contribuciones;