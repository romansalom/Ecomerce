import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  fetchPricingData,
  increaseQuantity,
  decreaseQuantity,
  addToCart,
  setSearchTerm,
  setSelectedMarca,
  openPreview,
  closePreview,
} from '../../../Redux/actions/products'; // Asegúrate de importar las acciones adecuadas

class Cards extends React.Component {
  componentDidMount() {
    this.props.fetchPricingData(); // Dispatch la acción para obtener los datos
  }

  render() {
    const {
      pricingData,
      searchTerm,
      selectedMarca,
      uniqueMarcas,
      selectedProduct,
      increaseQuantity,
      decreaseQuantity,
      addToCart,
      setSearchTerm,
      setSelectedMarca,
      openPreview,
      closePreview,
    } = this.props;

  return (
    <div className="font-mono bg-white bg-gray">
      <div className="mt-4 text-2xl">TODOS LOS PRODUCTOS</div>
      <div className="container px-6 py-8 mx-auto">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48 p-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="mb-4">
          <select
            value={selectedMarca}
            onChange={(e) => setSelectedMarca(e.target.value)}
            className="w-48 p-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Todas las marcas</option>
            {uniqueMarcas.map((marca, index) => (
              <option key={index} value={marca}>
                {marca}
              </option>
            ))}
          </select>
        </div>
        <div className="h-6"></div>
        {filteredPricingData.length === 0 ? (
          <p>No hay productos</p>
        ) : (
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
    <div className="h-2"></div>
    <div className="flex-shrink-0">
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
        )}
      </div>

      {/* Modal de vista previa */}
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
  );
  
}
}
const mapStateToProps = (state) => ({
  pricingData: state.pricingData, // Asegúrate de que esto coincida con el nombre de tu reducer
  searchTerm: state.searchTerm,
  selectedMarca: state.selectedMarca,
  uniqueMarcas: state.uniqueMarcas,
  selectedProduct: state.selectedProduct,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchPricingData,
      increaseQuantity,
      decreaseQuantity,
      addToCart,
      setSearchTerm,
      setSelectedMarca,
      openPreview,
      closePreview,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Cards);
