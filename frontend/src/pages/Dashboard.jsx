import WelcomeBanner from '../partials/dashboard/WelcomeBanner';

import AnimatedPage from '../utils/AnimatedPage';
import DonacionesRecibidas from '../partials/dashboard/DonacionesRecibidas';
import DonacionesEnviadas from '../partials/dashboard/DonacionesEnviadas';

function Dashboard() {

  return (
    <AnimatedPage>
        <main>
          <WelcomeBanner />        
          <div className='px-4 sm:px-6 lg:px-8 w-full max-w-9xl mx-auto mb-5'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              <DonacionesRecibidas />
            </div>
          </div>
          <div className='px-4 sm:px-6 lg:px-8 w-full max-w-9xl mx-auto'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              <DonacionesEnviadas />
            </div>
          </div>
        </main>
    </AnimatedPage>
  );
}

export default Dashboard;