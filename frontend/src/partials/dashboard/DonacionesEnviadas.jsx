import React, { useEffect, useState } from 'react';
import API from '../../utils/API';
import ModalImage from "react-modal-image";
import { Link } from 'react-router-dom';

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
              {donaciones.map((donacion, idx) => (
              <tr key={idx}>
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
                  <div className="text-center"><ModalImage small={donacion.evidencia} large={donacion.evidencia} alt="evidencia" className="w-10 h-10" hideDownload hideZoom/></div>
                  }
                </td>
                
              </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className="text-center text-xs text-[#029d85] py-3">
                  <Link 
                    className="bg-green-50 hover:bg-green-100 text-gray-800 hover:text-[#029d85] px-3 py-1 rounded-sm"
                    to="/inicio/contribuciones"
                  >
                    Ver todas
                  </Link>
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
