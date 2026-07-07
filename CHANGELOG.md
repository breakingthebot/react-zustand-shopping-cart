# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-07-07

### Added
- Integrated Zustand's `persist` middleware inside `cartStore` using `localStorage` as storage engines.
- Configured partialization filters to only serialize cart items, excluding temporary UI states.
- Appended unit tests in `cartStore.test.ts` verifying storage writes, JSON layouts, and partialization exclusions.
- Added automatic state cleanup in tests using `localStorage.clear()` in `beforeEach`.

## [0.1.0] - 2026-07-07

### Added
- Created boilerplate React/Vite/TypeScript architecture.
- Added standard MIT license under LICENSE.
- Configured `.gitignore` rules mapping to standard build rules.
- Set up Zustand state store (`src/services/cartStore.ts`) to manage cart additions, updates, removals, and total/shipping/tax calculations.
- Integrated mock productService (`src/services/productService.ts`) with custom network delay simulation.
- Developed `Navbar`, `ProductCatalog`, `Cart` drawer, and `CheckoutFlow` UI components.
- Configured Vitest setup, writing 10 unit tests for `cartStore` covering edge cases like checkout states, free-shipping calculations, and item deletion.
