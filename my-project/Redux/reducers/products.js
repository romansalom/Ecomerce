// products.js

export function pricingDataReducer(state = [], action) {
    // Declare the updatedPricingData variable once
    const updatedPricingData = [...state];
  
    switch (action.type) {
      case 'INCREASE_QUANTITY':
        updatedPricingData[action.payload].quantity += 1;
        return updatedPricingData;
      case 'DECREASE_QUANTITY':
        updatedPricingData[action.payload].quantity -= 1;
        return updatedPricingData;
      case 'ADD_TO_CART':
        updatedPricingData.forEach((item) => (item.quantity = 0));
        return updatedPricingData;
      default:
        return state;
    }
  }
  