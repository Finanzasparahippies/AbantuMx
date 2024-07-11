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
  const [redes, setRedes] = useState([]);

  useEffect(() => {
    API.get(`/api/sistema/donadores-100/${localStorage.getItem('id')}/`)
      .then((response) => {
        setDonadores(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    API.get(`/api/sistema/redes/${localStorage.getItem('id')}/`)
      .then((response) => {
        setRedes(response.data);
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
    console.log(redes),
    <AnimatedPage>
      <WelcomeBanner />
      <Tabs.Root
        className="max-w-screen-xl mt-2 mx-auto px-4 md:px-8"
        value={selectedTab}
        onValueChange={(val) => handleTabChange(val)}
        style={{ overflow: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <Tabs.List
          className="hidden bg-gray-100 py-1.5 px-2.5 rounded-lg gap-x-3 overflow-x-auto text-sm sm:flex"
          aria-label="Administra tu red"
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
        <div className="p-8">
          <section className="dashboard-section">
          {redes[tabItems.indexOf(selectedTab)]?.activa === false ?
            <div className="mt-8">
              <h2 className="section-title mb-4 font-bold text-2xl text-[#029d85]">No te has unido a esta red.</h2>
            </div>
            : null}
            <div className="container">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#03E19B] rounded-lg shadow-md py-4 border-4 border-[#029d85] px-4">
                  <h3 className="text-2xl font-semibold mb-2 text-white flex items-center justify-center">Personas en mi {selectedTab}</h3>
                  <p className="text-3xl font-bold text-white flex items-center justify-center">{donadores[0]?.count ? donadores[0].count : 0}</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Tree
                lineWidth={'6px'}
                lineColor={'#029d85'}
                lineBorderRadius={'10px'}
                label={<StyledNode style={{ backgroundColor:'#03E19B', borderColor: '#029d85', borderWidth:'4px', color:'#fff', fontSize:'20px', justifyContent: 'center', alignItems: 'center' }}>Yo<img src={localStorage.getItem('foto') !== 'null' ? localStorage.getItem('foto') : 'https://ui-avatars.com/api/?name=' + localStorage.getItem('name').charAt(0) + '&background=random'} alt="donador" className="w-10 h-10 rounded-full ml-[60px]" /><p>Código: {localStorage.getItem('codigo')}</p></StyledNode>}
              >
                {donadores.map((donador) => (
                  <TreeNode label={<StyledNode style={donador.tipo === 'B1' || donador.tipo === 'B2' ? { backgroundColor:'#fff', borderColor: '#029d85', borderWidth:'4px' } : { backgroundColor:'#03E19B', borderColor: '#029d85', borderWidth:'4px', color:'#fff' } }>{donador.donador}<img src={donador.imagen ? donador.imagen : 'https://ui-avatars.com/api/?name=' + donador.donador.charAt(0) + '&background=random'} alt="donador" className="w-10 h-10 rounded-full" /><p>Código: {donador.codigo}</p>{donador.tipo === 'B1' || donador.tipo === 'B2' ? <p className='text-[#029d85]' >Este usuario forma parte de otra red</p> : <p></p>}</StyledNode>}>
                    {donador?.donadores.map((hijo) => (
                      <TreeNode label={<StyledNode style={{ backgroundColor:'#03E19B', borderColor: '#029d85', borderWidth:'4px', color:'#fff' }}>{hijo.donador}<img src={hijo.imagen ? hijo.imagen : 'https://ui-avatars.com/api/?name=' + hijo.donador.charAt(0) + '&background=random'} alt="donador" className="w-10 h-10 rounded-full" /><p>Código: {hijo.codigo}</p></StyledNode>}>
                        {hijo?.donadores.map((nieto) => (
                          <TreeNode label={<StyledNode style={{ backgroundColor:'#03E19B', borderColor: '#029d85', borderWidth:'4px', color:'#fff' }}>{nieto.donador}<img src={nieto.imagen ? nieto.imagen : 'https://ui-avatars.com/api/?name=' + nieto.donador.charAt(0) + '&background=random'} alt="donador" className="w-10 h-10 rounded-full" /><p>Código: {nieto.codigo}</p></StyledNode>}>
                            {nieto?.donadores.map((bisnieto) => (
                              <TreeNode 
                                label={<StyledNode style={{ backgroundColor:'#03E19B', borderColor: '#029d85', borderWidth:'4px', color:'#fff' }}>{bisnieto.donador}<img src={bisnieto.imagen ? bisnieto.imagen : 'https://ui-avatars.com/api/?name=' + bisnieto.donador.charAt(0) + '&background=random'} alt="donador" className="w-10 h-10 rounded-full" /><p>Código: {bisnieto.codigo}</p></StyledNode>}>
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
    </AnimatedPage>
  );
}

export default Dashboard;
