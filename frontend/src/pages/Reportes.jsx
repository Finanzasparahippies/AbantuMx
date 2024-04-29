import React, { useState, useEffect } from 'react';
import AnimatedPage from '../utils/AnimatedPage';
import * as Tabs from "@radix-ui/react-tabs";
import ModalImage from "react-modal-image";
import API from '../utils/API';
import Swal from 'sweetalert2';



function Reportes() {

  const [reportes, setReportes] = useState([]);
  const [recibidos, setRecibidos] = useState([]);
  

  useEffect(() => {
    API.get(`/api/sistema/reportes/${localStorage.getItem("id")}/`)
      .then((res) => {
        setReportes(res.data);
       
      })
      .catch((error) => {
        console.log(error);
      });

    API.get(`/api/sistema/reportes/recibidos/${localStorage.getItem("id")}/`)
      .then((res) => {
        setRecibidos(res.data);
       
      })
      .catch((error) => {
        console.log(error);
      });
  }
  , []);

  

  return (
   console.log(reportes),
    <AnimatedPage>
      <main className="bg-gray-100 h-screen overflow-y-auto p-4">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-gray-800 text-xl font-extrabold sm:text-2xl">Reportes</h2>
          <p className="text-gray-600 mt-2">Aquí podrás consultar los reportes de tus contribuciones que hayas enviado y recibido.</p>
        </div>
          <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-xl border border-slate-200 mt-4">
            <header className="px-5 py-4 bg-[#03E19B] rounded-xl">
              <h2 className="font-semibold text-white">Enviados</h2>
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
                        <div className="font-semibold text-center">Fecha</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Comentarios</div>
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
                    {reportes.map((reporte, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <div className="flex items-center">
                          <div className="text-slate-800">{reporte.donador}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">{reporte.fecha.slice(0,10)} {reporte.fecha.slice(11,19)}</div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">{reporte.comentarios ? reporte.comentarios : "- - -"}</div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">{reporte.resolucion}</div>
                      </td>
                      <td className="p-2">
                        <div className={reporte.aprobado ? "text-center text-white bg-green-500 rounded-full px-2" : "text-center text-white bg-yellow-500 rounded-full px-2"}>{reporte.aprobado ? "Revisado" : "Pendiente"}</div>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
      
              </div>
            </div>
          </div>
          <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-xl border border-slate-200 mt-4">
            <header className="px-5 py-4 bg-[#03E19B] rounded-xl">
              <h2 className="font-semibold text-white">Recibidos</h2>
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
                        <div className="font-semibold text-center">Fecha</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Comentarios</div>
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
                    {recibidos.map((reporte, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <div className="flex items-center">
                          <div className="text-slate-800">{reporte.beneficiario}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">{reporte.fecha.slice(0,10)} {reporte.fecha.slice(11,19)}</div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">{reporte.comentarios ? reporte.comentarios : "- - -"}</div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">{reporte.resolucion}</div>
                      </td>
                      <td className="p-2">
                        <div className={reporte.aprobado ? "text-center text-white bg-green-500 rounded-full px-2" : "text-center text-white bg-yellow-500 rounded-full px-2"}>{reporte.aprobado ? "Revisado" : "Pendiente"}</div>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
      
              </div>
            </div>
          </div>
      </main>
    </AnimatedPage>
  );
}

export default Reportes;