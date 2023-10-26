import {
    SET_PRICING_DATA,
    SET_SEARCH_TERM,
    SET_SELECTED_MARCA,
    INCREASE_QUANTITY,
    DECREASE_QUANTITY,
    ADD_TO_CART,
    OPEN_PREVIEW,
    CLOSE_PREVIEW,
  } from '../../Redux/actions/products'; // Asegúrate de usar la ruta correcta hacia el archivo de acciones
  
  const initialState = {
    pricingData: [],
    searchTerm: '',
    selectedMarca: '',
    uniqueMarcas: [],
    selectedProduct: null,
  };
  
  export const pricingDataReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_PRICING_DATA:
        return { ...state, pricingData: action.payload };
      case SET_SEARCH_TERM:
        return { ...state, searchTerm: action.payload };
      case SET_SELECTED_MARCA:
        return { ...state, selectedMarca: action.payload };
      case INCREASE_QUANTITY:
        // Implementa la lógica para aumentar la cantidad aquí
        return state;
      case DECREASE_QUANTITY:
        // Implementa la lógica para disminuir la cantidad aquí
        return state;
      case ADD_TO_CART:
        // Implementa la lógica para agregar al carrito aquí
        return state;
      case OPEN_PREVIEW:
        return { ...state, selectedProduct: action.payload };
      case CLOSE_PREVIEW:
        return { ...state, selectedProduct: null };
      default:
        return state;
    }
  };
  