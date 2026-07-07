// src/services/cartStore.ts
// Zustand store for global shopping cart state management.
// Connects to: src/models/product.ts
// Created: 2026-07-07

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, CartItem } from '../models/product';

// Constants for tax and shipping calculations
const TAX_RATE = 0.08; // 8% sales tax
const FREE_SHIPPING_THRESHOLD = 150; // Free shipping over $150
const FLAT_SHIPPING_COST = 10; // $10 flat rate shipping

interface CartState {
  cart: CartItem[];
  isCartOpen: boolean;
  isCheckingOut: boolean;
  checkoutSuccess: boolean;
  appliedDiscountCode: string | null;
  
  // Actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  startCheckout: () => void;
  completeCheckout: () => void;
  resetCheckout: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  
  // Computed Getters (methods that calculate from state)
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getDiscountedSubtotal: () => number;
  getTax: () => number;
  getShipping: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      isCheckingOut: false,
      checkoutSuccess: false,
      appliedDiscountCode: null,

      /**
       * Adds a product to the cart. If the product is already in the cart, its quantity is incremented.
       * @param product The product to add.
       */
      addToCart: (product) => {
        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingItemIndex > -1) {
            // Increment quantity of existing item
            const updatedCart = [...state.cart];
            updatedCart[existingItemIndex] = {
              ...updatedCart[existingItemIndex],
              quantity: updatedCart[existingItemIndex].quantity + 1,
            };
            return { cart: updatedCart };
          } else {
            // Add new item with quantity 1
            return {
              cart: [...state.cart, { product, quantity: 1 }]
            };
          }
        });
      },

      /**
       * Removes a product from the cart completely.
       * @param productId The ID of the product to remove.
       */
      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },

      /**
       * Updates the quantity of a specific item in the cart. Removes the item if quantity drops to 0 or less.
       * @param productId The ID of the product.
       * @param quantity The new quantity.
       */
      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              cart: state.cart.filter((item) => item.product.id !== productId),
            };
          }

          return {
            cart: state.cart.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          };
        });
      },

      /**
       * Clears all items in the cart.
       */
      clearCart: () => {
        set({ cart: [] });
      },

      /**
       * Toggles the visibility of the side cart drawer.
       */
      toggleCart: () => {
        set((state) => ({ isCartOpen: !state.isCartOpen }));
      },

      /**
       * Explicitly sets the side cart drawer open/closed.
       * @param open Boolean indicating state.
       */
      setCartOpen: (open) => {
        set({ isCartOpen: open });
      },

      /**
       * Starts the checkout flow.
       */
      startCheckout: () => {
        set({ isCheckingOut: true, isCartOpen: false });
      },

      /**
       * Completes the checkout flow, clearing the cart and showing success.
       */
      completeCheckout: () => {
        set({
          cart: [],
          isCheckingOut: false,
          checkoutSuccess: true,
          appliedDiscountCode: null,
        });
      },

      /**
       * Resets checkout flags to allow new purchases.
       */
      resetCheckout: () => {
        set({
          isCheckingOut: false,
          checkoutSuccess: false,
        });
      },

      /**
       * Validates and applies a coupon code.
       * @param code The input coupon code.
       */
      applyPromoCode: (code) => {
        const cleanCode = code.trim().toUpperCase();
        const validCodes = ['SAVE10', 'SAVE20', 'FLAT15', 'FREESHIP'];

        if (validCodes.includes(cleanCode)) {
          set({ appliedDiscountCode: cleanCode });
          
          let promoMessage = '';
          switch (cleanCode) {
            case 'SAVE10':
              promoMessage = '10% discount applied!';
              break;
            case 'SAVE20':
              promoMessage = '20% discount applied!';
              break;
            case 'FLAT15':
              promoMessage = '$15.00 flat discount applied!';
              break;
            case 'FREESHIP':
              promoMessage = 'Free shipping discount applied!';
              break;
          }
          return { success: true, message: promoMessage };
        }

        return { success: false, message: 'Invalid promo code.' };
      },

      /**
       * Dismisses/removes the applied coupon code.
       */
      removePromoCode: () => {
        set({ appliedDiscountCode: null });
      },

      // Computed Getter Implementations
      getTotalItems: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const code = get().appliedDiscountCode;
        if (!code) return 0;
        
        switch (code) {
          case 'SAVE10':
            return subtotal * 0.1;
          case 'SAVE20':
            return subtotal * 0.2;
          case 'FLAT15':
            return Math.min(subtotal, 15);
          default:
            return 0; // FREESHIP does not discount subtotal itself
        }
      },

      getDiscountedSubtotal: () => {
        return Math.max(0, get().getSubtotal() - get().getDiscountAmount());
      },

      getTax: () => {
        return get().getDiscountedSubtotal() * TAX_RATE;
      },

      getShipping: () => {
        const discountedSubtotal = get().getDiscountedSubtotal();
        if (discountedSubtotal === 0) return 0;
        if (get().appliedDiscountCode === 'FREESHIP') return 0;
        
        return discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_COST;
      },

      getTotalPrice: () => {
        return get().getDiscountedSubtotal() + get().getTax() + get().getShipping();
      },
    }),
    {
      name: 'shopping-cart-storage',
      storage: createJSONStorage(() => localStorage),
      // Persist cart array and applied coupon code.
      partialize: (state) => ({
        cart: state.cart,
        appliedDiscountCode: state.appliedDiscountCode
      } as CartState),
    }
  )
);

