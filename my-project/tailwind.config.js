import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ['Madimi One'], // Reemplaza "Roboto" con el nombre de tu fuente
      },
      colors: {
        // Define el secondary color como verde
        secondary: {
          DEFAULT: '#12A150', // Verde
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
