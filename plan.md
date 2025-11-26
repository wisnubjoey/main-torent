✅ USER FLOW (Human Explanation)
1. User logs in

The user enters the system with their account. Nothing complex here — they just authenticate.

2. User chooses a vehicle

They go to the Vehicles menu, browse available vehicles, and select the ones they want to rent.

When they click “Add to Cart,” the chosen vehicles are placed in a temporary cart (stored behind the scenes in session or database).

3. Cart appears on the top

A small cart component shows:

Vehicles selected

Quantity

Maybe a price preview

This lets the user keep track while browsing.

4. Checkout

The user clicks the Checkout button where they:

Review selected vehicles

Set rental configuration:

Start date

Time type (daily / weekly / monthly)

Duration (ex: 3 weeks)

Quantity (how many units)

The system calculates total rental time and price based on the configuration.
No order is created yet — the user is still editing.

5. User applies the order

When the user presses Confirm, the system creates a “new order” with the status:

🔵 Waiting for Approval

Then a popup appears:

“Please confirm your order with customer service.”

This acts as a reminder for the customer to make contact if needed.

6. My Orders page

The user goes to My Orders, where they see:

Their pending orders

Status such as:

Waiting for Approval

On Going

Cancelled

This page ONLY shows active or pending orders.

Completed orders do not stay here.

7. Order completion (User side)

Once the rental ends (after admin finishes it), the order:

Disappears from “My Orders”

Moves into Orders History

Status becomes Completed

This keeps “My Orders” clean and only shows what’s still active.

✅ ADMIN FLOW (Human Explanation)
1. Admin dashboard

Admin logs in and sees newly created orders waiting for review.

2. Approval menu

All orders that users have submitted appear here with the status:

🟡 Waiting for Approval

Admin has two choices per order:

Approve

Cancel

When admin approves:

Order status changes to:

🔵 On Going

Order disappears from the Approval list and moves to the On Going list.

When admin cancels:

Order status becomes:

🔴 Cancelled
3. On Going orders

This list shows all rentals currently active.

The system automatically checks the end date of each order.

When the rental period is finished, the “Complete” button for that order:

Becomes active

Turns green

This is a visual signal:

“This rental is ready to be completed.”

Admin clicks Complete when the rental is fully finished.

4. Order moves to History

After admin marks an order as completed:

It disappears from the On Going list

It moves into Order History

Status becomes Completed

This keeps active lists short and organized.

🔍 Overall System Logic (Simple Technical Explanation)

Each order has a status that changes throughout its life:
Waiting for Approval → On Going → Completed (or Cancelled)

User has access to:

My Orders → only active statuses

Order History → completed only

Admin manages:

Approval

Active rental monitoring

Completing finished rentals

Rental time (daily/weekly/monthly) is calculated automatically using:

Start date

Type of rent

Duration

This lets the system know when the rental should end and when to activate the “Complete” button.