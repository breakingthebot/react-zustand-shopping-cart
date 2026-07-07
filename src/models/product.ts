// src/models/product.ts
// Defines typescript interfaces for catalog products and cart items.
// Connects to: src/services/cartStore.ts, src/services/productService.ts
// Created: 2026-07-07

/**
 * Interface representing a product in the catalog.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
}

/**
 * Interface representing a product added to the shopping cart, along with its current quantity.
 */
export interface CartItem {
  product: Product;
  quantity: number;
}
