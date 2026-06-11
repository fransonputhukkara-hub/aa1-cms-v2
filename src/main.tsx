import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartContext';
import { SiteContentProvider } from './lib/SiteContentContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <SiteContentProvider>
          <App />
        </SiteContentProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);
