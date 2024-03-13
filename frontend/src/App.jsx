import React, { useEffect } from 'react';
import AnimatedRoutes from './utils/AnimatedRoutes';
import './css/style.css';
import './charts/ChartjsConfig';
import AppLogout from './utils/AppLogout';


function App() {

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]);


  return (
      <AppLogout>
        <AnimatedRoutes />
      </AppLogout>
  );
}

export default App;
