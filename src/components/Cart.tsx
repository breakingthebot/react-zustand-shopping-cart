// src/components/Cart.tsx
// Shopping cart drawer component. Renders item list and price summaries.
// Connects to: src/services/cartStore.ts, src/components/Navbar.tsx
// Created: 2026-07-07

import React from 'react';
import { X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '../services/cartStore';
import { useToastStore } from '../services/toastStore';

export const Cart: React.FC = () => {
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const cart = useCartStore((state) => state.cart);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const startCheckout = useCartStore((state) => state.startCheckout);
  const addToast = useToastStore((state) => state.addToast);

  // Getters from store
  const getSubtotal = useCartStore((state) => state.getSubtotal());
  const getShipping = useCartStore((state) => state.getShipping());
  const getTax = useCartStore((state) => state.getTax());
  const getTotalPrice = useCartStore((state) => state.getTotalPrice());

  // Free shipping math
  const FREE_SHIPPING_THRESHOLD = 150;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - getSubtotal);
  const freeShippingProgress = Math.min(100, (getSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (!isCartOpen) return null;

  return (
    <div className="cart-backdrop" onClick={() => setCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">Shopping Cart</h2>
          <button 
            onClick={() => setCartOpen(false)} 
            className="cart-close-btn"
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {cart.length === 0 ? (
          <div className="cart-empty-state">
            <p className="empty-message">Your cart is feeling light.</p>
            <p className="empty-submessage">Explore our catalog and find something you love!</p>
            <button onClick={() => setCartOpen(false)} className="return-shop-btn">
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Free Shipping Progress */}
            <div className="free-shipping-promo">
              {remainingForFreeShipping > 0 ? (
                <p className="promo-text">
                  Add <strong>${remainingForFreeShipping.toFixed(2)}</strong> more for <strong>free shipping</strong>.
                </p>
              ) : (
                <p className="promo-text success">🎉 You qualify for <strong>free shipping!</strong></p>
              )}
              <div className="progress-bar-track">
                <div 
                  className={`progress-bar-fill ${remainingForFreeShipping === 0 ? 'complete' : ''}`}
                  style={{ width: `${freeShippingProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Items List */}
            <div className="cart-items-list">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="cart-item">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{product.name}</h4>
                    <span className="cart-item-price">${product.price.toFixed(2)}</span>
                    
                    <div className="cart-item-controls">
                      <div className="qty-picker">
                        <button
                          onClick={() => {
                            updateQuantity(product.id, quantity - 1);
                            if (quantity - 1 === 0) {
                              addToast(`Removed ${product.name} from cart.`, 'info');
                            }
                          }}
                          className="qty-btn"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-value">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="qty-btn"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          removeFromCart(product.id);
                          addToast(`Removed ${product.name} from cart.`, 'info');
                        }}
                        className="item-delete-btn"
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="cart-drawer-footer">
              <div className="pricing-rows">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>${getSubtotal.toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span>Shipping</span>
                  <span>{getShipping === 0 ? 'Free' : `$${getShipping.toFixed(2)}`}</span>
                </div>
                <div className="price-row">
                  <span>Tax (8%)</span>
                  <span>${getTax.toFixed(2)}</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>${getTotalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button onClick={startCheckout} className="checkout-trigger-btn">
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .cart-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 50;
          width: 100vw;
          height: 100vh;
          background-color: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: flex-end;
          animation: fadeIn 0.2s ease-out;
        }

        .cart-drawer {
          width: 100%;
          max-width: 440px;
          height: 100%;
          background-color: var(--bg-primary);
          box-shadow: var(--drawer-shadow);
          display: flex;
          flex-direction: column;
          border-left: 1px solid var(--border-color);
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cart-drawer-header {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
        }

        .cart-drawer-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .cart-close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .cart-close-btn:hover {
          background-color: var(--border-color);
          color: var(--text-primary);
        }

        .cart-empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
        }

        .empty-message {
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .empty-submessage {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          max-width: 240px;
        }

        .return-shop-btn {
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-md);
          background-color: var(--accent-color);
          color: white;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }

        .return-shop-btn:hover {
          background-color: var(--accent-hover);
        }

        .free-shipping-promo {
          padding: 1.25rem 1.5rem 1rem;
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }

        .promo-text {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .promo-text.success {
          color: var(--success-color);
        }

        .progress-bar-track {
          width: 100%;
          height: 6px;
          background-color: var(--border-color);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background-color: var(--accent-color);
          border-radius: var(--radius-full);
          transition: width var(--transition-normal);
        }

        .progress-bar-fill.complete {
          background-color: var(--success-color);
        }

        .cart-items-list {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .cart-item {
          display: flex;
          gap: 1rem;
          align-items: center;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-color);
        }

        .cart-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .cart-item-image {
          width: 4.5rem;
          height: 4.5rem;
          object-fit: cover;
          border-radius: var(--radius-md);
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
        }

        .cart-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .cart-item-name {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .cart-item-price {
          font-weight: 700;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .cart-item-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.25rem;
        }

        .qty-picker {
          display: flex;
          align-items: center;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background-color: var(--bg-secondary);
        }

        .qty-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.75rem;
          height: 1.75rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }

        .qty-btn:hover {
          background-color: var(--border-color);
          color: var(--text-primary);
        }

        .qty-value {
          font-size: 0.875rem;
          font-weight: 600;
          min-width: 1.5rem;
          text-align: center;
          color: var(--text-primary);
        }

        .item-delete-btn {
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: color var(--transition-fast);
        }

        .item-delete-btn:hover {
          color: var(--error-color);
        }

        .cart-drawer-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
        }

        .pricing-rows {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .price-row.total {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          border-top: 1px solid var(--border-color);
          padding-top: 0.75rem;
          margin-top: 0.25rem;
        }

        .checkout-trigger-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem;
          border-radius: var(--radius-md);
          background-color: var(--accent-color);
          color: white;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }

        .checkout-trigger-btn:hover {
          background-color: var(--accent-hover);
        }
      `}</style>
    </div>
  );
};
