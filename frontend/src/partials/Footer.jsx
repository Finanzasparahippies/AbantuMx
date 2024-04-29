import React from 'react';

function Footer() {

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 py-2">
        <p className="text-gray-700 text-md">© {Date().slice(11, 15)} - Desarrollado por Abantu</p>
    </div>
    );
}


export default Footer;