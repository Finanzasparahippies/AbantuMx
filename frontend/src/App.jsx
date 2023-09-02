import React, { useEffect } from 'react';
import AnimatedRoutes from './utils/AnimatedRoutes';
import './css/style.css';
import './charts/ChartjsConfig';
import AppLogout from './utils/AppLogout';
import Login from './pages/Login';
import API from './utils/API';

function App() {

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]);

  if (!localStorage.getItem('token')) {
    return <Login />;
  } else {
    const checkToken = async () => {
      await API.post('/api/users/check-token/', {
        token: localStorage.getItem('token')
      }).then(res => {
        console.log(res.data.message);
      }).catch(err => {
          localStorage.clear();
          window.location.href = '/';
      });
  }   
  checkToken();
  }

  return (
      <AppLogout>
        <AnimatedRoutes />
      </AppLogout>
  );
}

export default App;
