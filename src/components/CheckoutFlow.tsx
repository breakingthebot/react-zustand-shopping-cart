// src/components/CheckoutFlow.tsx
// Checkout flow component handling user info forms, item summary, validation, and success screens.
// Connects to: src/services/cartStore.ts
// Created: 2026-07-07

import React, { useState } from 'react';
import { ArrowLeft, CreditCard, ShieldCheck, CheckCircle } from 'lucide-react';
import { useCartStore } from '../services/cartStore';

interface FormErrors {
  name?: string;
  email?: string;
  address?: string;
  cardNum?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

export const CheckoutFlow: React.FC = () => {
  const isCheckingOut = useCartStore((state) => state.isCheckingOut);
  const checkoutSuccess = useCartStore((state) => state.checkoutSuccess);
  const cart = useCartStore((state) => state.cart);
  const resetCheckout = useCartStore((state) => state.resetCheckout);
  const completeCheckout = useCartStore((state) => state.completeCheckout);
  
  const getSubtotal = useCartStore((state) => state.getSubtotal());
  const getShipping = useCartStore((state) => state.getShipping());
  const getTax = useCartStore((state) => state.getTax());
  const getTotalPrice = useCartStore((state) => state.getTotalPrice());

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [processing, setProcessing] = useState(false);

  if (!isCheckingOut && !checkoutSuccess) return null;

  // Render Success screen if order completed
  if (checkoutSuccess) {
    return (
      <div className="checkout-success-container">
        <div className="success-card">
          <CheckCircle className="success-icon animate-pop" size={64} />
          <h2 className="success-title">Order Confirmed</h2>
          <p className="success-message">
            Thank you for your purchase. We have received your order and sent a confirmation email to <strong>{email || 'your address'}</strong>.
          </p>
          <div className="success-divider"></div>
          <button onClick={resetCheckout} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>

        <style>{`
          .checkout-success-container {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 5rem 1.5rem;
            min-height: 70vh;
            width: 100%;
          }

          .success-card {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            padding: 3rem;
            max-width: 500px;
            width: 100%;
            text-align: center;
            box-shadow: var(--popover-shadow);
          }

          .success-icon {
            color: var(--success-color);
            margin: 0 auto 1.5rem;
          }

          .success-title {
            font-family: var(--font-heading);
            font-size: 2rem;
            font-weight: 800;
            color: var(--text-primary);
            margin-bottom: 0.75rem;
          }

          .success-message {
            color: var(--text-secondary);
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 2rem;
          }

          .success-divider {
            height: 1px;
            background-color: var(--border-color);
            margin-bottom: 2rem;
          }

          .continue-shopping-btn {
            width: 100%;
            padding: 0.875rem;
            border-radius: var(--radius-md);
            background-color: var(--accent-color);
            color: white;
            border: none;
            font-weight: 600;
            cursor: pointer;
            transition: background-color var(--transition-fast);
          }

          .continue-shopping-btn:hover {
            background-color: var(--accent-hover);
          }

          .animate-pop {
            animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          @keyframes pop {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // Basic Form Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!name.trim()) newErrors.name = 'Full name is required';
    
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!address.trim()) newErrors.address = 'Shipping address is required';
    
    // Simple credit card validations (length checks)
    const rawCard = cardNum.replace(/\s+/g, '');
    if (!rawCard) {
      newErrors.cardNum = 'Card number is required';
    } else if (!/^\d{16}$/.test(rawCard)) {
      newErrors.cardNum = 'Please enter a valid 16-digit card number';
    }

    if (!cardExpiry) {
      newErrors.cardExpiry = 'Expiry is required';
    } else if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      newErrors.cardExpiry = 'Format MM/YY';
    }

    if (!cardCvv) {
      newErrors.cardCvv = 'CVV required';
    } else if (!/^\d{3,4}$/.test(cardCvv)) {
      newErrors.cardCvv = 'Invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setProcessing(true);
    // Simulate payment authorization
    setTimeout(() => {
      setProcessing(false);
      completeCheckout();
    }, 1500);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-back-link" onClick={resetCheckout}>
        <ArrowLeft size={16} />
        <span>Back to Store</span>
      </div>

      <div className="checkout-layout">
        {/* Form Panel */}
        <form onSubmit={handleSubmit} className="checkout-form-panel">
          <h2 className="section-title">Shipping & Payment</h2>
          
          <div className="form-section">
            <h3 className="section-subtitle">1. Shipping Information</h3>
            
            <div className="form-group">
              <label htmlFor="name-input">Full Name</label>
              <input
                id="name-input"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={processing}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email-input">Email Address</label>
              <input
                id="email-input"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={processing}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="address-input">Shipping Address</label>
              <input
                id="address-input"
                type="text"
                placeholder="123 Main St, Apartment 4B"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={processing}
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-subtitle">2. Payment Method</h3>
            
            <div className="form-group">
              <label htmlFor="card-input">Card Number</label>
              <div className="card-input-wrapper">
                <input
                  id="card-input"
                  type="text"
                  placeholder="4000 1234 5678 9010"
                  maxLength={19} // Account for spacing formatting
                  value={cardNum}
                  onChange={(e) => {
                    // Simple credit card space formatter
                    const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                    const matches = value.match(/\d{4,16}/g);
                    const match = (matches && matches[0]) || '';
                    const parts = [];

                    for (let i = 0, len = match.length; i < len; i += 4) {
                      parts.push(match.substring(i, i + 4));
                    }

                    if (parts.length > 0) {
                      setCardNum(parts.join(' '));
                    } else {
                      setCardNum(value);
                    }
                  }}
                  disabled={processing}
                  className={errors.cardNum ? 'error' : ''}
                />
                <CreditCard className="card-field-icon" size={18} />
              </div>
              {errors.cardNum && <span className="error-text">{errors.cardNum}</span>}
            </div>

            <div className="form-row">
              <div className="form-group col">
                <label htmlFor="expiry-input">Expiry Date</label>
                <input
                  id="expiry-input"
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={cardExpiry}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                    if (value.length >= 2) {
                      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
                    } else {
                      setCardExpiry(value);
                    }
                  }}
                  disabled={processing}
                  className={errors.cardExpiry ? 'error' : ''}
                />
                {errors.cardExpiry && <span className="error-text">{errors.cardExpiry}</span>}
              </div>

              <div className="form-group col">
                <label htmlFor="cvv-input">CVV</label>
                <input
                  id="cvv-input"
                  type="password"
                  placeholder="123"
                  maxLength={4}
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                  disabled={processing}
                  className={errors.cardCvv ? 'error' : ''}
                />
                {errors.cardCvv && <span className="error-text">{errors.cardCvv}</span>}
              </div>
            </div>
          </div>

          <div className="security-guarantee">
            <ShieldCheck size={18} className="shield-icon" />
            <span>Secure 256-bit SSL encrypted transaction. Mock payment processor active.</span>
          </div>

          <button type="submit" disabled={processing} className="pay-submit-btn">
            {processing ? (
              <div className="btn-spinner"></div>
            ) : (
              <span>Authorize Payment — ${getTotalPrice.toFixed(2)}</span>
            )}
          </button>
        </form>

        {/* Order Summary Panel */}
        <aside className="checkout-summary-panel">
          <h2 className="section-title">Order Summary</h2>
          
          <div className="summary-items-list">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="summary-item">
                <img
                  src={product.image}
                  alt={product.name}
                  className="summary-item-image"
                />
                <div className="summary-item-details">
                  <span className="summary-item-name">{product.name}</span>
                  <span className="summary-item-qty">Qty: {quantity}</span>
                </div>
                <span className="summary-item-total">
                  ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-pricing">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${getSubtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{getShipping === 0 ? 'Free' : `$${getShipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>${getTax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total due</span>
              <span>${getTotalPrice.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .checkout-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem;
          width: 100%;
        }

        .checkout-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.875rem;
          margin-bottom: 2rem;
          transition: color var(--transition-fast);
        }

        .checkout-back-link:hover {
          color: var(--accent-color);
        }

        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }

        @media (min-width: 900px) {
          .checkout-layout {
            grid-template-columns: 1.25fr 0.75fr;
          }
        }

        .checkout-form-panel {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .section-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.5rem;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .section-subtitle {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .form-group label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          transition: all var(--transition-fast);
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px var(--accent-light);
          background-color: var(--bg-primary);
        }

        .form-group input.error {
          border-color: var(--error-color);
          background-color: var(--error-light);
        }

        .error-text {
          font-size: 0.75rem;
          color: var(--error-color);
          font-weight: 500;
        }

        .card-input-wrapper {
          position: relative;
        }

        .card-field-icon {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .form-row .col {
          flex: 1;
        }

        .security-guarantee {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .shield-icon {
          color: var(--success-color);
          flex-shrink: 0;
        }

        .pay-submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          border-radius: var(--radius-md);
          background-color: var(--accent-color);
          color: white;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }

        .pay-submit-btn:hover {
          background-color: var(--accent-hover);
        }

        .pay-submit-btn:disabled {
          background-color: var(--text-muted);
          cursor: not-allowed;
        }

        .btn-spinner {
          width: 1.5rem;
          height: 1.5rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* Order Summary Panel Styles */
        .checkout-summary-panel {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 2rem;
          height: fit-content;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .summary-items-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .summary-item-image {
          width: 3.5rem;
          height: 3.5rem;
          object-fit: cover;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }

        .summary-item-details {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .summary-item-name {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-primary);
        }

        .summary-item-qty {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .summary-item-total {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-primary);
        }

        .summary-divider {
          height: 1px;
          background-color: var(--border-color);
        }

        .summary-pricing {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .summary-row.total {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          border-top: 1px solid var(--border-color);
          padding-top: 0.75rem;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};
