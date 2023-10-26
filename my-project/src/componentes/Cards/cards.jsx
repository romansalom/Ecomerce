import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cards() {
  const [pricingData, setPricingData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarca, setSelectedMarca] = useState(''); 
  const [uniqueMarcas, setUniqueMarcas] = useState([]); 

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/productos/todos')
      .then((response) => {
        const dataWithQuantityZero = response.data.map((product) => ({
          ...product,
          quantity: 0,
        }));
        setPricingData(dataWithQuantityZero);
  
        // Obtener marcas únicas
        const uniqueMarcas = [...new Set(response.data.map((product) => product.marca))];
        setUniqueMarcas(uniqueMarcas);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

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
    // Restablecer la cantidad a cero después de agregar al carrito
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
  );
  return (
    <div className="bg-white bg-gray">
      <div className="mt-4">TODOS LOS PRODUCTOS</div>
      <div className="container px-6 py-8 mx-auto">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <select
  value={selectedMarca}
  onChange={(e) => setSelectedMarca(e.target.value)}
  className="w-full p-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
>
  <option value="">Todas las marcas</option>
  {uniqueMarcas.map((marca, index) => (
    <option key={index} value={marca}>
      {marca}
    </option>
  ))}
</select>
        <div className="h-9"></div>
        {filteredPricingData.length === 0 ? ( // Verificar si no hay productos
          <p>No hay productos</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredPricingData.map((pricing, index) => (
              <div
                key={index}
                className="p-8 text-center bg-gray-100 border border-gray-300 rounded-lg shadow-xl hover:shadow-lg"
              >
                <div className="flex-shrink-0">
                  <h2 className="inline-flex items-center justify-center px-2 font-semibold tracking-tight text-black uppercase rounded-lg bg-gray-00 dark:bg-gray">
                    {pricing.name}
                  </h2>
                </div>
                <div className="h-2"></div>
                <div className="flex-shrink-0">
                  <h3
                    className="inline-flex items-center justify-center px-2 font-semibold tracking-tight text-black uppercase rounded-lg bg-gray-00 dark:bg-gray"
                    style={{ fontSize: '1.2em' }}
                  >
                    Precio: ${pricing.precio}
                  </h3>
                </div>
                <div className="h-2"></div>
                <ul className="flex-1 space-y-4">
                  <li className="text-gray-500 dark:text-gray-400">Sabor: {pricing.flavor}</li>
                  <li className="text-gray-500 dark:text-gray-400">Puffs: {pricing.puffs}</li>
                  <li className="text-gray-500 dark:text-gray-400">Marca: {pricing.marca}</li>
                </ul>
                <div className="h-2"></div>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => decreaseQuantity(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                    disabled={pricing.quantity === 0} // Deshabilitar si la cantidad es 0
                  >
                    <span style={{ fontSize: '1.25em' }}>-</span>
                  </button>
                  <span className="text-xl">{pricing.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(index)}
                    className="bg-green-500 hover-bg-green-600 text-white px-4 py-2 rounded-xl"
                    disabled={pricing.quantity >= pricing.stock} // Deshabilitar si alcanza el stock
                  >
                    <span style={{ fontSize: '1.25em' }}>+</span>
                  </button>
                </div>
                <div className="h-2"></div>
                <button
                  onClick={() => addToCart(pricing)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
                >
                  Agregar al Carrito
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cards;
