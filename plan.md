PRD – Multi-Vehicle Rental Order System (Laravel)
1. Overview

Build a rental system where:

A logged-in user selects multiple vehicles from the Vehicles page.

Selected vehicles appear in a bottom “rental cart” panel.

For each selected vehicle, the user configures:

Start date/time

Rent mode: daily/weekly/monthly

Quantity (number of days/weeks/months)

System calculates per-vehicle subtotal and order grand total.

On checkout, a new order is created with status draft and sent to admin.

Admin sees the order, verifies, and clicks “Start rent” → status ongoing.

After the rental is finished, order is moved to history (completed).

Vehicles can be chosen in any combination; each vehicle has its own configuration.

2. Roles & Goals
Roles

User (Customer)

Browses vehicles.

Adds one or more vehicles to a rental cart.

Configures rental details per vehicle.

Submits order and waits for admin approval.

Admin

Views pending/draft orders.

Verifies details, then starts rentals.

Marks rentals as completed (or cancelled).

Views order history.

Goals (v1)

Support multi-vehicle orders.

Per-vehicle rental configuration:

Start date/time

Daily/weekly/monthly mode

Quantity

Calculate per-item subtotal and order total.

Simple status flow:

User side: creates draft

Admin side: draft → ongoing → completed (or cancelled)

Basic availability check to prevent overlapping rentals for the same vehicle.

3. User Flows
3.1 User Flow – Create Rental Order

Login

User logs into the application.

Browse Vehicles

User opens “Vehicles” menu.

Each vehicle card shows:

Model, plate_no, image

Price info (daily/weekly/monthly from vehicles table)

“Rent” button

Add to Rental Cart

When user clicks “Rent” on a vehicle:

That vehicle is added to the bottom “Rental Cart” panel (fixed at bottom).

If already in cart, optionally increase quantity or just keep 1 entry (v1: one line per vehicle).

Configure Each Vehicle in Cart
For each vehicle row in the bottom panel:

Fields:

Vehicle summary: model + plate

Start date/time (e.g. 2025-01-10 11:00)

Rent mode: select daily | weekly | monthly

Quantity (integer, >= 1)

System calculates:

End date/time based on:

daily → start + quantity * 1 day

weekly → start + quantity * 7 days

monthly → start + quantity * 30 days (simplified v1)

End time MUST keep the same time-of-day as start (e.g. 11:00 → 11:00).

Subtotal price:

price_per_unit = vehicle.price_{mode}_idr

subtotal = price_per_unit * quantity

The panel displays:

Start datetime

End datetime

Subtotal

User can:

Remove a vehicle from cart.

Change mode, start datetime, or quantity – totals recalculated.

Checkout

Bottom panel shows:

Grand total = sum of all subtotals

User clicks “Checkout”.

System validates:

User is logged in.

Cart is not empty.

Each item has valid start datetime, mode, and quantity.

Vehicle availability check (no overlapping pending/ongoing rentals for those vehicles).

On success:

Create rental_orders record (status = draft).

Create rental_order_items for each vehicle.

UI:

Show confirmation: “Order created and waiting for admin approval.”

Cart is cleared.

3.2 Admin Flow – Manage Orders

View Orders (Dashboard → Orders)

Admin opens “Orders” menu.

See list of orders with statuses draft and ongoing.

Columns:

Order ID

User name

Number of vehicles

Period (min start to max end)

Total amount

Status (draft or ongoing)

Actions (View / Start / Complete / Cancel)

View Order Detail

Admin clicks an order:

See header:

Order ID, User, Status, Created date

Items table:

Vehicle model + plate

Start datetime

End datetime

Mode (daily/weekly/monthly)

Quantity

Price per unit

Subtotal

Grand total

Start Rent

On a draft order, Admin clicks “Start rent”.

System:

Re-check availability (to avoid conflicts if something changed).

If available, set order status = ongoing.

Now this order represents active rentals.

Complete Rent

When rentals end, Admin opens the ongoing order.

Clicks “Complete”.

System sets status = completed.

Order disappears from main “Orders” list and appears in “Order History” list.

Cancel Order

At draft or ongoing, Admin can click “Cancel”.

Status set to cancelled, moved to history.

Order History

“Order History” menu/list:

Shows completed and cancelled orders only.

Same columns + filters by date, user, status.

4. Data Model
4.1 Existing: vehicles table

Already defined, including:

price_daily_idr

price_weekly_idr

price_monthly_idr

We will use these for per-item pricing.

4.2 New: rental_orders table

Represents a single checkout (one user request, many vehicles).

rental_orders
- id (PK)
- user_id (FK -> users.id)          // who made the order
- status (enum: draft, ongoing, completed, cancelled)
- total_price_idr (bigint)          // sum of item subtotals
- notes (text, nullable)            // optional admin notes
- created_at
- updated_at


Status semantics:

draft – order created by user; waiting for admin approval/start.

ongoing – admin has started the rental for all items.

completed – rental finished; moved to history.

cancelled – not fulfilled; moved to history.

4.3 New: rental_order_items table

Represents each vehicle in an order with its own config.

rental_order_items
- id (PK)
- rental_order_id (FK -> rental_orders.id)
- vehicle_id (FK -> vehicles.id)

- mode (enum: daily, weekly, monthly)   // user-selected rental mode
- quantity (integer)                    // number of days/weeks/months

- start_at (datetime)                   // user-chosen start date & time
- end_at (datetime)                     // computed end (same time-of-day as start)

- price_per_unit_idr (bigint)          // snapshot from vehicles table at booking time
- subtotal_price_idr (bigint)          // price_per_unit * quantity

- created_at
- updated_at


Note: You mentioned “1 field for the vehicle, start_date”. Here we elevate it to a datetime field start_at, and we also store end_at. If you already have start_date, you can treat it as datetime or rename to start_at.

Relationships (Laravel)

User:

public function rentalOrders() { return $this->hasMany(RentalOrder::class); }

RentalOrder:

public function user() { return $this->belongsTo(User::class); }

public function items() { return $this->hasMany(RentalOrderItem::class); }

RentalOrderItem:

public function order() { return $this->belongsTo(RentalOrder::class, 'rental_order_id'); }

public function vehicle() { return $this->belongsTo(Vehicle::class); }

Vehicle:

public function rentalItems() { return $this->hasMany(RentalOrderItem::class); }

5. Business Rules
5.1 Time Calculation

For each item:

Input:

start_at (datetime)

mode in {daily, weekly, monthly}

quantity int

Calculation:

daily:

end_at = start_at + quantity * 1 day

weekly:

end_at = start_at + quantity * 7 days

monthly (v1 simple):

end_at = start_at + quantity * 30 days

The time-of-day must match:

If start_at = 2025-01-10 11:00

quantity = 5, mode = daily

end_at = 2025-01-15 11:00

Define rental interval as [start_at, end_at) (inclusive start, exclusive end).
That way a new rental starting exactly at end_at does not overlap.

5.2 Pricing Calculation (Per Item)

For each item:

From vehicle:

If mode = daily → price_per_unit_idr = vehicle.price_daily_idr

If mode = weekly → price_per_unit_idr = vehicle.price_weekly_idr

If mode = monthly → price_per_unit_idr = vehicle.price_monthly_idr

Subtotal:

subtotal_price_idr = price_per_unit_idr * quantity

Order total:

total_price_idr = SUM(subtotal_price_idr for all items)

We store price_per_unit_idr and subtotal_price_idr on rental_order_items so changes in vehicles price later do not affect old orders.

5.3 Availability Check (Vehicle Overlaps)

Before creating or starting an order, for each item:

We must ensure selected vehicle is not already rented in that period.

Check against rental_order_items with:

vehicle_id = current_item.vehicle_id

Parent order status in: draft, ongoing (you can choose to exclude draft if you only want to block after admin acceptance; v1: include draft to be safe).

Time overlap rule:

Two intervals [A_start, A_end) and [B_start, B_end) overlap if:

A_start < B_end AND A_end > B_start

Equivalent to: NOT (A_end <= B_start OR A_start >= B_end)

If any overlap is found, the system rejects checkout or start with an error:

“Vehicle {plate_no} is not available between {start_at} and {end_at}.”

5.4 Status Flow

At order level (rental_orders.status):

Initial status:

On user checkout → draft

Transitions:

draft → ongoing (Admin clicks “Start rent” and availability is OK)

draft → cancelled (Admin cancels)

ongoing → completed (Admin marks as finished)

ongoing → cancelled (Admin cancels mid-rent, if needed)

All items follow the order’s status; v1 does not need per-item status.

6. Laravel Implementation Outline
6.1 Routes
// User-facing
Route::middleware(['auth'])->group(function () {
    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::post('/rental-cart/add', [RentalCartController::class, 'add']);
    Route::post('/rental-cart/update', [RentalCartController::class, 'update']);
    Route::post('/rental-cart/checkout', [RentalOrderController::class, 'store']);
    Route::get('/my-orders', [RentalOrderController::class, 'userIndex']);
});

// Admin
Route::middleware(['auth', 'can:manage-orders'])->group(function () {
    Route::get('/admin/orders', [Admin\RentalOrderController::class, 'index']);       // draft + ongoing
    Route::get('/admin/orders/{order}', [Admin\RentalOrderController::class, 'show']);
    Route::post('/admin/orders/{order}/start', [Admin\RentalOrderController::class, 'start']);
    Route::post('/admin/orders/{order}/complete', [Admin\RentalOrderController::class, 'complete']);
    Route::post('/admin/orders/{order}/cancel', [Admin\RentalOrderController::class, 'cancel']);
    Route::get('/admin/orders/history', [Admin\RentalOrderController::class, 'history']);  // completed + cancelled
});

6.2 Bottom “Rental Cart” UI (Concept)

Persistent cart for current session (store in session or temporary DB table).

Fields needed per line:

vehicle_id

mode

quantity

start_at

On each change, front-end recalculates and shows:

end_at

subtotal

grand total

On checkout, send all cart items to RentalOrderController@store.

7. Screens Summary
7.1 Vehicles Page

Card per vehicle with:

Model, plate_no, image

Prices (daily/weekly/monthly)

“Rent” button

Bottom fixed panel (“Rental Cart”):

For each selected vehicle:

Vehicle summary

start_at datetime input

mode select

quantity input

Computed end_at (read-only)

Subtotal

Remove button

Grand total

Checkout button (disabled if cart empty or invalid)

7.2 Admin – Orders List

Show only draft and ongoing.

Columns: ID, user, start-end range, total, status, actions.

7.3 Admin – Order Detail

Header: status, user, created_at.

Items table: vehicle, start_at, end_at, mode, qty, price, subtotal.

Buttons: Start, Complete, Cancel (depending on status).

7.4 Admin – Order History

Shows completed and cancelled.

Filters by date range, user, status.