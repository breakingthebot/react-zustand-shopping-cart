// src/App.tsx
// Main Application Component. Coordinates the layout of Navbar, Catalog, Cart, and Checkout.
// Connects to: src/components/Navbar.tsx, src/components/ProductCatalog.tsx, src/components/Cart.tsx, src/components/CheckoutFlow.tsx, src/services/cartStore.ts
// Created: 2026-07-07

import React from 'react';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { ProductCatalog } from './components/ProductCatalog';
import { Cart } from './components/Cart';
import { CheckoutFlow } from './components/CheckoutFlow';
import { useCartStore } from './services/cartStore';

const App: React.FC = () => {
  const isCheckingOut = useCartStore((state) => state.isCheckingOut);
  const checkoutSuccess = useCartStore((state) => state.checkoutSuccess);

  const showCheckout = isCheckingOut || checkoutSuccess;

  return (
    <div className="app-layout">
      <Navbar />
      <ToastContainer />
      
      <main className="main-content">
        {showCheckout ? (
          <CheckoutFlow />
        ) : (
          <>
            <ProductCatalog />
            <Cart />
          </>
        )}
      </main>

      <footer className="global-footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} AETHERIC Space. All rights reserved.</p>
          <p className="footer-tagline">Built with React, Zustand, and TypeScript.</p>
        </div>
      </footer>

      <style>{`
        .app-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: 100%;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          background-color: var(--bg-primary);
          transition: background-color var(--transition-normal);
        }

        .global-footer {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          padding: 2.5rem 1.5rem;
          margin-top: auto;
          transition: background-color var(--transition-normal), border-color var(--transition-normal);
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.875rem;
          text-align: center;
        }

        @media (min-width: 768px) {
          .footer-content {
            flex-direction: row;
            justify-content: space-between;
          }
        }

        .footer-tagline {
          font-size: 0.8125rem;
        }
      `}</style>
    </div>
  );
};

export default App;
