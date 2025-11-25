PRD – Multi-Vehicle Rental Order System (Laravel)

Final version with PostgreSQL-friendly VARCHAR + CHECK constraints (no ENUM).

1. Overview

Build a rental system where:

A logged-in user selects multiple vehicles.

Selected vehicles appear in a bottom rental cart panel.

User sets per-vehicle configuration: start datetime, rent mode, quantity.

System computes per-item subtotal and overall total.

Checkout creates a draft rental order.

Admin reviews, starts rent, completes/cancels.

Vehicles can be combined in any configuration.

2. Roles & Goals
Roles

User (Customer)

Browse vehicles.

Add vehicles to rental cart.

Configure rental details.

Submit order.

Admin

Review draft orders.

Start rentals.

Complete rentals.

Cancel orders.

View history.

Goals (v1)

Support multi-vehicle orders.

Per-item configuration (start_at, mode, quantity).

Price calculation.

Availability checking.

Status flow: draft → ongoing → completed/cancelled.

3. User Flows
3.1 User Workflow – Create Rental Order

Login.

Browse Vehicles – user sees vehicle list and pricing.

Add vehicle to cart – only the vehicle is added; no configuration yet.

Checkout (Step 1) – user proceeds to a configuration screen containing all cart items.

Configure each item:

start_at (required datetime)

mode (daily / weekly / monthly)

quantity (>=1) System automatically computes:

end_at

subtotal

Apply Order (Final Checkout) – after confirming all data, system creates rental_orders and rental_order_items.

Cart is cleared.

3.2 Admin Workflow – Order Management

Admin receives a new sidebar menu:

Sidebar → Order

Approval (showing draft + ongoing orders only)

Order History (showing completed + cancelled orders)

Approval Page

Shows list of incoming (draft) and active (ongoing) orders.

Admin actions:

View Detail – inspect items, pricing, period.

Start Rent – re-check availability → set status ongoing.

Complete Rent – set status completed.

Cancel Order – set status cancelled.

Order History Page

Shows completed and cancelled orders.

Admin can filter by:

Date range

User

Status

Vehicle count range

4. Data Model

This section replaces ENUM definitions with VARCHAR + CHECK, compatible with PostgreSQL.

4.1 vehicles table (existing)

Includes pricing fields:

price_daily_idr

price_weekly_idr

price_monthly_idr

4.2 rental_orders table (modified)

Represents a single checkout session.

rental_orders
- id (PK)
- user_id (FK → users.id)
- status VARCHAR(20) NOT NULL
         CHECK (status IN ('draft','ongoing','completed','cancelled'))
- total_price_idr BIGINT
- notes TEXT NULL
- created_at
- updated_at
Status semantics

draft: user created order, waiting for admin

ongoing: admin started rent

completed: rent finished

cancelled: order voided

4.3 rental_order_items table (modified)

Represents each vehicle rented within an order.

rental_order_items
- id (PK)
- rental_order_id (FK → rental_orders.id)
- vehicle_id (FK → vehicles.id)


- mode VARCHAR(20) NOT NULL
       CHECK (mode IN ('daily','weekly','monthly'))
- quantity INTEGER NOT NULL


- start_at TIMESTAMP NOT NULL
- end_at TIMESTAMP NOT NULL


- price_per_unit_idr BIGINT
- subtotal_price_idr BIGINT


- created_at
- updated_at
Relationships (Laravel Eloquent)
User hasMany RentalOrder
RentalOrder belongsTo User
RentalOrder hasMany RentalOrderItem
RentalOrderItem belongsTo RentalOrder
RentalOrderItem belongsTo Vehicle
Vehicle hasMany RentalOrderItem
5. Business Rules
5.1 Time Calculation

daily → +1 day × quantity

weekly → +7 days × quantity

monthly (v1 simplified) → +30 days × quantity

Preserve hour/minute.

Interval defined as [start_at, end_at).

5.2 Pricing Calculation

daily → vehicle.price_daily_idr

weekly → vehicle.price_weekly_idr

monthly → vehicle.price_monthly_idr

subtotal = price × quantity

total = sum of subtotals

Store snapshot price_per_unit_idr & subtotal to maintain history consistency.

5.3 Availability Check

Check for overlapping rentals for each vehicle, comparing against rental_order_items whose parent order has status in:

draft, ongoing

Overlap rule:

A_start < B_end AND A_end > B_start

If overlapping → reject.

5.4 Status Flow
draft → ongoing → completed
 draft → cancelled
 ongoing → cancelled

Items follow order status.

6. Laravel Implementation Outline
6.1 User Routes
Route::middleware(['auth'])->group(function() {
    GET /vehicles
    POST /rental-cart/add
    POST /rental-cart/update
    POST /rental-cart/checkout
    GET /my-orders
});
6.2 Admin Routes
Route::middleware(['auth','can:manage-orders'])->group(function () {
    GET /admin/orders
    GET /admin/orders/{order}
    POST /admin/orders/{order}/start
    POST /admin/orders/{order}/complete
    POST /admin/orders/{order}/cancel
    GET /admin/orders/history
});
6.3 Rental Cart UI

Each cart row contains:

vehicle_id

mode

quantity

start_at

Computed: end_at, subtotal

Checkout sends compiled payload to controller.

7. Screens Summary
7.1 Vehicles Page

Vehicle list

"Rent" button

Bottom Cart Panel with:

start_at

mode

quantity

auto-calculated end_at

subtotal

remove

grand total

7.2 Admin – Orders List

Columns: ID, User, vehicle count, period, total, status, actions.

7.3 Admin – Order Detail

Shows all items and header data. Buttons:

Start

Complete

Cancel

7.4 Admin – Order History

Shows completed + cancelled. Filters: user, date, status.