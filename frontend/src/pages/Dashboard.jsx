import React from 'react';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import AnimatedPage from '../utils/AnimatedPage';
import DonacionesRecibidas from '../partials/dashboard/DonacionesRecibidas';
import DonacionesEnviadas from '../partials/dashboard/DonacionesEnviadas';

function Dashboard() {
  return (
    <AnimatedPage>
      <WelcomeBanner />
      <div className="dashboard-container h-screen overflow-y-auto p-8">
        <h2 className="section-title mb-4 text-2xl">Contribuciones Recientes</h2>
        <section className="dashboard-section mb-8">
          <div className="container">
            <DonacionesRecibidas />
          </div>
        </section>
        <section className="dashboard-section">
          <div className="container">
            <DonacionesEnviadas />
          </div>
        </section>
      </div>
    </AnimatedPage>
  );
}

export default Dashboard;
