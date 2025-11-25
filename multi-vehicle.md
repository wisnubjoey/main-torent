Frontend Implementation Plan for Multi-Vehicle Rental
    Order System

   Overview

   Implement all frontend components for the rental
   system based on existing patterns. The backend is
   complete with controllers, models, and routes. We
   need to create the user-facing rental cart system and
    admin order management interfaces.

   Phase 1: User-Facing Components

   1.1 Vehicle List Enhancement
   •  Update
      /resources/js/pages/user/vehicles/index.tsx to
      include:
     •  Pricing display (daily/weekly/monthly rates)
     •  "Rent" button that adds to cart
     •  Visual indicators for cart status

   1.2 Create New Components

   A. VehicleCard Component 
   (`/resources/js/components/ui/vehicle-card.tsx`)
   •  Display vehicle details with pricing
   •  "Add to Cart" button
   •  Responsive design matching existing UI patterns
   •  Use Card component from shadcn/ui

   B. RentalCart Component 
   (`/resources/js/components/rental-cart.tsx`)
   •  Bottom panel cart display (fixed or slide-up)
   •  List of cart items with configuration
   •  Per-item configuration (mode, quantity, start_at)
   •  Real-time price calculation
   •  Remove item functionality
   •  Checkout button

   C. CartItem Component 
   (`/resources/js/components/cart-item.tsx`)
   •  Individual cart item display
   •  Vehicle info with image
   •  Mode selection (daily/weekly/monthly)
   •  Quantity input
   •  Start date picker
   •  Calculated end date and subtotal display

   1.3 Create New Pages

   A. Checkout Page 
   (`/resources/js/pages/user/checkout/index.tsx`)
   •  Review all cart items
   •  Notes input
   •  Final total calculation
   •  Submit order button
   •  Use AppLayout with breadcrumbs

   B. User Orders Page 
   (`/resources/js/pages/user/orders/index.tsx`)
   •  Display user's rental orders
   •  Order status badges
   •  Order items preview
   •  Filter by status option

   1.4 Update Existing Components
   •  Add rentalOrderItems relationship to Vehicle
      model in backend
   •  Create cart context/state management
   •  Add cart item count to user navigation

   Phase 2: Admin-Facing Components

   2.1 Order Approval Page
   •  Update
      /resources/js/pages/admin/orders/Approval.tsx to
      show:
     •  List of draft and ongoing orders
     •  Order preview with user info
     •  Vehicle count and period display
     •  Action buttons (View Details, Start, Complete,
        Cancel)

   2.2 Order Detail View
   •  Create
      /resources/js/pages/admin/orders/show/[id].tsx:
     •  Complete order information
     •  List of all items with vehicle details
     •  Status change buttons with confirmation
     •  Notes section

   2.3 Order History Page
   •  Update
      /resources/js/pages/admin/orders/history.tsx
      with:
     •  Filterable table of completed/cancelled orders
     •  Date range picker
     •  User search
     •  Status filter
     •  Vehicle count range filter
     •  Export functionality

   2.4 Admin Components

   A. OrderTable Component 
   (`/resources/js/components/admin/order-table.tsx`)
   •  Reusable table for order lists
   •  Sorting capabilities
   •  Status badges
   •  Action buttons
   •  Pagination

   B. OrderStatusBadge Component (`/resources/js/compone
   nts/admin/order-status-badge.tsx`)
   •  Color-coded status indicators
   •  Draft (gray), Ongoing (blue), Completed (green),
      Cancelled (red)

   C. OrderFilters Component 
   (`/resources/js/components/admin/order-filters.tsx`)
   •  Filter form for history page
   •  Date inputs, search field, status select

   Phase 3: Shared Components & Utilities

   3.1 Create DateRange Picker 
   (`/resources/js/components/ui/date-range-picker.tsx`)

   •  For admin filters
   •  Start and end date selection

   3.2 Create PriceDisplay Component 
   (`/resources/js/components/ui/price-display.tsx`)
   •  Format IDR prices consistently
   •  Support for different time periods

   3.3 Create Status Badge Component 
   (`/resources/js/components/ui/status-badge.tsx`)
   •  Generic status indicator
   •  Color variants for different statuses

   Technical Implementation Details

   State Management
   •  Use React Context for cart state
   •  Persist cart in session storage
   •  Real-time price updates on configuration changes

   API Integration
   •  Use Inertia.js for navigation and form
      submissions
   •  Handle loading states and error messages
   •  Implement optimistic updates for cart operations

   Design Patterns
   •  Follow existing component structure
   •  Use shadcn/ui components consistently
   •  Maintain responsive design
   •  Use Framer Motion for animations where
      appropriate
   •  Implement proper error handling

   File Structure

     /resources/js/
     ├── components/
     │   ├── rental-cart.tsx (new)
     │   ├── cart-item.tsx (new)
     │   ├── ui/
     │   │   ├── vehicle-card.tsx (new)
     │   │   ├── price-display.tsx (new)
     │   │   ├── status-badge.tsx (new)
     │   │   └── date-range-picker.tsx (new)
     │   └── admin/
     │       ├── order-table.tsx (new)
     │       ├── order-status-badge.tsx (new)
     │       └── order-filters.tsx (new)
     ├── pages/
     │   ├── user/
     │   │   ├── checkout/index.tsx (new)
     │   │   └── orders/index.tsx (new)
     │   └── admin/
     │       ├── orders/
     │       │   ├── show/
     │       │   │   └── [id].tsx (new)
     │       │   ├── Approval.tsx (update)
     │       │   └── history.tsx (update)

   Priority Order
   1. VehicleCard and basic cart functionality
   2. Cart state management and cart items
   3. Checkout flow
   4. Admin order approval page
   5. Admin order history
   6. User orders page
   7. Admin order detail view

   This plan follows the existing codebase patterns and
   uses the established component library (shadcn/ui)
   while implementing all the features from the PRD.