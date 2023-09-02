import React, { useEffect } from 'react';
import API from '../../utils/API';

function DashboardCard12() {

  const [actividades, setActividades] = React.useState([]);
  
  useEffect(() => {
    API.get('users/actividades')
      .then((response) => {
        setActividades(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  return (
    <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">Actividad reciente</h2>
      </header>
      <div className="p-3">

        {/* Card content */}
        {/* "Today" group */}
        <div>
          <header className="text-xs uppercase text-slate-400 bg-slate-50 rounded-sm font-semibold p-2">Hoy</header>
          <ul className="my-1">
            {actividades && actividades.map((actividad) => (
            <li className="flex px-2" key={actividad.id}>
              { actividad.tipo === 'Solicitud Creada' ?
              <>
              <div className="w-9 h-9 rounded-full shrink-0 bg-green-500 my-2 mr-3">
                <svg className="w-9 h-9 fill-current text-red-50" viewBox="0 0 36 36">
                  <path d="M15 13v-3l-5 4 5 4v-3h8a1 1 0 000-2h-8zM21 21h-8a1 1 0 000 2h8v3l5-4-5-4v3z" />
                </svg>
              </div>
              <div className="grow flex items-center text-sm py-2">
                <div className="grow flex justify-between">  
                  <div className="self-center"><a className="font-medium text-slate-800 hover:text-slate-900" href="#0">{actividad.descripcion}</a></div>
                </div>
              </div>
              <div className="w-9 h-9 my-2 mr-3">
                <h1 className="text-md text-center">{actividad.hora}</h1>
              </div>
              </>
              : actividad.tipo === 'Solicitud Eliminada' ?
              <>
              <div className="w-9 h-9 rounded-full shrink-0 bg-red-500 my-2 mr-3">
                <svg className="w-9 h-9 fill-current text-red-50" viewBox="0 0 36 36">
                  <path d="M15 13v-3l-5 4 5 4v-3h8a1 1 0 000-2h-8zM21 21h-8a1 1 0 000 2h8v3l5-4-5-4v3z" />
                </svg>
              </div>
              <div className="grow flex items-center text-sm py-2">
                <div className="grow flex justify-between">  
                  <div className="self-center"><a className="font-medium text-slate-800 hover:text-slate-900" href="#0">{actividad.descripcion}</a></div>
                </div>
              </div>
              </>
              : actividad.tipo === 'Solicitud Rechazada' ?
              <>
              <div className="w-9 h-9 rounded-full shrink-0 bg-blue-500 my-2 mr-3">
                <svg className="w-9 h-9 fill-current text-blue-50" viewBox="0 0 36 36">
                  <path d="M15 13v-3l-5 4 5 4v-3h8a1 1 0 000-2h-8zM21 21h-8a1 1 0 000 2h8v3l5-4-5-4v3z" />
                </svg>
              </div>
              <div className="grow flex items-center text-sm py-2">
                <div className="grow flex justify-between">  
                  <div className="self-center"><a className="font-medium text-slate-800 hover:text-slate-900" href="#0">{actividad.descripcion}</a></div>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full shrink-0 bg-red-500 my-2 mr-3">
                <svg className="w-9 h-9 fill-current text-red-50" viewBox="0 0 36 36">
                  <path d="M15 13v-3l-5 4 5 4v-3h8a1 1 0 000-2h-8zM21 21h-8a1 1 0 000 2h8v3l5-4-5-4v3z" />
                </svg>
              </div>
              </>
              :
              null
              }
            </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard12;
