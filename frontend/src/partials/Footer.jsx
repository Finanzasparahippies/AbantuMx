import React from 'react';

function Footer() {

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 v-full h-full">
        <p className="text-gray-500 text-xs">© {Date().slice(11, 15)} - Desarrollado por Jero Guzmán</p>
    </div>
    );
}


export default Footer;