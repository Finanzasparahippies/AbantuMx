import { useEffect, useState } from 'react';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import AnimatedPage from '../utils/AnimatedPage';
import DonacionesRecibidas from '../partials/dashboard/DonacionesRecibidas';
import * as Tabs from "@radix-ui/react-tabs";
import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';
import API from '../utils/API';


const StyledNode = styled.div`
  padding: 5px;
  border-radius: 8px;
  display: inline-block;
  border: 1px solid black;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  background-color: white;
`;

function Dashboard() {

  const [selectedTab, setSelectedTab] = useState("Red 100");;

  const tabItems = [
    "Red 100",
    "Red 500",
    "Red 1000",
  ];

  const [donadores, setDonadores] = useState([]);

  useEffect(() => {
    API.get(`/api/sistema/donadores-100/${localStorage.getItem('id')}/`)
      .then((response) => {
        setDonadores(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleTabChange = (val) => {
    setSelectedTab(val);
    if (val === "Red 100") {
      API.get(`/api/sistema/donadores-100/${localStorage.getItem('id')}/`)
        .then((response) => {
          setDonadores(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (val === "Red 500") {
      API.get(`/api/sistema/donadores-500/${localStorage.getItem('id')}/`)
        .then((response) => {
          setDonadores(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (val === "Red 1000") {
      API.get(`/api/sistema/donadores-1000/${localStorage.getItem('id')}/`)
        .then((response) => {
          setDonadores(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }}

  return (
    console.log(donadores),
    <AnimatedPage>
      <WelcomeBanner />
      <Tabs.Root
        className="max-w-screen-xl mt-2 mx-auto px-4 md:px-8"
        value={selectedTab}
        onValueChange={(val) => handleTabChange(val)}
      >
        <Tabs.List
          className="hidden bg-gray-100 py-1.5 px-2.5 rounded-lg gap-x-3 overflow-x-auto text-sm sm:flex"
          aria-label="Administra tu red"
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
        <div className="p-8">
          <h2 className="section-title mb-4 text-2xl">Mi {selectedTab}</h2>
          <section className="dashboard-section">
            <div className="container">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-2">Personas en mi red</h3>
                  <p className="text-3xl font-bold">{donadores[0]?.count ? donadores[0].count : 0}</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Tree
                lineWidth={'2px'}
                lineColor={'green'}
                lineBorderRadius={'10px'}
                label={<StyledNode>Yo<img src={localStorage.getItem('foto') !== 'null' ? localStorage.getItem('foto') : 'https://ui-avatars.com/api/?name=' + localStorage.getItem('name').charAt(0) + '&background=random'} alt="donador" className="w-10 h-10 rounded-full" /></StyledNode>}
              >
                {donadores.map((donador) => (
                  <TreeNode label={<StyledNode>{donador.donador}<img src={donador.imagen ? donador.imagen : 'https://ui-avatars.com/api/?name=' + donador.donador.charAt(0) + '&background=random'} alt="donador" className="w-10 h-10 rounded-full" />{donador.tipo === 'B1' || donador.tipo === 'B2' ? <p className='text-green-600' >Este usuario forma parte de otra red</p> : <p></p>}</StyledNode>}>
                    {donador?.donadores.map((hijo) => (
                      <TreeNode label={<StyledNode>{hijo.donador}<img src={hijo.imagen ? hijo.imagen : 'https://ui-avatars.com/api/?name=' + hijo.donador.charAt(0) + '&background=random'} alt="donador" className="w-10 h-10 rounded-full" /></StyledNode>}>
                        {hijo?.donadores.map((nieto) => (
                          <TreeNode label={<StyledNode>{nieto.donador}<img src={nieto.imagen ? nieto.imagen : 'https://ui-avatars.com/api/?name=' + nieto.donador.charAt(0) + '&background=random'} alt="donador" className="w-10 h-10 rounded-full" /></StyledNode>}>
                            {nieto?.donadores.map((bisnieto) => (
                              <TreeNode 
                                label={<StyledNode>{bisnieto.donador}<img src={bisnieto.imagen ? bisnieto.imagen : 'https://ui-avatars.com/api/?name=' + bisnieto.donador.charAt(0) + '&background=random'} alt="donador" className="w-10 h-10 rounded-full" /></StyledNode>}>
                              </TreeNode>
                            ))}
                          </TreeNode>
                        ))}
                      </TreeNode>
                    ))}
                  </TreeNode>
                ))}
              </Tree>      
              </div>
          </section>
        </div>
      </Tabs.Root>
      <div className="dashboard-container h-screen overflow-y-auto p-8">
        <h2 className="section-title mb-4 text-2xl">Contribuciones Recientes</h2>
        <section className="dashboard-section mb-8">
          <div className="container">
            <DonacionesRecibidas />
          </div>
        </section>
      </div>
    </AnimatedPage>
  );
}

export default Dashboard;
