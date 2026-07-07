// src/components/Navbar.tsx
// Global navigation header component. Displays brand and cart controls.
// Connects to: src/services/cartStore.ts, src/components/Cart.tsx
// Created: 2026-07-07

import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../services/cartStore';

export const Navbar: React.FC = () => {
  const toggleCart = useCartStore((state) => state.toggleCart);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [animateBadge, setAnimateBadge] = useState(false);

  // Trigger badge bump animation on count change
  useEffect(() => {
    if (totalItems === 0) return;
    setAnimateBadge(true);
    const timer = setTimeout(() => setAnimateBadge(false), 300);
    return () => clearTimeout(timer);
  }, [totalItems]);

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-brand" onClick={() => useCartStore.getState().resetCheckout()}>
          <span className="brand-dot"></span>
          <span className="brand-text">AETHERIC</span>
        </div>

        <button 
          onClick={toggleCart} 
          className="cart-button" 
          aria-label="Toggle Shopping Cart"
        >
          <ShoppingCart className="cart-icon" size={20} />
          {totalItems > 0 && (
            <span className={`cart-badge ${animateBadge ? 'bump' : ''}`}>
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <style>{`
        .navbar-container {
          position: sticky;
          top: 0;
          z-index: 40;
          width: 100%;
          background: var(--bg-glass);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-glass);
          transition: background-color var(--transition-normal);
        }

        .navbar-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.25rem;
          letter-spacing: 0.15em;
          color: var(--text-primary);
        }

        .brand-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--accent-color);
          box-shadow: 0 0 10px var(--accent-color);
        }

        .brand-text {
          background: linear-gradient(135deg, var(--text-primary) 30%, var(--accent-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .cart-button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.75rem;
          height: 2.75rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .cart-button:hover {
          border-color: var(--accent-color);
          background-color: var(--accent-light);
          color: var(--accent-color);
          transform: translateY(-1px);
        }

        .cart-icon {
          transition: transform var(--transition-fast);
        }

        .cart-button:hover .cart-icon {
          transform: scale(1.05);
        }

        .cart-badge {
          position: absolute;
          top: -0.25rem;
          right: -0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 1.25rem;
          height: 1.25rem;
          padding: 0 0.25rem;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: var(--radius-full);
          background-color: var(--accent-color);
          color: white;
          border: 2px solid var(--bg-primary);
        }

        .cart-badge.bump {
          animation: badgeBump 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};
