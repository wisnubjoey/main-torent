Based on the existing controller structure and plan.md requirements, I will create the following controllers:

**User Controllers:**
1. **User/RentalCartController.php**
   - POST /rental-cart/add - Add vehicle to rental cart
   - POST /rental-cart/update - Update cart item configuration  
   - POST /rental-cart/checkout - Process checkout and create rental order
   - GET /my-orders - Display user's rental orders

2. **User/VehicleController.php** (if not exists)
   - GET /vehicles - Display vehicles with rental functionality

**Admin Controllers:**
1. **Admin/RentalOrderController.php**
   - GET /admin/orders - List draft and ongoing orders
   - GET /admin/orders/{order} - Show order details
   - POST /admin/orders/{order}/start - Start rental (draft → ongoing)
   - POST /admin/orders/{order}/complete - Complete rental (ongoing → completed)
   - POST /admin/orders/{order}/cancel - Cancel order (draft/ongoing → cancelled)

2. **Admin/RentalOrderHistoryController.php**
   - GET /admin/orders/history - List completed and cancelled orders with filters

**Implementation Details:**
- Follow existing admin controller patterns (use Inertia responses, proper validation)
- Implement business logic: availability checking, pricing calculations, status transitions
- Add proper authorization checks using Laravel gates/policies
- Include comprehensive validation for rental periods and quantities
- Handle error scenarios (unavailability, invalid dates, etc.)
- Follow Laravel resource controller conventions where applicable
- Use dependency injection for models and services

**Key Features:**
- Cart management with session storage
- Real-time availability checking during checkout
- Admin order workflow with proper state management
- Filtering and pagination for order lists
- Proper error handling and user feedback