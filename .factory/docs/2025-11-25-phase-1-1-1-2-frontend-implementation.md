# Phase 1.1 & 1.2 Frontend Implementation

## 1.1 Vehicle List Enhancement
- Update `/resources/js/pages/user/vehicles/index.tsx` to:
  - Display vehicle pricing (daily/weekly/monthly rates)
  - Replace DashboardVehicleCard with new VehicleCard component
  - Add vehicle-to-cart functionality

## 1.2 Create New Components

### A. VehicleCard Component (`/resources/js/components/ui/vehicle-card.tsx`)
- Display vehicle image, brand, model, year, specs
- Show pricing for all rental modes (daily/weekly/monthly)
- "Add to Cart" button with loading state
- Visual indicator when vehicle is in cart
- Responsive design using existing Card component
- Follow existing UI patterns from dashboard-vehicle-card

### B. RentalCart Component (`/resources/js/components/rental-cart.tsx`)
- Fixed bottom panel with slide-up animation
- Cart items count badge in collapsed state
- Expandable list of cart items
- Real-time total price calculation
- Checkout button (disabled when cart is empty)
- Clear cart functionality
- Persist cart state in session storage

### C. CartItem Component (`/resources/js/components/cart-item.tsx`)
- Vehicle thumbnail and details
- Rental mode selector (daily/weekly/monthly)
- Quantity input with validation
- Start date/time picker
- Auto-calculated end date display
- Subtotal price calculation
- Remove item button
- Real-time price updates

### D. Cart Context (`/resources/js/context/cart-context.tsx`)
- React Context for cart state management
- Cart operations (add, update, remove, clear)
- Session storage persistence
- Price calculation utilities
- Cart item existence checking

## Implementation Details
- Use existing shadcn/ui components (Button, Card, Input, Select)
- Follow established patterns from existing components
- Implement proper TypeScript types for cart items
- Add loading states and error handling
- Use Framer Motion for cart panel animations
- Format prices in IDR with proper thousand separators
- Validate cart inputs before submission