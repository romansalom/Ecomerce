import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardBody,
  CardHeader,
  Image,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react';

function Cards() {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true); // Nuevo estado para el indicador de carga
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarca, setSelectedMarca] = useState('');
  const [uniqueMarcas, setUniqueMarcas] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [puffsFilter, setPuffsFilter] = useState('');
  const [uniquePuffs, setUniquePuffs] = useState([]);
  const [selectedModelo, setSelectedModelo] = useState('');
  const [uniqueModelos, setUniqueModelos] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredModelos, setFilteredModelos] = useState([]);
  const [filteredPuffs, setFilteredPuffs] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5432/api/productos/todos')
      .then((response) => {
        const dataWithQuantityZero = response.data.map((product) => ({
          ...product,
          quantity: 0,
        }));
        setPricingData(dataWithQuantityZero);
        setLoading(false); // Marcar la carga como completa
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
        setLoading(false); // Marcar la carga como completa en caso de error
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
    );

  const openPreview = (product) => {
    setSelectedProduct(product);
  };

  const closePreview = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="font-mono bg-white">
      <div className="bg-gray-00 py-4 text-center">
        <h1 className="text-3xl text-black  tracking-wide">
          TODOS LOS PRODUCTOS
        </h1>
      </div>

      <button
        onClick={() => setShowFilters(!showFilters)}
        className="text-white bg-black hover:bg-green-600 px-10 py-2 rounded-xl focus:outline-none"
      >
        Busquedad Perzonalizada {showFilters ? '▲' : '▼'}
      </button>
      {showFilters && (
        <div className="mt-4 flex justify-center">
          <div className="flex flex-wrap justify-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-10">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">
                  {selectedMarca ? selectedMarca : 'Marcas'}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem onClick={() => setSelectedMarca('')}>
                  Todas las Marcas
                </DropdownItem>
                {uniqueMarcas.map((marca, index) => (
                  <DropdownItem
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
                <Button variant="bordered">
                  {selectedModelo ? selectedModelo : 'Modelos'}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem onClick={() => setSelectedModelo('')}>
                  Todos los Modelos
                </DropdownItem>
                {filteredModelos.map((modelo, index) => (
                  <DropdownItem
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
                <Button variant="bordered">
                  {puffsFilter ? puffsFilter : 'Puffs'}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem onClick={() => setPuffsFilter('')}>
                  Todos los Puffs
                </DropdownItem>
                {filteredPuffs.map((puff, index) => (
                  <DropdownItem
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
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-40PX p-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-center"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4">Cargando...</p>
        </div>
      ) : filteredPricingData.length === 0 ? (
        <p>No hay productos</p>
      ) : (
        <div className="container px-6 py-8 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredPricingData.map((pricing, index) => (
              <Card
                shadow="lg"
                key={index}
                isPressable
                onClick={() => openPreview(pricing)}
                className="border-2 border-black-800 transition duration-300 ease-in-out transform hover:shadow-xl"
                style={{ height: 'auto', transform: 'scale(0.8)' }} // Reducción del 20%
              >
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-center justify-center shadow-md bg-white-200">
                  <h1 className="font-bold text-xl text-center">
                    {' '}
                    {/* Aumento de tamaño de fuente */}
                    {pricing.name}
                  </h1>
                  <h4 className="text-lg text-center">
                    {' '}
                    {/* Aumento de tamaño de fuente */}
                    Puffs: {pricing.puffs}
                  </h4>
                  <h5 className="text-base uppercase font-bold text-center">
                    {' '}
                    {/* Aumento de tamaño de fuente */}${pricing.precio}
                  </h5>
                </CardHeader>

                <CardBody className="overflow-visible py-2">
                  <Image
                    alt="Card background"
                    className="object-cover rounded-xl w-full max-h-50" // Ajusta la altura máxima
                    src={pricing.imageUrl}
                  />
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}
      {selectedProduct && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-lg p-6">
            <button
              className="absolute top-2 right-2 text-red-800 focus:outline-none"
              onClick={closePreview}
            >
              Cerrar
            </button>
            <div className="text-center">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-48 h-48 mx-auto mb-4 rounded-full"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {selectedProduct.name}
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                ${selectedProduct.precio}
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>
                  <span className="font-semibold">Sabor:</span>{' '}
                  {selectedProduct.flavor}
                </li>
                <li>
                  <span className="font-semibold">Puffs:</span>{' '}
                  {selectedProduct.puffs}
                </li>
                <li>
                  <span className="font-semibold">Marca:</span>{' '}
                  {selectedProduct.marca}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cards;
