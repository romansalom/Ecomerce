import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Image,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react';
import './cards.css';

function Cards() {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarca, setSelectedMarca] = useState('');
  const [uniqueMarcas, setUniqueMarcas] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [puffsFilter, setPuffsFilter] = useState('');
  const [uniquePuffs, setUniquePuffs] = useState([]);
  const [selectedModelo, setSelectedModelo] = useState('');
  const [uniqueModelos, setUniqueModelos] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [showFilters, setShowFilters] = useState(false);
  const [filteredModelos, setFilteredModelos] = useState([]);
  const [filteredPuffs, setFilteredPuffs] = useState([]);
  const [sortBy, setSortBy] = useState(''); // Estado para el criterio de ordenamiento
  const [sortDirection, setSortDirection] = useState('asc'); // Estado para la dirección de ordenamiento
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5432/api/productos/todos')
      .then((response) => {
        const dataWithQuantityZero = response.data.map((product) => ({
          ...product,
          quantity: 0,
        }));
        setPricingData(dataWithQuantityZero);
        setLoading(false);
        const uniqueMarcas = [
          ...new Set(response.data.map((product) => product.marca)),
        ];
        setUniqueMarcas(uniqueMarcas);
        const uniquePuffs = [
          ...new Set(response.data.map((product) => product.puffs.toString())),
        ];
        setUniquePuffs(uniquePuffs);
        const uniqueModelos = [
          ...new Set(response.data.map((product) => product.modelo)),
        ];
        setUniqueModelos(uniqueModelos);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedMarca) {
      const modelosFiltrados = uniqueModelos.filter((modelo) =>
        pricingData.some(
          (product) =>
            product.marca === selectedMarca && product.modelo === modelo
        )
      );
      setFilteredModelos(modelosFiltrados);

      if (selectedMarca === '') {
        setSelectedModelo('');
      } else if (!modelosFiltrados.includes(selectedModelo)) {
        setSelectedModelo('');
      }
    } else {
      setFilteredModelos(uniqueModelos);
    }
  }, [selectedMarca, uniqueModelos, pricingData, selectedModelo]);

  useEffect(() => {
    if (selectedMarca || selectedModelo) {
      const puffsFiltrados = uniquePuffs.filter((puff) =>
        pricingData.some(
          (product) =>
            (!selectedMarca || product.marca === selectedMarca) &&
            (!selectedModelo || product.modelo === selectedModelo) &&
            product.puffs.toString() === puff
        )
      );
      setFilteredPuffs(puffsFiltrados);

      if (selectedMarca === '' || selectedModelo === '') {
        setPuffsFilter('');
      }
    } else {
      setFilteredPuffs(uniquePuffs);
    }
  }, [selectedMarca, selectedModelo, uniquePuffs, pricingData]);

  const filteredPricingData = pricingData
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      selectedMarca ? product.marca === selectedMarca : true
    )
    .filter((product) =>
      puffsFilter ? product.puffs.toString() === puffsFilter : true
    )
    .filter((product) =>
      selectedModelo ? product.modelo === selectedModelo : true
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'precio') {
        return sortDirection === 'asc'
          ? a.precio - b.precio
          : b.precio - a.precio;
      }
    })
    .sort((a, b) => {
      // Mover los productos sin stock al final de la lista
      if (a.stock === 0 && b.stock !== 0) {
        return 1; // Coloca "a" después de "b"
      } else if (b.stock === 0 && a.stock !== 0) {
        return -1; // Coloca "a" antes de "b"
      } else {
        return 0; // Mantén el orden actual
      }
    });

  const openPreview = (product) => {
    setSelectedProduct(product);
  };

  const closePreview = () => {
    setSelectedProduct(null);
  };

  const handleSortBy = (criteria) => {
    if (sortBy === criteria) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortDirection('asc');
    }
  };
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  const agregarProductoAlCarrito = async () => {
    try {
      const productId = selectedProduct.id;
      const productStock = selectedProduct.stock;

      // Verificar si la cantidad seleccionada es mayor que el stock disponible
      if (cantidad > productStock) {
        setMensaje('No hay suficiente stock disponible');
        setTimeout(() => {
          setMensaje('');
        }, 2000);
        return; // Salir de la función sin agregar el producto al carrito
      }

      const response = await axios.post(
        `http://localhost:5432/api/carritos/agregar-producto/${productId}/${cantidad}`
      );

      if (response.status >= 200 && response.status < 300) {
        const carritoActualizado = response.data;
        console.log(carritoActualizado);
        setMensaje(`'¡Producto agregado al carrito!'`);
        setTimeout(() => {
          setMensaje('');
          closePreview();
          window.location.reload();
        }, 1000);
        setCantidad(1);
      } else {
        throw new Error('Error al agregar producto al carrito');
      }
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      throw error;
    }
  };

  return (
    <section className="mt-4 flex justify-center">
      <div className=" mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 ">
        <header className="text-center">
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
            Product Collection
          </h2>

          <div className="mt-4 flex justify-center">
            <div className="flex flex-wrap justify-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-10">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="font-custom text-l text-center"
                    variant="bordered"
                  >
                    {selectedMarca ? selectedMarca : 'Marcas'}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem
                    className="font-custom"
                    onClick={() => setSelectedMarca('')}
                  >
                    Todas las Marcas
                  </DropdownItem>
                  {uniqueMarcas.map((marca, index) => (
                    <DropdownItem
                      className="font-custom"
                      key={index}
                      onClick={() => setSelectedMarca(marca)}
                    >
                      {marca}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="font-custom text-l text-center"
                    variant="bordered"
                  >
                    {selectedModelo ? selectedModelo : 'Modelos'}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem
                    className="font-custom"
                    onClick={() => setSelectedModelo('')}
                  >
                    Todos los Modelos
                  </DropdownItem>
                  {filteredModelos.map((modelo, index) => (
                    <DropdownItem
                      className="font-custom"
                      key={index}
                      onClick={() => setSelectedModelo(modelo)}
                    >
                      {modelo}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="font-custom text-l text-center"
                    variant="bordered"
                  >
                    {puffsFilter ? puffsFilter : 'Puffs'}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem
                    className="font-custom"
                    onClick={() => setPuffsFilter('')}
                  >
                    Todos los Puffs
                  </DropdownItem>
                  {filteredPuffs.map((puff, index) => (
                    <DropdownItem
                      className="font-custom"
                      key={index}
                      onClick={() => setPuffsFilter(puff)}
                    >
                      {puff}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <br></br>
              <br></br>

              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="font-custom text-l text-center"
                    variant="bordered"
                  >
                    {sortBy === 'name'
                      ? 'Ordenar por Nombre'
                      : sortBy === 'precio'
                      ? 'Ordenar por Precio'
                      : 'Todos'}
                    {sortBy && (
                      <span className=" ml-1">
                        {sortBy === 'name'
                          ? sortDirection === 'asc'
                            ? '▲'
                            : '▼'
                          : sortDirection === 'asc'
                          ? '▲'
                          : '▼'}
                      </span>
                    )}
                  </Button>
                </DropdownTrigger>

                <DropdownMenu>
                  <DropdownItem
                    className="font-custom"
                    onClick={() => handleSortBy('')}
                  >
                    Todos
                    {!sortBy && (
                      <span className="ml-1">
                        {' '}
                        {/* Mostrar la dirección solo si no hay sort */} ▲▼
                      </span>
                    )}
                  </DropdownItem>
                  <DropdownItem
                    className="font-custom"
                    onClick={() => handleSortBy('name')}
                  >
                    Nombre{' '}
                    {sortBy === 'name' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </DropdownItem>
                  <DropdownItem
                    className="font-custom"
                    onClick={() => handleSortBy('precio')}
                  >
                    Precio{' '}
                    {sortBy === 'precio' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <br></br>
              <br></br>
              <br></br>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Enter name"
                className=" pr-4 px-5 py-2.5 text-sm text-black rounded-full bg-white border border-green-500 w-full outline-[#007bff]"
              />
            </div>
          </div>
        </header>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4">Cargando...</p>
          </div>
        ) : filteredPricingData.length === 0 ? (
          <p>No hay productos</p>
        ) : (
          <ul className="mt-8 grid gap-20 sm:grid-cols-2 lg:grid-cols-4 ">
            {filteredPricingData.map((pricing, index) => (
              <div key={index} onClick={() => openPreview(pricing)}>
                <li>
                  <a className="group block">
                    <Image
                      alt="Card background"
                      className={`object-cover rounded-xl w-full max-h-50 sm:h-[300px] ${
                        pricing.stock === 0 ? 'blur' : ''
                      }`} // Ajusta la altura máxima y añade desenfoque si stock es 0
                      src={pricing.imageUrl}
                    />

                    <div className="mt-3 flex justify-between text-sm">
                      <div>
                        <h1
                          className={`text-gray-900 group-hover:underline group-hover:underline-offset-4r ${
                            pricing.stock <= 0 ? 'text-red-500' : ''
                          }`}
                        >
                          {pricing.name}
                        </h1>

                        <div className=" flex justify-between text-sm">
                          {pricing.stock > 0 ? (
                            <p className="text-gray-900">
                              {pricing.puffs} Puffs
                            </p>
                          ) : (
                            <p className="text-gray-900">Sin stock</p>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-900">${pricing.precio}</p>
                    </div>
                  </a>
                </li>
              </div>
            ))}
          </ul>
        )}{' '}
        {selectedProduct && selectedProduct.stock > 0 && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-white bg-opacity-90 overflow-y-auto">
            <div className="font-[sans-serif] backdrop-blur">
              {mensaje && (
                <div className="font-[sans-serif] space-y-6">
                  <div
                    className="bg-green-100 text-green-800 px-4 py-4 rounded"
                    role="alert"
                  >
                    <strong className="font-bold text-base mr-4">
                      {mensaje}
                    </strong>
                  </div>
                </div>
              )}
              <div className="p-6 lg:max-w-7xl max-w-2xl max-lg:mx-auto">
                <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="w-full lg:sticky top-0 text-center">
                    <div className="lg:h-[600px]">
                      <img
                        src={selectedProduct.imageUrl}
                        alt={selectedProduct.name}
                        className="lg:w-11/12 w-full h-full rounded-xl object-cover object-top"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-start gap-4">
                      <div>
                        <h2 className="text-2xl font-extrabold text-gray-800">
                          {selectedProduct.name} | {selectedProduct.modelo}
                        </h2>
                        <p className="text-sm text-gray-400 mt-2">
                          {selectedProduct.marca} | {selectedProduct.puffs}{' '}
                          puffs
                        </p>
                      </div>
                      <div className="ml-auto flex flex-wrap gap-4">
                        <button
                          type="button"
                          className="px-2.5 py-1.5 bg-pink-100 text-xs text-pink-600 rounded-md flex items-center"
                        >
                          {selectedProduct.stock}
                        </button>
                      </div>
                    </div>
                    <hr className="my-8" />
                    <div className="flex flex-wrap gap-4 items-start">
                      <div>
                        <p className="text-gray-800 text-3xl font-bold">
                          {selectedProduct.precio}
                        </p>
                      </div>
                    </div>
                    <hr className="my-8" />
                    <div>
                      <div className="flex flex-wrap mt-4">
                        <h3 className="text-lg mt-2 font-bold text-gray-800">
                          Seleccione la cantidad
                        </h3>
                        <select
                          value={cantidad}
                          onChange={(e) => setCantidad(e.target.value)}
                          className="block mx-auto w-16 my-2 text-center placeholder-center"
                        >
                          {Array.from(
                            { length: selectedProduct.stock },
                            (_, i) => i + 1
                          ).map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <hr className="my-8" />
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={agregarProductoAlCarrito}
                        type="button"
                        className="min-w-[200px] px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-bold rounded"
                      >
                        Agregar al Carrito
                      </button>
                      <button
                        onClick={closePreview}
                        type="button"
                        className="min-w-[200px] px-4 py-2.5 border border-red-300 bg-red-300 hover:bg-red-400 text-black-300 text-sm font-bold rounded"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Cards;
