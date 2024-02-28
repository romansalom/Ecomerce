import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardBody, CardHeader, Image } from '@nextui-org/react';

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

  const increaseQuantity = (index) => {
    const updatedPricingData = [...pricingData];
    if (
      (updatedPricingData[index].quantity ?? 0) <
      (updatedPricingData[index].stock ?? 0)
    ) {
      updatedPricingData[index].quantity += 1;
      setPricingData(updatedPricingData);
    }
  };

  const decreaseQuantity = (index) => {
    const updatedPricingData = [...pricingData];
    if ((updatedPricingData[index].quantity ?? 0) > 0) {
      updatedPricingData[index].quantity -= 1;
      setPricingData(updatedPricingData);
    }
  };

  const addToCart = (product) => {
    alert(`Se han agregado ${product.quantity} ${product.name} al carrito.`);
    const updatedPricingData = [...pricingData];
    updatedPricingData.forEach((item) => (item.quantity = 0));
    setPricingData(updatedPricingData);
  };

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
        <div className="mt-4">
          <div className="flex space-x-4"></div>
          <select
            value={selectedMarca}
            onChange={(e) => setSelectedMarca(e.target.value)}
            className="w-28 p-2 border border-balck rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Marcas</option>
            {uniqueMarcas.map((marca, index) => (
              <option key={index} value={marca}>
                {marca}
              </option>
            ))}
          </select>
          <select
            value={selectedModelo}
            onChange={(e) => setSelectedModelo(e.target.value)}
            className="w-28 p-2 border border-balck-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Modelos</option>
            {filteredModelos.map((modelo, index) => (
              <option key={index} value={modelo}>
                {modelo}
              </option>
            ))}
          </select>
          <select
            value={puffsFilter}
            onChange={(e) => setPuffsFilter(e.target.value)}
            className="w-28 p-2 border border-balck-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Puffs</option>
            {filteredPuffs.map((puff, index) => (
              <option key={index} value={puff}>
                {puff}
              </option>
            ))}
          </select>
          <br></br>
          <br></br>

          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48 p-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
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
                className="border-2 border-green-200"
                style={{ height: 'auto' }} // Ajusta la altura de la tarjeta según sea necesario
              >
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-center justify-center shadow-md bg-white-200">
                  <h4 className="font-bold text-lg text-center">
                    {pricing.name}
                  </h4>
                  <h5 className="text-default-500 text-center">
                    Puffs: {pricing.puffs}
                  </h5>
                  <h6 className="text-tiny uppercase font-bold text-center">
                    ${pricing.precio}
                  </h6>
                </CardHeader>

                <CardBody className="overflow-visible py-2">
                  <Image
                    alt="Card background"
                    className="object-cover rounded-xl w-full h-full flex justify-center items-center"
                    src={pricing.imageUrl}
                  />
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}
      {selectedProduct && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-300 bg-opacity-75">
          <div className="relative w-4/5 sm:w-2/3 md:w-1/2 bg-white rounded-lg shadow-2xl p-4">
            <button
              className="absolute top-2 right-2 text-red-700 hover:text-gray-800"
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
              <h2 className="text-2xl font-semibold text-black mb-2">
                {selectedProduct.name}
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                ${selectedProduct.precio}
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Sabor: {selectedProduct.flavor}</li>
                <li>{selectedProduct.puffs} Puffs</li>
                <li>{selectedProduct.marca}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cards;
