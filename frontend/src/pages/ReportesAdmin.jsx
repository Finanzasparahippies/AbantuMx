import React, { useState, useEffect } from 'react';
import AnimatedPage from '../utils/AnimatedPage';
import * as Tabs from "@radix-ui/react-tabs";
import ModalImage from "react-modal-image";
import API from '../utils/API';
import Swal from 'sweetalert2';



function ReportesAdmin() {

  const [pendientes, setPendientes] = useState([]);
  const [revisados, setRevisados] = useState([]);
  const [modal, setModal] = useState(false);
  const [id, setId] = useState("");

  const [resolucion, setResolucion] = useState("");
  const [form, setForm] = useState({
    image: null,
    beneficiario: "",
    donador: "",
    comentarios: ""
  });
  

  useEffect(() => {
    getPendientes()
    getRevisados()
  }, []);

  const getPendientes = () => {
    API.get(`/api/sistema/reportes/pendientes`)
      .then((res) => {
        setPendientes(res.data);
       
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const getRevisados = () => {
    API.get(`/api/sistema/reportes/revisados`)
      .then((res) => {
        setRevisados(res.data);
       
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleReportSend = (id) => {
    API.post(`/api/sistema/reportes/actualizar/`, {
      resolucion: resolucion,
      id: id,
      revisor: localStorage.getItem('id')
    })
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Reporte Resuelto',
          showConfirmButton: false,
          timer: 1500
        });
        setModal(false);
        getPendientes()
        getRevisados()
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleCancel = () => {
    setModal(false);
  }

  

  return (
    console.log(pendientes),
    <AnimatedPage>
      <main className="bg-gray-100 h-screen overflow-y-auto p-4">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-gray-800 text-xl font-extrabold sm:text-2xl">Administrador de Reportes</h2>
        </div>  
          <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-xl border border-slate-200 mt-4">
            <header className="px-5 py-4 bg-[#03E19B] rounded-xl">
              <h2 className="font-semibold text-white">Pendientes</h2>
            </header>
            <div className="p-3">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  {/* Table header */}
                  <thead className="text-xs uppercase text-slate-400 bg-slate-50 rounded-xl">
                    <tr>
                      <th className="p-2">
                        <div className="font-semibold text-left">Contribuyente</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Beneficiario</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Fecha</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Comentarios</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Evidencia</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Acciones</div>
                      </th>
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody className="text-sm font-medium divide-y divide-slate-100">
                    {/* Row */}
                    {pendientes.length > 0 ? pendientes.map((reporte, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <div className="flex items-center">
                          <div className="text-slate-800">{reporte.donador}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">{reporte.beneficiario}</div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">{reporte.fecha.slice(0,10)} {reporte.fecha.slice(11,19)}</div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">{reporte.comentarios ? reporte.comentarios : "- - -"}</div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">
                          <ModalImage
                            small={reporte.evidencia}
                            large={reporte.evidencia}
                            alt="Evidencia"
                            className="w-16 h-16"
                            hideDownload
                            hideZoom
                          />
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">
                          <button 
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                            onClick={() => {
                              setModal(true);
                              setId(reporte.id);
                              setForm({
                                image: reporte.evidencia,
                                beneficiario: reporte.beneficiario,
                                donador: reporte.donador,
                                comentarios: reporte.comentarios
                              });
                            }}
                            >
                              Revisar
                          </button>
                        </div>
                      </td>
                    </tr>
                    )) : <tr><td colSpan="5" className="text-center">No hay reportes pendientes</td></tr>}
                  </tbody>
                </table>
      
              </div>
            </div>
          </div>
          <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-xl border border-slate-200 mt-4">
            <header className="px-5 py-4 bg-[#03E19B] rounded-xl">
              <h2 className="font-semibold text-white">Revisados</h2>
            </header>
            <div className="p-3">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  {/* Table header */}
                  <thead className="text-xs uppercase text-slate-400 bg-slate-50 rounded-sm">
                    <tr>
                      <th className="p-2">
                        <div className="font-semibold text-left">Contribuyente</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Beneficiario</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Fecha</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Comentarios</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Evidencia</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Resolucion</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Status</div>
                      </th>
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody className="text-sm font-medium divide-y divide-slate-100">
                    {/* Row */}
                    {revisados ? revisados.map((reporte, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <div className="flex items-center">
                          <div className="text-slate-800">{reporte.donador}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">{reporte.beneficiario}</div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">{reporte.fecha.slice(0,10)} {reporte.fecha.slice(11,19)}</div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">{reporte.comentarios ? reporte.comentarios : "- - -"}</div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">
                          <ModalImage
                            small={reporte.evidencia}
                            large={reporte.evidencia}
                            alt="Evidencia"
                            className="w-16 h-16"
                            hideDownload
                            hideZoom
                          />
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">{reporte.resolucion}</div>
                      </td>
                      <td className="p-2">
                        <div className={reporte.aprobado ? "text-center text-white bg-green-500 rounded-full px-2" : "text-center text-white bg-yellow-500 rounded-full px-2"}>{reporte.aprobado ? "Revisado" : "Pendiente"}</div>
                      </td>
                    </tr>
                    )) : <tr><td colSpan="5" className="text-center">No hay reportes revisados</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className={ modal ? "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full display-block" : "hidden"}>
            <div className="relative py-4 text-left px-6 bg-[#03E19B] rounded-xl shadow-xl w-11/12 md:w-1/2 mx-auto align-center justify-center my-24">

              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold text-white">Revisar reporte</p>
                <div className="modal-close cursor-pointer z-50" onClick={handleCancel}>
                  <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                    <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col items-center lg:flex-row">
                <div className="mt-2">
                  <ModalImage 
                    small={form.image}
                    large={form.image}
                    alt="Evidencia"
                    className="w-80 h-80 rounded-xl"
                    hideDownload
                    hideZoom
                  />
                </div>
                <div className="ml-4 w-1/2 justify-center flex flex-col">
                  <label className="block text-black text-sm font-bold mt-2 mb-2">
                    Beneficiario
                  </label>
                  <p className="text-xl font-semibold text-white">{form.beneficiario}</p>
                  <label className="block text-black text-sm font-bold mt-2 mb-2">
                    Donador
                  </label>
                  <p className="text-lg font-semibold text-white">{form.donador}</p>
                  <label className="block text-black text-sm font-bold mt-2 mb-2">
                    Comentarios
                  </label>
                  <p className="text-sm font-semibold text-white">{form.comentarios}</p>
                </div>
              </div>
              <label className="block text-white text-lg font-bold mt-2 mb-2">
                Resolución
              </label>
              <textarea className="w-full h-24 px-3 py-2 text-base placeholder-gray-300 border rounded-lg focus:shadow-outline" name="resolucion" value={resolucion} onChange={(e) => setResolucion(e.target.value)}></textarea>
              <div className="flex justify-end pt-2">
                <button className="px-4 p-3 rounded-lg text-white hover:text-[#029d85] font-medium bg-[#029d85] hover:bg-white active:bg-white mr-2" onClick={handleReportSend.bind(this, id)}>Enviar resolucion</button>
                <button className="modal-close px-4 text-white font-medium bg-gray-600 hover:bg-gray-500 active:bg-white rounded-lg" onClick={handleCancel}>Cancelar</button>
              </div>
            </div>
          </div>
      </main>
    </AnimatedPage>
  );
}

export default ReportesAdmin;