Product Requirements Document (PRD)
Vehicle Rental Order Module
1. Purpose

This document defines the functional and business requirements for the vehicle rental order module. The system supports simple booking flows without online payments. Verification is handled through WhatsApp after an order is created.

Primary flow:

User selects a vehicle from dashboard → chooses vehicles that is available for the selected date range → submits order (status = draft) → receives WhatsApp verification CTA → admin verifies and progresses the order status until completion.

The PRD focuses exclusively on:

Creating rental orders

Order status lifecycle

Availability checking

WhatsApp verification (not important)

Rental workflows for admin and user

2. Scope

The scope of this module includes:

User capabilities

Browse available vehicles.

Search for vehicles based on availability (date range).

Select rental duration: daily, weekly, or monthly.

Create an order with basic personal info.

Receive a WhatsApp CTA for manual verification (redirect to whatsapp).

Admin capabilities

View all orders by status.

Verify orders manually and update statuses.

Mark rental start and end.

Close or cancel orders.

Not included:

Online payments

Promo codes

Dynamic pricing (later)

Return inspections

Full CRM/customer identity workflows

3. Terminology & Status Models
3.1 Vehicle Status (vehicles.status)

active
Vehicle can be rented.

maintenance
Vehicle unavailable for scheduling.

retired
Vehicle permanently removed from active rental inventory.

3.2 Rental Order Status (rentals.status)

draft
User created the order; awaiting admin verification.

reserved
Admin has verified and locked the dates.

ongoing
Vehicle is handed over to customer; rental period running.

returned
Customer has returned the vehicle; admin review pending.

cancelled
Order voided; no rental occurred.

closed
Order fully completed after return and admin checks.

cancelled and closed are terminal states.

4. Actors
Customer (User)

Selects available vehicle and date range.

Creates a rental order.

Contacts admin via WhatsApp for verification.

Administrator

Reviews and verifies orders (via WhatsApp communication outside system).

Manages order lifecycle.

Ensures vehicle availability.

Marks rental start and finish.

5. Core Flows (Happy Path)
5.1 Order Creation Flow (User)

User selects a vehicle.

User chooses:

Start date

Rental type: daily, weekly, or monthly

Duration (example: 3 days, 2 weeks, 1 month)

System computes:

end_date = start_date + duration

System validates availability:

Vehicle must be active.

No overlapping rentals for the same vehicle with statuses:
reserved, ongoing, or returned.

Explanation of overlapping:
Two date ranges overlap if they share at least one day.

If available:

System displays rental summary and total price.

User submits the order.

System creates order with:

Status = draft

Pricing snapshot (copied from vehicle)

Saved rental details (start_date, end_date, rental type)

Customer info (name, phone, notes)

System displays:

Success message

Order code

WhatsApp CTA button

5.2 WhatsApp Verification Flow

After order creation:

User clicks "Verify on WhatsApp".

System opens:

wa.me/<admin_number>?text=<pre-filled verification message>


User and admin communicate externally (via WhatsApp) for:

Identity verification

Rental confirmation

Additional instructions

No automated payment or approval inside the system.

5.3 Admin Verification Flow (Draft → Reserved)

Admin opens order list (status = draft).

Admin manually verifies user via WhatsApp.

Admin checks availability again (system assistance recommended).

Admin sets status:

draft → reserved

Once reserved:

Vehicle is locked for the selected date range.

No other orders may reserve the same dates for that vehicle.

5.4 Rental Start (Reserved → Ongoing)

On the actual handover day, admin updates:

reserved → ongoing

System records:

actual_start_datetime (optional)

During ongoing, the vehicle remains unavailable.

5.5 Rental End & Completion (Ongoing → Returned → Closed)

Upon vehicle return:

Admin updates ongoing → returned

After checks & admin processing:

Admin updates returned → closed

6. Alternative Flows (Cancellation)
Draft State Cancellation

Admin may cancel:
draft → cancelled
(e.g., user unresponsive)

Reserved State Cancellation

Admin may cancel:
reserved → cancelled
(e.g., user backs out before pickup)

Orders in ongoing cannot be cancelled. They must follow:

ongoing → returned → closed

7. Business Rules

Vehicle availability is determined by:

vehicles.status = active

No date overlaps with existing rental orders in status:
reserved, ongoing, returned

Total rental price uses vehicle’s pricing fields:

price_daily_idr

price_weekly_idr

price_monthly_idr

When the order is created:

Prices are copied into the rental order (pricing snapshot).

This preserves historical records even if vehicle pricing changes later.

WhatsApp contact number must be configurable.

No payment logic is included in this phase.

8. Data Specification (Order Entity)

Minimum fields required:

id

order_code

user_id (or simple customer contact fields)

vehicle_id

status

start_date

end_date

rental_unit (daily, weekly, monthly)

rental_quantity (number of days/weeks/months)

price_daily_snapshot

price_weekly_snapshot

price_monthly_snapshot

total_price

customer_name

customer_phone

customer_notes

actual_start_datetime (optional)

actual_end_datetime (optional)

created_at

updated_at

9. Future Extensions (Not Required Now) NOT IMPORTANT FOR NOW!

This PRD anticipates but does not require:

Dynamic pricing

Coupon/discount system

Auto-reminders (email/WhatsApp)

Order aging & auto-cancel (e.g., draft expires after X hours)

Payment module

Cross-branch vehicle management

Mobile app API

Feature that already implemented :
- User dashboard reorganization with structured page hierarchy (dashboard/index and dashboard/vehicles)
- Navigation system with sidebar menu including Dashboard and Vehicles links
- Vehicle management system for admin (brand, vehicle class, and vehicle management)
- Public vehicles page with vehicle listing
- User authentication system (login, register)
- Admin authentication system with separate login
- Vehicle image management (primary and secondary images)
- Basic UI components and layouts for both user and admin interfaces
- Route management with Laravel Inertia.js integration
- Responsive design with Tailwind CSS and shadcn/ui components