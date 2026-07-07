// tests/services/cartStore.test.ts
// Unit tests for the Zustand cartStore.
// Connects to: src/services/cartStore.ts, src/models/product.ts
// Created: 2026-07-07

import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../../src/services/cartStore';
import type { Product } from '../../src/models/product';

const MOCK_PRODUCT_A: Product = {
  id: 'prod-a',
  name: 'Product A',
  description: 'Test Product A Description',
  price: 50.00,
  image: 'test-image-a.jpg',
  category: 'TestCategory',
  rating: { rate: 4.5, count: 10 }
};

const MOCK_PRODUCT_B: Product = {
  id: 'prod-b',
  name: 'Product B',
  description: 'Test Product B Description',
  price: 120.00, // Combined with A (50 + 120 = 170) it will cross the $150 free shipping threshold
  image: 'test-image-b.jpg',
  category: 'TestCategory',
  rating: { rate: 4.0, count: 5 }
};

describe('useCartStore', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useCartStore.getState().clearCart();
    useCartStore.getState().resetCheckout();
    useCartStore.getState().setCartOpen(false);
    localStorage.clear();
  });

  it('should initialize with an empty cart and closed state', () => {
    const state = useCartStore.getState();
    expect(state.cart).toEqual([]);
    expect(state.isCartOpen).toBe(false);
    expect(state.getTotalItems()).toBe(0);
    expect(state.getSubtotal()).toBe(0);
  });

  it('should add a product to the cart and open the drawer', () => {
    const store = useCartStore.getState();
    store.addToCart(MOCK_PRODUCT_A);

    const updatedState = useCartStore.getState();
    expect(updatedState.cart.length).toBe(1);
    expect(updatedState.cart[0].product).toEqual(MOCK_PRODUCT_A);
    expect(updatedState.cart[0].quantity).toBe(1);
    expect(updatedState.isCartOpen).toBe(true);
    expect(updatedState.getTotalItems()).toBe(1);
  });

  it('should increment quantity when adding the same product multiple times', () => {
    const store = useCartStore.getState();
    store.addToCart(MOCK_PRODUCT_A);
    store.addToCart(MOCK_PRODUCT_A);

    const updatedState = useCartStore.getState();
    expect(updatedState.cart.length).toBe(1);
    expect(updatedState.cart[0].quantity).toBe(2);
    expect(updatedState.getTotalItems()).toBe(2);
    expect(updatedState.getSubtotal()).toBe(100.00);
  });

  it('should update item quantity correctly', () => {
    const store = useCartStore.getState();
    store.addToCart(MOCK_PRODUCT_A);
    store.updateQuantity(MOCK_PRODUCT_A.id, 5);

    const updatedState = useCartStore.getState();
    expect(updatedState.cart[0].quantity).toBe(5);
    expect(updatedState.getTotalItems()).toBe(5);
    expect(updatedState.getSubtotal()).toBe(250.00);
  });

  it('should remove the item when quantity is set to 0 or less', () => {
    const store = useCartStore.getState();
    store.addToCart(MOCK_PRODUCT_A);
    store.updateQuantity(MOCK_PRODUCT_A.id, 0);

    const updatedState = useCartStore.getState();
    expect(updatedState.cart.length).toBe(0);
    expect(updatedState.getTotalItems()).toBe(0);
  });

  it('should remove product completely from cart', () => {
    const store = useCartStore.getState();
    store.addToCart(MOCK_PRODUCT_A);
    store.addToCart(MOCK_PRODUCT_B);
    store.removeFromCart(MOCK_PRODUCT_A.id);

    const updatedState = useCartStore.getState();
    expect(updatedState.cart.length).toBe(1);
    expect(updatedState.cart[0].product.id).toBe(MOCK_PRODUCT_B.id);
  });

  it('should calculate correct shipping costs based on free shipping threshold ($150)', () => {
    const store = useCartStore.getState();
    
    // Subtotal = 50. Shipping should be $10
    store.addToCart(MOCK_PRODUCT_A);
    expect(useCartStore.getState().getSubtotal()).toBe(50.00);
    expect(useCartStore.getState().getShipping()).toBe(10.00);

    // Subtotal = 170. Shipping should be free ($0)
    store.addToCart(MOCK_PRODUCT_B);
    expect(useCartStore.getState().getSubtotal()).toBe(170.00);
    expect(useCartStore.getState().getShipping()).toBe(0.00);
  });

  it('should calculate correct sales tax (8%)', () => {
    const store = useCartStore.getState();
    store.addToCart(MOCK_PRODUCT_A); // $50 subtotal

    const tax = useCartStore.getState().getTax();
    expect(tax).toBe(4.00); // 50 * 0.08 = 4
  });

  it('should calculate correct total price', () => {
    const store = useCartStore.getState();
    store.addToCart(MOCK_PRODUCT_A); // Subtotal: 50, Tax: 4, Shipping: 10
    
    const totalPrice = useCartStore.getState().getTotalPrice();
    expect(totalPrice).toBe(64.00);
  });

  it('should handle checkout start and completion transitions', () => {
    const store = useCartStore.getState();
    store.addToCart(MOCK_PRODUCT_A);
    
    store.startCheckout();
    expect(useCartStore.getState().isCheckingOut).toBe(true);
    expect(useCartStore.getState().isCartOpen).toBe(false);

    store.completeCheckout();
    const finishedState = useCartStore.getState();
    expect(finishedState.cart).toEqual([]);
    expect(finishedState.isCheckingOut).toBe(false);
    expect(finishedState.checkoutSuccess).toBe(true);
  });

  it('should persist cart items to localStorage', () => {
    const store = useCartStore.getState();
    store.addToCart(MOCK_PRODUCT_A);

    const persistedData = localStorage.getItem('shopping-cart-storage');
    expect(persistedData).toBeTruthy();

    const parsed = JSON.parse(persistedData!);
    expect(parsed.state.cart.length).toBe(1);
    expect(parsed.state.cart[0].product.id).toBe(MOCK_PRODUCT_A.id);
  });

  it('should only persist cart and exclude UI state like isCartOpen', () => {
    const store = useCartStore.getState();
    store.addToCart(MOCK_PRODUCT_A);
    store.setCartOpen(true);

    const persistedData = localStorage.getItem('shopping-cart-storage');
    const parsed = JSON.parse(persistedData!);
    expect(parsed.state.cart).toBeDefined();
    expect(parsed.state.isCartOpen).toBeUndefined(); // Should be partialized out
  });
});
