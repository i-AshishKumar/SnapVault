import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { ApiGatewayProvider } from './context/ApiGatewayContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <ColorModeScript initialColorMode="dark" />
    <ChakraProvider>
      <ApiGatewayProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApiGatewayProvider>
    </ChakraProvider>
  </>
);
