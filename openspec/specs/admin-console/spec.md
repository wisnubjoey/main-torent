# admin-console Specification

## Purpose
TBD - created by archiving change add-admin-console. Update Purpose after archive.
## Requirements
### Requirement: Admin Login Uses Phone Credentials
Admin authentication MUST accept the same phone number + password combination as end-user login and MUST only succeed for accounts flagged as admins.

#### Scenario: Admin login succeeds
- **GIVEN** an admin account exists with phone `P` and password `S`
- **WHEN** the admin submits the admin login form with `P` and `S`
- **THEN** the session is authenticated as an admin
- **AND** the admin is redirected to the admin dashboard route

#### Scenario: Non-admin login rejected
- **GIVEN** a non-admin account exists with phone `P`
- **WHEN** the account holder submits the admin login form with `P` and the correct password
- **THEN** authentication fails with an error referencing admin access
- **AND** no admin session is created

### Requirement: Admin Dashboard Is Protected
The admin dashboard MUST render at `/admin/dashboard` and MUST only be accessible to authenticated admin accounts.

#### Scenario: Authenticated admin sees dashboard
- **GIVEN** an authenticated admin session
- **WHEN** the admin navigates to `/admin/dashboard`
- **THEN** the admin dashboard page is rendered via Inertia without redirect

#### Scenario: Non-admin blocked from admin dashboard
- **GIVEN** an authenticated non-admin user session
- **WHEN** the user requests `/admin/dashboard`
- **THEN** the request is rejected (HTTP 403 or redirect to admin login)
- **AND** the admin dashboard Inertia page is not rendered

### Requirement: Seed Admin Credentials
Database seeding MUST create at least one admin account with deterministic phone and password values documented for local use.

#### Scenario: Seeder creates admin
- **WHEN** `php artisan db:seed` is run
- **THEN** an admin user record exists with phone `5550000001`
- **AND** the account is marked as admin with the password `password`
- **AND** rerunning the seeder does not create duplicates

