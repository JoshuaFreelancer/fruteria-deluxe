import React from 'react';
import '/src/App.css';
import logoTopImage from '/assets/images/Logo_Fruteria_deluxe_top.png';
import logoBottomImage from '/assets/images/Logo_Fruteria_deluxe_bottom.png';

const Loader = () => {
  return (
    <div>
      {/* Contenedor superior */}
      <div className="fixed top-0 left-0 w-full h-1/2 bg-gray-900 overflow-hidden animate-moveUpStart z-20">
        {/* Contenido del contenedor, si es necesario */}
      </div>

      {/* Contenedor inferior */}
      <div className="fixed bottom-0 left-0 w-full h-1/2 bg-gray-900 overflow-hidden animate-moveDownStart z-20">
        {/* Contenido del contenedor, si es necesario */}
      </div>

      {/* Parte superior del logo */}
      <img
        src={logoTopImage}
        alt="Logo Top"
        className="fixed top-52 left-1/3 transform w-45 h-45 overflow-hidden animate-moveUp z-20"
      />

      {/* Parte inferior del logo */}
      <img
        src={logoBottomImage}
        alt="Logo Bottom"
        className="fixed bottom-52 left-1/3 transform w-45 h-45 overflow-hidden animate-moveDown z-20"
      />
    </div>
  );
}

export default Loader;
