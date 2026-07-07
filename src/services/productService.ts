// src/services/productService.ts
// Service layer for fetching products. Simulates API calls.
// Connects to: src/models/product.ts
// Created: 2026-07-07

import type { Product } from '../models/product';

// Static mockup of products with Unsplash images for rich visual design.
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Aether Mechanical Keyboard',
    description: 'Hot-swappable tactile switches, brass plate, and custom keycaps in a clean 75% layout.',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    category: 'Keyboards',
    rating: { rate: 4.8, count: 124 }
  },
  {
    id: 'prod-2',
    name: 'SonicWave ANC Headphones',
    description: 'Active noise-cancelling wireless headphones with high-fidelity audio and 40-hour battery life.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    category: 'Audio',
    rating: { rate: 4.6, count: 85 }
  },
  {
    id: 'prod-3',
    name: 'Apex Ergo Chair',
    description: 'Fully adjustable ergonomic chair designed for premium lumbar support and breathable mesh.',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=600&q=80',
    category: 'Office',
    rating: { rate: 4.9, count: 42 }
  },
  {
    id: 'prod-4',
    name: 'Lumina Desk Lamp',
    description: 'Dimmable smart LED lamp with color temperature control and an integrated Qi wireless charger.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    category: 'Office',
    rating: { rate: 4.3, count: 19 }
  },
  {
    id: 'prod-5',
    name: 'VoltCharge Power Bank',
    description: '20,000mAh portable charger with 65W power delivery for laptops, tablets, and smartphones.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1609592424109-dd08fb1806b5?auto=format&fit=crop&w=600&q=80',
    category: 'Accessories',
    rating: { rate: 4.5, count: 68 }
  },
  {
    id: 'prod-6',
    name: 'Ember Drip Coffee Maker',
    description: 'Precision brewing drip coffee machine with built-in burr grinder and thermal carafe.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?auto=format&fit=crop&w=600&q=80',
    category: 'Kitchen',
    rating: { rate: 4.7, count: 110 }
  }
];

/**
 * Simulates fetching products from an API.
 * @returns A promise that resolves with the array of products after a short delay.
 */
export const fetchProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PRODUCTS);
    }, 400); // 400ms network delay simulation
  });
};
