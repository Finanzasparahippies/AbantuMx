import React from 'react';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import AnimatedPage from '../utils/AnimatedPage';
import DonacionesRecibidas from '../partials/dashboard/DonacionesRecibidas';
import DonacionesEnviadas from '../partials/dashboard/DonacionesEnviadas';

function Dashboard() {
  return (
    <AnimatedPage>
      <div className="dashboard-container">
        <WelcomeBanner />
        <section className="dashboard-section">
          <div className="container">
            <h2 className="section-title">Donaciones Recibidas</h2>
            <DonacionesRecibidas />
          </div>
        </section>
        <section className="dashboard-section">
          <div className="container">
            <h2 className="section-title">Donaciones Enviadas</h2>
            <DonacionesEnviadas />
          </div>
        </section>
      </div>
    </AnimatedPage>
  );
}

export default Dashboard;
