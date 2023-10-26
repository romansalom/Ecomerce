const INCREASE_QUANTITY = 'INCREASE_QUANTITY';
const DECREASE_QUANTITY = 'DECREASE_QUANTITY';
const ADD_TO_CART = 'ADD_TO_CART';
const OPEN_PREVIEW = 'OPEN_PREVIEW';
const CLOSE_PREVIEW = 'CLOSE_PREVIEW';

export function increaseQuantity(index) {
  return {
    type: INCREASE_QUANTITY,
    payload: index,
  };
}

export function decreaseQuantity(index) {
  return {
    type: DECREASE_QUANTITY,
    payload: index,
  };
}

export function addToCart(product) {
  return {
    type: ADD_TO_CART,
    payload: product,
  };
}

export function openPreview(product) {
  return {
    type: OPEN_PREVIEW,
    payload: product,
  };
}

export function closePreview() {
  return {
    type: CLOSE_PREVIEW,
  };
}
