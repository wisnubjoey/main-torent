1. [x] Add an `is_admin` flag to the users table (migration + model fillable/casts) and seed data relationships.
2. [x] Introduce admin authentication flow (controller/action, routes, guard config) that validates `is_admin` while using phone/password credentials.
3. [x] Build admin-only middleware + route group that renders a new Inertia admin dashboard page.
4. [x] Create reusable admin login page/component mirroring phone/password UX and wire it into the new flow.
5. [x] Seed deterministic admin accounts (phone + password) via a dedicated seeder and hook it into `DatabaseSeeder`.
6. [x] Add feature tests covering admin login success, rejection of non-admin users, and admin dashboard access control.
7. [x] Run `php artisan test` (and relevant JS lint/type checks if needed) to validate the change.
