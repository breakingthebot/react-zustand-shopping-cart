# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-07-07

### Added
- Created boilerplate React/Vite/TypeScript architecture.
- Added standard MIT license under LICENSE.
- Configured `.gitignore` rules mapping to standard build rules.
- Set up Zustand state store (`src/services/cartStore.ts`) to manage cart additions, updates, removals, and total/shipping/tax calculations.
- Integrated mock productService (`src/services/productService.ts`) with custom network delay simulation.
- Developed `Navbar`, `ProductCatalog`, `Cart` drawer, and `CheckoutFlow` UI components.
- Configured Vitest setup, writing 10 unit tests for `cartStore` covering edge cases like checkout states, free-shipping calculations, and item deletion.
