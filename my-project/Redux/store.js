import { createStore } from 'redux';
import { pricingDataReducer } from '../Redux/reducers/products';

const store = createStore(pricingDataReducer);

export default store;