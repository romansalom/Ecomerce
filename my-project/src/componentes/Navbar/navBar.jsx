import React, { useState, useEffect } from 'react';
import InicioSesionModal from '../../pages/home/inisiosession';
import RegistroModal from '../../pages/home/register';

function Navbar() {
  const [open, setOpen] = useState(true);
  const [inicioSesionModalIsOpen, setInicioSesionModalIsOpen] = useState(false);
  const [registroModalIsOpen, setRegistroModalIsOpen] = useState(false);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false); // Agrega este estado

  useEffect(() => {
    // Aquí debes poner la lógica para verificar si el usuario está autenticado.
    // Por ejemplo, puedes comprobar si tienes un token de autenticación en el almacenamiento local.

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      setUsuarioAutenticado(true);
    } else {
      setUsuarioAutenticado(false);
    }
  }, []);

  const openInicioSesionModal = () => {
    setInicioSesionModalIsOpen(true);
  };

  const closeInicioSesionModal = () => {
    setInicioSesionModalIsOpen(false);
  };

  const openRegistroModal = () => {
    setRegistroModalIsOpen(true);
  };

  const closeRegistroModal = () => {
    setRegistroModalIsOpen(false);
  };

  return (
    <div className="min-s-screen">
      <div className="antialiased bg-gray-100 dark-mode:bg-gray-900">
        <div className="w-full text-black bg-white dark-mode:text-gray-200 dark-mode:bg-gray-800">
          <div className="max-w-screen-xl px-4 mx-auto md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4">
              <div className="flex items-center mb-4 md:mb-0">
                <a href="/" className="text-xl font-semibold tracking-widest text-black uppercase rounded-lg dark-mode:text-white focus:outline-none focus:shadow-outline">
                  Flowtrail UI
                </a>
                <button className="rounded-lg md:hidden focus:outline-none focus:shadow-outline" onClick={() => setOpen(!open)}>
                  <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                    {open ? (
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    ) : (
                      <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    )}
                  </svg>
                </button>
              </div>
              <nav className={`md:flex ${open ? 'flex' : 'hidden'} md:items-center md:justify-between md:flex-row`}>
                <a
                  className="px-4 py-2 mt-2 md:mt-0 text-base font-semibold rounded-lg text-black md:ml-4 text-decoration-none text-reset hover:text-green-500"
                  href="/"
                >
                  Home
                </a>
                {usuarioAutenticado && (
                  <>
                    <a
                      className="px-4 py-2 mt-2 md:mt-0 text-base font-semibold rounded-lg text-black md:ml-4 text-decoration-none text-reset hover:text-green-500"
                      href="/perfil"
                    >
                      Perfil
                    </a>
                    <a
                      className="px-4 py-2 mt-2 md:mt-0 text-base font-semibold rounded-lg text-black md:ml-4 text-decoration-none text-reset hover:text-green-500"
                      href="/carrito"
                    >
                      Carrito
                    </a>
                    <a
                      className="px-4 py-2 mt-2 md:mt-0 text-base font-semibold rounded-lg text-black md:ml-4 text-decoration-none text-reset hover:text-green-500"
                      onClick={() => {
                        // Agrega aquí la lógica para cerrar la sesión del usuario.
                        // Esto podría incluir eliminar el token del almacenamiento local.
                        localStorage.removeItem('token');
                        localStorage.removeItem('userId');
                        setUsuarioAutenticado(false);
                      }}
                    >
                      Cerrar Sesión
                    </a>
                  </>
                )}
                {!usuarioAutenticado && (
                  <>
                    <a
                      className="px-4 py-2 mt-2 md:mt-0 text-base font-semibold rounded-lg text-black md:ml-4 text-decoration-none text-reset hover:text-green-500"
                      onClick={openInicioSesionModal}
                    >
                      Iniciar Sesión
                    </a>
                    <a
                      className="px-4 py-2 mt-2 md:mt-0 text-base font-semibold rounded-lg text-black md:ml-4 text-decoration-none text-reset hover:text-green-500"
                      onClick={openRegistroModal}
                    >
                      Registro
                    </a>
                  </>
                )}
                <InicioSesionModal isOpen={inicioSesionModalIsOpen} onRequestClose={closeInicioSesionModal} />
                <RegistroModal isOpen={registroModalIsOpen} onRequestClose={closeRegistroModal} />
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
