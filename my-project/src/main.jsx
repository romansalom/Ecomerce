import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import React from 'react';
import { Provider } from 'react-redux'; // Importa Provider
import store from '../Redux/store.js'; // Importa tu tienda Redux

const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Provider store={store}> {/* Envuelve tu aplicación con Provider y pasa la tienda Redux */}
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </BrowserRouter>
);
