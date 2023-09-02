import React from 'react';

function WelcomeBanner() {
  return (
    <div className="relative p-4 sm:p-6 rounded-sm overflow-hidden mb-8" style={{backgroundColor: '#05E09C'}}>

      {/* Content */}
      <div className="relative">
        <h1 className="text-2xl md:text-3xl text-slate-800 font-bold mb-1">Hola, {localStorage.getItem('name')}</h1>
        <p>Bienvenido a Abantu</p>
      </div>

    </div>
  );
}

export default WelcomeBanner;
