import { useState, useEffect } from 'react';
import InicioSesionModal from '../../pages/home/inisiosession';
import RegistroModal from '../../pages/home/register';
import axios from 'axios';
import './navBar.css';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Navbar,
  NavbarContent,
  NavbarItem,
  Modal,
  ModalContent,
  Button,
  useDisclosure,
  Avatar,
  Image,
  ScrollShadow,
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
  const [confirmacionModalIsOpen, setConfirmacionModalIsOpen] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [mensajePagar, setMensajemensajePagar] = useState('');

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
  const PagarButton = () => {
    // Asegúrate de que 'carrito' y 'totalCarrito' estén definidos y accesibles en este contexto

    // Desglose de productos con doble salto de línea
    const desgloseProductos = carrito?.Productos.map((producto) => {
      return `${producto.name} (Modelo: ${producto.marca}, Cantidad: ${
        producto.CarritoProducto.cantidad
      }, Precio Unitario: ${producto.precio.toFixed(2)})`;
    }).join('\n\n'); // Doble salto de línea entre productos

    // Total del carrito
    const total = totalCarrito.toFixed(2);

    // Preparar el mensaje para WhatsApp
    const mensajeWhatsApp = `Productos en el carrito:\n${desgloseProductos}\n\nTotal a pagar: ${total}\n\n Link de transferencia : https://link.mercadopago.com.ar/vapestoremagsprueba \n\n Responder el mensaje con direccion de entrega , rango horario y metodo de pago.`;

    // Codificar el mensaje para la URL
    const mensajeWhatsAppCodificado = encodeURIComponent(mensajeWhatsApp);

    // Crear la URL de WhatsApp
    const urlWhatsApp = `https://wa.me/+5491141666604?text=${mensajeWhatsAppCodificado}`;

    // Redirigir a WhatsApp
    window.open(urlWhatsApp, '_blank');
    setCarrito(null);
    setMensajemensajePagar('En un Tiempo nos pondremos en contacto');
  };

  // No olvides reemplazar '+5491164339338' con tu número de WhatsApp

  // No olvides reemplazar '+5491164339338' con tu número de WhatsApp

  // No olvides reemplazar 'nombre', 'cantidad' y 'precio' con las propiedades correctas de tus objetos de producto
  const eliminarProductoDelCarrito = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `http://localhost:5432/api/carritos/eliminar-producto/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Actualizar el contenido del carrito después de eliminar el producto
      obtenerContenidoCarrito();

      setMensaje('Producto eliminado con éxito');

      // Establecer un temporizador para limpiar el mensaje después de 3 segundos (3000 milisegundos)
      setTimeout(() => {
        setMensaje('');
      }, 4000);
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
    }
  };

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
                          <NavbarItem onClick={obtenerContenidoCarrito}>
                            <svg
                              className="w-8 h-8 text-green-800 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              onClick={onOpen}
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
                        scrollBehavior={'outside'}
                      >
                        <ModalContent>
                          <>
                            <section className="contenedores-zoom">
                              {mensaje && (
                                <div
                                  className="bg-red-100 text-red-800 px-4 py-4 rounded"
                                  role="alert"
                                >
                                  <strong className="font-bold text-base mr-4">
                                    {mensaje}
                                  </strong>
                                </div>
                              )}
                              {mensajePagar && (
                                <div
                                  className="bg-blue-100 text-blue-800 px-4 py-4 rounded"
                                  role="alert"
                                >
                                  <strong className="font-bold text-base mr-4">
                                    Info!
                                  </strong>
                                  <span className="block text-sm sm:inline max-sm:mt-1">
                                    {mensajePagar}
                                  </span>
                                </div>
                              )}

                              <div className=" mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                                <div className="mx-auto max-w-3xl">
                                  <header className="text-center">
                                    <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                                      Mi Carrito
                                    </h1>
                                  </header>

                                  <div className="mt-8">
                                    <ul className="space-y-4">
                                      <ScrollShadow>
                                        {carrito &&
                                          carrito.Productos &&
                                          carrito.Productos.map(
                                            (product, index) => (
                                              <li
                                                key={index}
                                                className="flex items-center gap-6 mt-3"
                                              >
                                                <Image
                                                  src={product.imageUrl}
                                                  alt={product.name}
                                                  height="50px"
                                                  width="50px"
                                                  className="size-16 rounded object-cover"
                                                />

                                                <div>
                                                  <h3 className="text-sm text-gray-900">
                                                    {product.name}{' '}
                                                  </h3>

                                                  <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                                                    <div>
                                                      <dt className="inline">
                                                        {product.puffs} Puffs
                                                      </dt>
                                                    </div>
                                                    <div>
                                                      <dt className="inline">
                                                        {product.flavor}
                                                      </dt>
                                                    </div>
                                                    <div>
                                                      <dt className="inline">
                                                        ${product.precio}
                                                      </dt>
                                                    </div>
                                                  </dl>
                                                </div>

                                                <div className="flex flex-1 items-center justify-end gap-2">
                                                  <span className="sr-only">
                                                    Remove item
                                                  </span>
                                                  <dt className="inline">
                                                    {
                                                      product.CarritoProducto
                                                        .cantidad
                                                    }
                                                    U
                                                  </dt>
                                                  <Button
                                                    color="error"
                                                    onClick={() => {
                                                      setConfirmacionModalIsOpen(
                                                        true
                                                      );
                                                      setProductoAEliminar(
                                                        product
                                                      );
                                                    }}
                                                  >
                                                    {' '}
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      strokeWidth="1.5"
                                                      stroke="currentColor"
                                                      className="h-4 w-4"
                                                    >
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                      />
                                                    </svg>
                                                  </Button>
                                                </div>
                                              </li>
                                            )
                                          )}
                                      </ScrollShadow>
                                    </ul>

                                    <div className=" flex justify-end border-t border-gray-100 pt-8">
                                      <div className="w-full max-w-lg md:w-screen md:max-w-full space-y-4">
                                        <dl className="space-y-0.5 text-sm text-gray-700">
                                          <div className="flex justify-between !text-base font-medium">
                                            <dt>Total</dt>
                                            <dd>
                                              {carrito && carrito.Productos ? (
                                                <span className="font-custom">
                                                  ${totalCarrito.toFixed(2)}{' '}
                                                  {/* Mostrar el botón Pagar solo en pantallas pequeñas */}
                                                  <Button
                                                    color="primary"
                                                    onClick={PagarButton}
                                                  >
                                                    Pagar
                                                  </Button>
                                                </span>
                                              ) : (
                                                <span className="font-custom">
                                                  $0.00
                                                </span>
                                              )}
                                            </dd>
                                          </div>
                                        </dl>
                                        {/* Contenedor para el botón Pagar en pantallas grandes */}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </section>
                          </>
                        </ModalContent>
                      </Modal>
                      {/* Modal de confirmación para eliminar producto */}
                      <Modal
                        isOpen={confirmacionModalIsOpen}
                        placement="center"
                      >
                        <ModalContent>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-gray-900">
                              ¿Estás seguro de eliminar el producto?
                            </p>
                            <div className="mt-4 space-x-4">
                              <Button
                                color="danger"
                                onClick={() => {
                                  eliminarProductoDelCarrito(
                                    productoAEliminar.id
                                  );
                                  setConfirmacionModalIsOpen(false);
                                }}
                              >
                                Eliminar
                              </Button>
                              <Button
                                color="success"
                                onClick={() =>
                                  setConfirmacionModalIsOpen(false)
                                }
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
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
