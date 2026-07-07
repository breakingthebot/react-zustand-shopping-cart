// src/components/ProductCatalog.tsx
// Displays the available products with filtering and search features.
// Connects to: src/models/product.ts, src/services/productService.ts, src/services/cartStore.ts
// Created: 2026-07-07

import React, { useEffect, useState } from 'react';
import { Search, Star, Plus } from 'lucide-react';
import type { Product } from '../models/product';
import { fetchProducts } from '../services/productService';
import { useCartStore } from '../services/cartStore';

export const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Get list of unique categories
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filter and search logic
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="catalog-loading">
        <div className="spinner"></div>
        <p>Curating our premium collection...</p>
      </div>
    );
  }

  return (
    <section className="catalog-section">
      <div className="catalog-header">
        <h1 className="catalog-title">Premium Goods</h1>
        <p className="catalog-subtitle">Exquisite design. Unmatched utility. Curated for developers.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="catalog-controls">
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Search products"
          />
        </div>

        <div className="categories-list">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`category-tag ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      {filteredProducts.length === 0 ? (
        <div className="empty-catalog">
          <p>No products match your search or filter criteria.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article key={product.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                  loading="lazy"
                />
                <span className="product-card-category">{product.category}</span>
              </div>

              <div className="product-card-body">
                <div className="product-rating">
                  <Star className="star-icon" size={14} />
                  <span className="rating-val">{product.rating.rate}</span>
                  <span className="rating-count">({product.rating.count})</span>
                </div>

                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                
                <div className="product-footer">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="add-to-cart-btn"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <Plus size={16} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <style>{`
        .catalog-section {
          padding: 3rem 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .catalog-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .catalog-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 2.75rem;
          color: var(--text-primary);
          line-height: 1.2;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .catalog-subtitle {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        .catalog-controls {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        @media (min-width: 768px) {
          .catalog-controls {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          transition: all var(--transition-fast);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px var(--accent-light);
          background-color: var(--bg-primary);
        }

        .categories-list {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
        }

        .category-tag {
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.875rem;
          white-space: nowrap;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .category-tag:hover {
          border-color: var(--accent-color);
          color: var(--accent-color);
        }

        .category-tag.active {
          background-color: var(--accent-color);
          border-color: var(--accent-color);
          color: white;
        }

        .product-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 640px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .product-card {
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          overflow: hidden;
          transition: all var(--transition-normal);
          box-shadow: var(--card-shadow);
        }

        .product-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-glass);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
        }

        .product-image-container {
          position: relative;
          aspect-ratio: 16/10;
          overflow: hidden;
          background-color: var(--bg-tertiary);
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-card-category {
          position: absolute;
          top: 1rem;
          left: 1rem;
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
          color: white;
        }

        .product-card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }

        .star-icon {
          color: #fbbf24; /* Amber star */
          fill: #fbbf24;
        }

        .rating-val {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .rating-count {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .product-name {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .product-description {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 2.75rem; /* Forces fixed alignment for descriptions */
        }

        .product-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }

        .product-price {
          font-size: 1.375rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .add-to-cart-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.125rem;
          border-radius: var(--radius-md);
          background-color: var(--accent-color);
          color: white;
          border: none;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }

        .add-to-cart-btn:hover {
          background-color: var(--accent-hover);
        }

        .catalog-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 350px;
          gap: 1rem;
        }

        .spinner {
          width: 2.5rem;
          height: 2.5rem;
          border: 3px solid var(--border-color);
          border-top-color: var(--accent-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-catalog {
          text-align: center;
          padding: 4rem 1.5rem;
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-lg);
          color: var(--text-muted);
        }
      `}</style>
    </section>
  );
};
