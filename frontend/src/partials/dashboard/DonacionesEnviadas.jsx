import React, { useEffect, useState } from 'react';
import API from '../../utils/API';

function DonacionesEnviadas() {

  const [donaciones, setDonaciones] = useState([])

  useEffect(() => {
    API.get(`/api/sistema/donaciones-enviadas/${localStorage.getItem('id')}/`)
      .then(res => {
        setDonaciones(res.data)
      })
      .catch(err => console.log(err))
  }, [])


  return (
    <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">Mis Donaciones Enviadas</h2>
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
              {donaciones.map(donacion => (
              <tr>
                <td className="p-2">
                  <div className="flex items-center">
                    <svg className="shrink-0 mr-2 sm:mr-3" width="36" height="36" viewBox="0 0 36 36">
                      <circle fill="#24292E" cx="18" cy="18" r="18" />
                      <path d="M18 10.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V24c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" fill="#FFF" />
                    </svg>
                    <div className="text-slate-800">{donacion.beneficiario}</div>
                  </div>
                </td>
                <td className="p-2">
                  <div className="text-center">{donacion.red}</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-green-500">{donacion.fecha.split('T')[0]}</div>
                </td>
                <td className="p-2">
                  { donacion.evidencia === null ?
                  <div className="text-center">Sin evidencia</div>
                  :
                  <div className="text-center"><img src={donacion.evidencia} alt="evidencia" className="w-20 h-20" /></div>
                  }
                </td>
                
              </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" className="text-center text-xs text-green-500 py-3">
                  <button className="bg-green-50 hover:bg-green-100 text-green-400 hover:text-green-500 px-3 py-1 rounded-sm">
                    Ver todas
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>

        </div>
      </div>
    </div>
  );
}

export default DonacionesEnviadas;
