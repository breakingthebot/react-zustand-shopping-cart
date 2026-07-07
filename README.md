# Aetheric Space - React & Zustand Shopping Cart

A premium, high-fidelity e-commerce shopping cart interface with a responsive product catalog, interactive cart drawer, and validation-backed checkout flow.

## Stack
- **Language / Framework:** React (Vite) + TypeScript
- **State Management:** Zustand (global state, actions, and computed getters)
- **Styling:** CSS Custom Properties, Glassmorphism, and custom animations
- **Icons:** Lucide React
- **Testing:** Vitest + React Testing Library + JSDOM

## Setup
Step by step:
1. Clone the repository to your local machine.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server locally:
   ```bash
   npm run dev
   ```
4. Run the unit tests:
   ```bash
   npm run test
   ```

## Environment Variables
Refer to `.env.example`. No custom environment variables are required for this iteration.

## Running Locally
- Development: `npm run dev`
- Production Build: `npm run build`
- Run Preview: `npm run preview`

## Deployed
*Not yet deployed.*

## Architecture Notes
For this project, I chose **React** for the user interface and **Zustand** for state management. Zustand was chosen over Redux Toolkit because of its minimal boilerplate, easy-to-use hooks, and clean integration with vanilla TypeScript outside the React lifecycle. 

In this iteration, we integrated Zustand's `persist` middleware to cache cart data in `localStorage` under the key `shopping-cart-storage`. We configured it with `partialize` to selectively serialize only the transactional `cart` items. UI state triggers (like drawer visibility or order validation statuses) are intentionally excluded, providing a consistent UX where refreshing the page restores products but doesn't disrupt user views.

The project structure adheres to separation of concerns:
- `src/models/` contains our domain data structures (`Product`, `CartItem`).
- `src/services/` holds our business logic and state management stores (`cartStore` and `productService`).
- `src/components/` hosts single-responsibility presentation elements (`Navbar`, `ProductCatalog`, `Cart`, `CheckoutFlow`).
- `tests/` mirrors the structure of `src/` to host matching unit and integration test files.

Calculations such as tax rates and shipping thresholds are kept as internal computed getters inside the Zustand store to maintain a single source of truth for pricing calculations, preventing UI components from performing redundant math.

## Notes
- Free shipping is dynamically computed to be unlocked at $150.00.
- Taxes are calculated at a flat 8.00% rate.
- Modifying quantities below 1 automatically triggers item removal from the cart, ensuring clean item states.
