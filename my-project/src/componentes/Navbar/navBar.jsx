import { useState, useEffect } from 'react';
import InicioSesionModal from '../../pages/home/inisiosession';
import RegistroModal from '../../pages/home/register';
import axios from 'axios';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Image,
  Navbar,
  NavbarContent,
  NavbarItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Avatar,
} from '@nextui-org/react';
function Navbars() {
  const [open, setOpen] = useState(true);
  const [inicioSesionModalIsOpen, setInicioSesionModalIsOpen] = useState(false);
  const [registroModalIsOpen, setRegistroModalIsOpen] = useState(false);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [carrito, setCarrito] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalPlacement] = useState('bottom-center');
  const [usuario, setUsuario] = useState({});
  useEffect(() => {
    // Aquí debes poner la lógica para verificar si el usuario está autenticado.
    // Por ejemplo, puedes comprobar si tienes un token de autenticación en el almacenamiento local.

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      setUsuarioAutenticado(true);
      obtenerContenidoCarrito(userId);
    } else {
      setUsuarioAutenticado(false);
    }
  }, []);
  const obtenerContenidoCarrito = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `http://localhost:5432/api/carritos/carrito/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Asegúrate de reemplazar 'token' con el valor real del token
          },
        }
      );
      setCarrito(response.data); // Almacenar el contenido del carrito en el estado
    } catch (error) {
      console.error('Error al obtener el contenido del carrito:', error);
    }
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
  const totalCarrito = carrito
    ? carrito.Productos.reduce((total, product) => {
        return total + product.precio * product.CarritoProducto.cantidad;
      }, 0)
    : 0;

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5432/api/users/log', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsuario(response.data.user);
      })
      .catch((error) => {
        console.error('Error al obtener la información del usuario:', error);
      });
  }, []);

  return (
    <div className="min-s-screen">
      <div className="antialiased bg-gray-100 dark-mode:bg-gray-900">
        <div className="w-full text-black bg-white dark-mode:text-gray-200 dark-mode:bg-gray-800">
          <div className="max-w-screen-xl px-4 mx-auto md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4">
              <div className="flex items-center mb-4 md:mb-0">
                <a
                  href="/"
                  className="text-xl font-semibold tracking-widest text-black uppercase rounded-lg dark-mode:text-white focus:outline-none focus:shadow-outline  hover:text-green-500"
                >
                  Vape Store{' '}
                </a>
                <button
                  className="rounded-lg md:hidden focus:outline-none focus:shadow-outline"
                  onClick={() => setOpen(!open)}
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="w-6 h-6"
                  >
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
              <nav
                className={`md:flex ${
                  open ? 'flex' : 'hidden'
                } md:items-center md:justify-between md:flex-row`}
              >
                {usuarioAutenticado && (
                  <Navbar>
                    <NavbarContent></NavbarContent>

                    <Dropdown className="border border-black">
                      <DropdownTrigger>
                        <NavbarContent>
                          <NavbarItem>
                            <svg
                              className="w-8 h-8 text-green-800 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              onClick={obtenerContenidoCarrito}
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.3L19 7H7.3"
                              />
                            </svg>
                          </NavbarItem>
                        </NavbarContent>
                      </DropdownTrigger>
                      <DropdownMenu
                        variant="faded"
                        aria-label="Dropdown menu with products"
                        className="dropdown-menu-custom max-h-80 overflow-y-auto" // Agregar clase para definir altura máxima y habilitar el scrollbar
                      >
                        {carrito &&
                          carrito.Productos &&
                          carrito.Productos.map((product, index) => (
                            <DropdownItem
                              key={index}
                              className="border border-grey"
                            >
                              <div className="flex items-center">
                                <div className="img1 mr-4">
                                  <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    height="50px"
                                    width="50px"
                                    className="rounded-full border"
                                  />
                                </div>
                                <div className="flex flex-col flex-grow">
                                  <span className="font-custom span1 mb-1">
                                    {product.name}
                                  </span>
                                  <span className="font-custom span2 mb-1">
                                    {product.puffs} Puffs
                                  </span>
                                  <span className="font-custom span2 mb-1">
                                    {product.CarritoProducto.cantidad}U
                                  </span>
                                  <span className="font-custom span2 mb-1">
                                    ${product.precio}
                                  </span>
                                </div>
                                <div className="ml-8">
                                  <button>
                                    <svg
                                      className="w-5 h-5 text-gray-800 dark:text-white"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="blue"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M11.3 6.2H5a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h11c1.1 0 2-1 2-2.1V11l-4 4.2c-.3.3-.7.6-1.2.7l-2.7.6c-1.7.3-3.3-1.3-3-3.1l.6-2.9c.1-.5.4-1 .7-1.3l3-3.1Z"
                                        clipRule="evenodd"
                                      />
                                      <path
                                        fillRule="evenodd"
                                        d="M19.8 4.3a2.1 2.1 0 0 0-1-1.1 2 2 0 0 0-2.2.4l-.6.6 2.9 3 .5-.6a2.1 2.1 0 0 0 .6-1.5c0-.2 0-.5-.2-.8Zm-2.4 4.4-2.8-3-4.8 5-.1.3-.7 3c0 .3.3.7.6.6l2.7-.6.3-.1 4.7-5Z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </DropdownItem>
                          ))}
                        <DropdownItem>
                          <div className="flex justify-center px-4 py-2 bg-gray-100 bg-blue">
                            <button onClick={onOpen} className="font-custom">
                              Desglose
                            </button>
                          </div>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <Dropdown
                      placement="bottom-left"
                      className="border border-black"
                    >
                      <DropdownTrigger>
                        <Avatar
                          isBordered
                          as="button"
                          className="transition-transform"
                        >
                          {/* Inserta el SVG aquí */}
                          <svg
                            className="w-6 h-6 text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </Avatar>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="profile" className="h-14 gap-2">
                          <p className="font-semibold">Email Logeado</p>
                          <p className="font-semibold">{usuario.email}</p>
                        </DropdownItem>

                        <DropdownItem key="analytics">Mis pedidos</DropdownItem>

                        <DropdownItem key="logout" color="danger">
                          <a
                            onClick={() => {
                              localStorage.removeItem('token');
                              localStorage.removeItem('userId');
                              setUsuarioAutenticado(false);
                            }}
                          >
                            {' '}
                            <div className="flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-red-500 dark:text-white hover:text-red-400 transition-colors duration-300"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                                />
                              </svg>
                            </div>
                          </a>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <div>
                      {' '}
                      <Modal
                        isOpen={isOpen}
                        placement={modalPlacement}
                        onOpenChange={onOpenChange}
                      >
                        <ModalContent>
                          {(onClose) => (
                            <>
                              <ModalHeader className="flex flex-col gap-1">
                                Carrito de compras
                              </ModalHeader>
                              <ModalBody>
                                <table className="w-full">
                                  <thead>
                                    <tr className="border-b border-gray-200">
                                      <Popover placement="right">
                                        <PopoverTrigger>
                                          <div>
                                            {' '}
                                            <th
                                              className="py-2 text-left"
                                              style={{ paddingLeft: '0px' }}
                                            >
                                              Nombre
                                            </th>
                                          </div>
                                        </PopoverTrigger>
                                        <PopoverContent>Imagen</PopoverContent>
                                      </Popover>
                                      <th
                                        className="py-2 text-left"
                                        style={{ paddingLeft: '10px' }}
                                      >
                                        Marca
                                      </th>
                                      <th
                                        className="py-2 text-left"
                                        style={{ paddingLeft: '5px' }}
                                      >
                                        Puffs
                                      </th>
                                      <th
                                        className="py-2 text-left"
                                        style={{ paddingLeft: '5px' }}
                                      >
                                        U
                                      </th>
                                      <th
                                        className="py-2 text-left"
                                        style={{ paddingLeft: '0px' }}
                                      >
                                        U/$
                                      </th>
                                      <th
                                        className="py-2 text-left"
                                        style={{ paddingLeft: '0px' }}
                                      >
                                        Total
                                      </th>
                                      {/* Espacio para el botón de eliminación */}
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {carrito &&
                                      carrito.Productos &&
                                      carrito.Productos.map(
                                        (product, index) => (
                                          <tr
                                            key={index}
                                            className="border-b border-gray-200"
                                          >
                                            {' '}
                                            <Popover placement="right">
                                              <PopoverTrigger>
                                                <td
                                                  className="font-custom span2 mb-1"
                                                  style={{
                                                    verticalAlign: 'middle',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                  }}
                                                >
                                                  {product.name}
                                                </td>
                                              </PopoverTrigger>

                                              <PopoverContent>
                                                <Image
                                                  src={product.imageUrl}
                                                  alt={product.name}
                                                  height="100px"
                                                  width="100px"
                                                />
                                              </PopoverContent>
                                            </Popover>
                                            <td className="px-4 py-2 font-custom span2 mb-1">
                                              {product.marca}
                                            </td>
                                            <td
                                              className="px-4 py-2 font-custom span2 mb-1"
                                              style={{ paddingLeft: '10px' }}
                                            >
                                              {product.puffs}
                                            </td>
                                            <td
                                              className="px-4 py-2 font-custom span2 mb-1"
                                              style={{ paddingLeft: '5px' }}
                                            >
                                              {product.CarritoProducto.cantidad}{' '}
                                            </td>
                                            <td
                                              className="px-4 py-2 font-custom span2 mb-1 "
                                              style={{ paddingLeft: '0px' }}
                                            >
                                              ${product.precio}
                                            </td>
                                            <td
                                              className="px-4 py-2 font-custom span2 mb-1"
                                              style={{ paddingLeft: '10px' }}
                                            >
                                              {`${(
                                                product.CarritoProducto
                                                  .cantidad * product.precio
                                              )
                                                .toString()
                                                .slice(0, 7)}`}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                  </tbody>
                                </table>
                                <div className="flex justify-center px-4 py-2 bg-gray-100 bg-blue">
                                  <span className="font-custom">
                                    Total del carrito:
                                  </span>
                                  {carrito && carrito.Productos ? (
                                    <span className="font-custom">
                                      ${totalCarrito.toFixed(2)}
                                    </span>
                                  ) : (
                                    <span className="font-custom">$0.00</span>
                                  )}
                                </div>
                              </ModalBody>

                              <ModalFooter>
                                <Button
                                  color="danger"
                                  variant="light"
                                  onPress={onClose}
                                >
                                  Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                  Pagar
                                </Button>
                              </ModalFooter>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
                    </div>
                    <NavbarContent></NavbarContent>
                  </Navbar>
                )}
                {!usuarioAutenticado && (
                  <>
                    <a
                      className="hidden md:block px-4 py-2 mt-2 md:mt-0 text-base font-semibold rounded-lg text-black md:ml-4 text-decoration-none text-reset hover:text-green-500 cursor-pointer"
                      onClick={openRegistroModal}
                    >
                      Registro
                    </a>
                    <a className="hidden md:block px-4 py-2 mt-2 md:mt-0 text-base font-semibold rounded-lg text-black md:ml-4 text-decoration-none text-reset hover:text-green-500">
                      <InicioSesionModal
                        isOpen={inicioSesionModalIsOpen}
                        onRequestClose={closeInicioSesionModal}
                      />
                    </a>
                    <div className="md:hidden">
                      <a
                        className="block px-4 py-2 mt-2 text-base font-semibold rounded-lg text-black text-decoration-none text-reset hover:text-green-500 cursor-pointer"
                        onClick={openRegistroModal}
                      >
                        Registro
                      </a>
                      <InicioSesionModal
                        isOpen={inicioSesionModalIsOpen}
                        onRequestClose={closeInicioSesionModal}
                      />
                    </div>
                  </>
                )}
                <RegistroModal
                  isOpen={registroModalIsOpen}
                  onRequestClose={closeRegistroModal}
                />
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbars;
