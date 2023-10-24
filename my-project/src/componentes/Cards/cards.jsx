import React, { useState } from 'react';

function Cards() {
  const [pricingData, setPricingData] = useState([
    {
      title: 'Strawberry Banana',
      price: 20000,
      billing: '$',
      features: ['5000 puffs'],
      buttonText: 'Ver Detalle',
      image: 'https://mipod.com/cdn/shop/files/Ebcreate-Bc5000_Strawmelon-Ice_600x600_52722b42-9df6-471c-9056-581857a2df2f_250x.png?v=1691609477',
      quantity: 0, // Agregamos la propiedad "quantity" inicializada en 0
    },
    {
      title: 'Strawberry Candy Cotton Ice ',
      price: 20000,
      billing: '$',
      features: ['5000 puffs'],
      buttonText: 'Ver Detalle',
      image: 'https://mipod.com/cdn/shop/files/No-Name_Strawberry-Banana_600x600_c473c883-d347-455e-b2c8-5989cb73467b_800x.png?v=1687904063',
      quantity: 0, // Agregamos la propiedad "quantity" inicializada en 0
    },
    {
      title: ' Banana Coca Zero Same',
      price: 20000,
      billing: '$',
      features: ['5000 puffs'],
      buttonText: 'Ver Detalle',
      image: 'https://cdn.shopify.com/s/files/1/0060/6869/9205/files/Ebcreate-Bc5000_Strawberry-Pina-Coloda_600x600_a2c89087-8bc1-4160-82b4-7c05d8351f50_600x.png?v=1691614533',
      quantity: 0, // Agregamos la propiedad "quantity" inicializada en 0
    },
    {
        title: 'Fume Banana Love Dick',
        price: 20000,
        billing: '$',
        features: ['5000 puffs'],
        buttonText: 'Ver Detalle',
        image: 'https://www.smokersworldhw.com/cdn/shop/products/fume-cbd_peach_ice_disposable_vape_device2_1024x1024_2x_15c4a785-3e0b-4abc-9f59-6bdea104f6a4.jpg?v=1657206233',
        quantity: 0, // Agregamos la propiedad "quantity" inicializada en 0
      },
      {
        title: 'Fume Strawberry Candy Coca Light ',
        price: 20000,
        billing: '$',
        features: ['5000 puffs'],
        buttonText: 'Ver Detalle',
        image: 'https://seedcodeliagrow.com/cdn/shop/products/VAPEFUMETROPICAL_600x600.jpg?v=1677791382',
        quantity: 0, // Agregamos la propiedad "quantity" inicializada en 0
      },
      {
        title: 'Fume Banana',
        price: 20000,
        billing: '$',
        features: ['5000 puffs'],
        buttonText: 'Ver Detalle',
        image: 'https://thesmokybox.com/cdn/shop/products/fume-extra-double-apple-device.jpg?v=1662046130',
        quantity: 0, // Agregamos la propiedad "quantity" inicializada en 0
      },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const increaseQuantity = (index) => {
    const updatedPricingData = [...pricingData];
    updatedPricingData[index].quantity += 1;
    setPricingData(updatedPricingData);
  };

  const decreaseQuantity = (index) => {
    const updatedPricingData = [...pricingData];
    if (updatedPricingData[index].quantity > 0) {
      updatedPricingData[index].quantity -= 1;
      setPricingData(updatedPricingData);
    }
  };

  const addToCart = (product) => {
    alert(`Se han agregado ${product.quantity} ${product.title} al carrito.`);
    // Restablecer la cantidad a cero después de agregar al carrito
    const updatedPricingData = [...pricingData];
    updatedPricingData.forEach((item) => (item.quantity = 0));
    setPricingData(updatedPricingData);
  };

  const filteredPricingData = pricingData.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-100">
          <div className="mt-4">TODOS LOS VAPOS</div> 
      <div className="container px-6 py-8 mx-auto ">
      <input
  type="text"
  placeholder="Buscar por nombre"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-full p-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
/>
<div className="h-9"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPricingData.map((pricing, index) => (
            <div
              key={index}
              className="p-8 text-center bg-white border-2 border-gray-200 rounded-lg dark:bg-gray-200 dark:border-gray-300"
            >
           
              <div className="flex-shrink-0">
                <img src={pricing.image} alt={pricing.title} className="w-32 h-32 mx-auto mb-4 rounded-full" />
                <h2 className="inline-flex items-center justify-center px-2 font-semibold tracking-tight text-black uppercase rounded-lg bg-gray-50 dark:bg-white">
                  {pricing.title}
                </h2>
              </div>
              <div className="flex-shrink-0">
                <span className="pt-2 text-4xl font-bold text-gray-800 uppercase dark:text-gray-500">
                  {pricing.price}
                </span>
                <span className="text-gray-500 dark:text-gray-400">{pricing.billing}</span>
              </div>
              <ul className="flex-1 space-y-4">
                {pricing.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="text-gray-500 dark:text-gray-400">
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => decreaseQuantity(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  -
                </button>
                <span className="text-xl">{pricing.quantity}</span>
                <button
                  onClick={() => increaseQuantity(index)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => addToCart(pricing)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Agregar al Carrito
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cards;