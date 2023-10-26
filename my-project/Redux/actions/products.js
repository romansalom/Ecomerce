// actions.js

export const SET_PRICING_DATA = 'SET_PRICING_DATA';
export const SET_SEARCH_TERM = 'SET_SEARCH_TERM';
export const SET_SELECTED_MARCA = 'SET_SELECTED_MARCA';
export const INCREASE_QUANTITY = 'INCREASE_QUANTITY';
export const DECREASE_QUANTITY = 'DECREASE_QUANTITY';
export const ADD_TO_CART = 'ADD_TO_CART';
export const OPEN_PREVIEW = 'OPEN_PREVIEW';
export const CLOSE_PREVIEW = 'CLOSE_PREVIEW';


export const setPricingData  = (data) => ({
  type: SET_PRICING_DATA,
  payload: data,
});

export const setSearchTerm = (term) => ({
  type: SET_SEARCH_TERM,
  payload: term,
});

export const setSelectedMarca = (marca) => ({
  type: SET_SELECTED_MARCA,
  payload: marca,
});

export const increaseQuantity = (index) => ({
  type: INCREASE_QUANTITY,
  payload: index,
});

export const decreaseQuantity = (index) => ({
  type: DECREASE_QUANTITY,
  payload: index,
});

export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product,
});

export const openPreview = (product) => ({
  type: OPEN_PREVIEW,
  payload: product,
});

export const closePreview = () => ({
  type: CLOSE_PREVIEW,
});
