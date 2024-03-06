import React, { useState, useEffect } from 'react';
import AnimatedPage from '../utils/AnimatedPage';
import * as Tabs from "@radix-ui/react-tabs";
import API from '../utils/API';



function Contribuciones() {

  const [contribuciones, setContribuciones] = useState([]);

  const [selectedTab, setSelectedTab] = useState("Red 100");

  const [enviadas, setEnviadas] = useState([]);
  const [recibidas, setRecibidas] = useState([]);

  const tabItems = [
    "Red 100",
    "Red 500",
    "Red 1000",
  ];

  useEffect(() => {
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
  , []);

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


  return (
    console.log(enviadas),
    console.log(recibidas),
    <AnimatedPage>
      <main className="bg-gray-100 h-screen overflow-y-auto p-4">
        <div className="p-8 bg-white rounded-lg shadow-sm mb-4">
          <h1 className="text-2xl font-semibold text-gray-700">Contribuciones</h1>
          <p className="text-sm text-gray-600">
            Aquí puedes ver tus contribuciones enviadas y recibidas en tus redes.
          </p>
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
              className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm py-1.5 px-3 rounded-lg duration-150 text-gray-500 hover:text-green-600 hover:bg-white active:bg-white/50 font-medium"
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
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody className="text-sm font-medium divide-y divide-slate-100">
                    {/* Row */}
                    {enviadas.map(donacion => (
                    <tr>
                      <td className="p-2">
                        <div className="flex items-center">
                          <svg className="shrink-0 mr-2 sm:mr-3" width="36" height="36" viewBox="0 0 36 36">
                            <circle fill="#24292E" cx="18" cy="18" r="18" />
                            <path d="M18 10.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V24c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" fill="#FFF" />
                          </svg>
                          <div className="text-slate-800">{donacion.donador}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">{donacion.red}</div>
                      </td>
                      <td className="p-2">
                        <div className="text-center text-green-500">{donacion.fecha.split('T')[0]}</div>
                      </td>
                      <td className="p-2 flex justify-center">
                        { donacion.evidencia === null ?
                        <div className="text-center">Sin evidencia</div>
                        :
                        <div className="text-center"><img src={donacion.evidencia} alt="evidencia" className="w-10 h-10" /></div>
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
          <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200">
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
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody className="text-sm font-medium divide-y divide-slate-100">
                    {/* Row */}
                    {recibidas.map(donacion => (
                    <tr>
                      <td className="p-2">
                        <div className="flex items-center">
                          <svg className="shrink-0 mr-2 sm:mr-3" width="36" height="36" viewBox="0 0 36 36">
                            <circle fill="#24292E" cx="18" cy="18" r="18" />
                            <path d="M18 10.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V24c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" fill="#FFF" />
                          </svg>
                          <div className="text-slate-800">{donacion.donador}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">{donacion.red}</div>
                      </td>
                      <td className="p-2">
                        <div className="text-center text-green-500">{donacion.fecha.split('T')[0]}</div>
                      </td>
                      <td className="p-2 flex justify-center">
                        { donacion.evidencia === null ?
                        <div className="text-center">Sin evidencia</div>
                        :
                        <div className="text-center"><img src={donacion.evidencia} alt="evidencia" className="w-10 h-10" /></div>
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
              <h2 className="font-semibold text-slate-800">Recibidas</h2>
            </header>
            <div className="p-3">
              <p className="text-center text-gray-500">No has recibido donaciones en esta red</p>
            </div>
          </div>
        )}
      </Tabs.Root>
      </main>
    </AnimatedPage>
  );
}

export default Contribuciones;