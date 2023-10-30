import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      .get('http://localhost:3001/api/productos/todos')
      .then((response) => {
        const dataWithQuantityZero = response.data.map((product) => ({
          ...product,
          quantity: 0,
        }));
        setPricingData(dataWithQuantityZero);
        setLoading(false); // Marcar la carga como completa
        const uniqueMarcas = [...new Set(response.data.map((product) => product.marca))];
        setUniqueMarcas(uniqueMarcas);
        const uniquePuffs = [...new Set(response.data.map((product) => product.puffs.toString()))];
        setUniquePuffs(uniquePuffs);
        const uniqueModelos = [...new Set(response.data.map((product) => product.modelo))];
        setUniqueModelos(uniqueModelos);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false); // Marcar la carga como completa en caso de error
      });
  }, []);

  useEffect(() => {
    if (selectedMarca) {
      const modelosFiltrados = uniqueModelos.filter(
        (modelo) =>
          pricingData.some(
            (product) => product.marca === selectedMarca && product.modelo === modelo
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
    if ((updatedPricingData[index].quantity ?? 0) < (updatedPricingData[index].stock ?? 0)) {
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
      <h1 className="text-4xl text-black font-bold">TODOS LOS PRODUCTOS</h1>
    </div>
    <div className="mb-4 text-center">
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-48 p-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
    <button
      onClick={() => setShowFilters(!showFilters)}
      className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-lg focus:outline-none"
    >
      Filtros {showFilters ? "▲" : "▼"}
    </button>
    {showFilters && (
      <div className="mt-4">
        <div className="flex space-x-4">
          <select
            value={selectedMarca}
            onChange={(e) => setSelectedMarca(e.target.value)}
            className="w-28 p-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
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
            className="w-28 p-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
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
            className="w-28 p-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Puffs</option>
            {filteredPuffs.map((puff, index) => (
              <option key={index} value={puff}>
                {puff}
              </option>
            ))}
          </select>
        </div>
      </div>
    )}
    {loading ? (
      <div className="text-center my-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500">
        <p>Cargando...</p>
        </div>
      </div>
    ) : filteredPricingData.length === 0 ? (
      <p>No hay productos</p>
    ) : (
      <div className="container px-6 py-8 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredPricingData.map((pricing, index) => (
            <div
              key={index}
              className="p-3 transform scale-80 text-center bg-gray-100 border border-gray-300 rounded-lg shadow-xl hover:shadow-lg"
            >
              <div className="flex-shrink-0 mt-2">
                <img src={pricing.imageUrl} alt={pricing.name} className="w-24 h-24 mx-auto mb-2 rounded-full" />
                <h2 className="text-2xl font-semibold text-black mb-2">{pricing.name}</h2>
              </div>
              <div className="flex-shrink-0">
                <h3 className="text-1xl font-semibold text-black">{pricing.modelo}</h3>
                <div className="h-2"></div>
                <h3 className="text-2xl font-semibold text-black">${pricing.precio}</h3>
              </div>
              <div className="h-2"></div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Sabor: {pricing.flavor}</li>
                <li>{pricing.puffs} Puffs</li>
                <li>{pricing.marca}</li>
              </ul>
              <div className="h-2"></div>
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => decreaseQuantity(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-1 py-1 rounded-lg"
                  disabled={pricing.quantity === 0}
                >
                  <span style={{ fontSize: '1em' }}>-</span>
                </button>
                <span className="text-base">{pricing.quantity}</span>
                <button
                  onClick={() => increaseQuantity(index)}
                  className="bg-green-500 hover:bg-green-600 text-white px-1 py-1 rounded-lg"
                  disabled={pricing.quantity >= pricing.stock}
                >
                  <span style={{ fontSize: '1em' }}>+</span>
                </button>
              </div>
              <div className="h-2"></div>
              <button
                onClick={() => addToCart(pricing)}
                className="mt-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg"
              >
                Agregar al Carrito
              </button>
              <div className="mt-2">
                <button
                  onClick={() => openPreview(pricing)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded-lg"
                >
                  Ver más
                </button>
              </div>
            </div>
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
            <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-48 h-48 mx-auto mb-4 rounded-full" />
            <h2 className="text-2xl font-semibold text-black mb-2">{selectedProduct.name}</h2>
            <p className="text-lg text-gray-700 mb-4">${selectedProduct.precio}</p>
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
);}

export default Cards;
