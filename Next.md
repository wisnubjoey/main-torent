Next Steps – Rental Order System (No UI Components)

Overview
- Focus on core rental flows only; skip creating or refactoring UI components.
- Keep existing UI primitives (e.g., `Button`, `Table`, `Badge`) since pages depend on them.

Admin Flows
- Approval page: harden `start`, `complete`, `cancel` actions with clear success/error handling and disabled states.
- History page: ensure filters persist via query params; verify pagination works with server-side queries.
- Controllers: validate inputs and guard state transitions (only `draft`→`ongoing`, `ongoing`→`completed`, allow cancel for `draft|ongoing`).

User Flows
- Checkout: add `GET /checkout` page (`resources/js/pages/user/checkout/index.tsx`) to review cart and submit to `POST /rental-cart/checkout`.
- My Orders: add `resources/js/pages/user/orders/index.tsx` to render data from `RentalCartController::myOrders()`.
- Navigation: ensure header links surface `Checkout` and `My Orders` appropriately.

Testing & QA
- Seed sample data for manual QA (vehicles, users, orders in `draft`, `ongoing`, `completed`, `cancelled`).
- Integration tests: actions endpoints and filters; verify role guards (user vs admin).
- SSR: confirm pages render correctly with Inertia SSR enabled.

Notes
- No new UI component files will be created; work is limited to pages, controllers, and routes.
