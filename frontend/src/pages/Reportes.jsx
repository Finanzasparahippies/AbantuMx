import React, { useState, useEffect } from 'react';
import AnimatedPage from '../utils/AnimatedPage';
import * as Tabs from "@radix-ui/react-tabs";
import ModalImage from "react-modal-image";
import API from '../utils/API';
import Swal from 'sweetalert2';



function Reportes() {

  const [reportes, setReportes] = useState([]);
  

  useEffect(() => {
    API.get(`/api/sistema/reportes/${localStorage.getItem("id")}/`)
      .then((res) => {
        setReportes(res.data);
       
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
        <div className="p-8 bg-white rounded-lg shadow-sm mb-4">
          <h1 className="text-2xl font-semibold text-gray-700">Reportes</h1>
          <p className="text-sm text-gray-600">
            Aquí podrás consultar los reportes que hayas hecho sobre contribuciones en tus redes.
          </p>
        </div>  
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
                        <div className={reporte.aprobado ? "text-center text-white bg-green-500 rounded-full px-2" : "text-center text-white bg-yellow-500 rounded-full px-2"}>{reporte.aprobado ? "Aprobado" : "Pendiente"}</div>
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