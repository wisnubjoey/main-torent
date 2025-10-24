## 1. Implementation
- [x] 1.1 Add phone number persistence to users (migration + model fillable) and remove unused email/2FA fields.
- [x] 1.2 Reconfigure Fortify to register and authenticate users with name, phone, and password only, including validation and rate limiting keys.
- [x] 1.3 Update frontend auth forms and routes to use phone-number fields, remove email inputs, and adjust copy.
- [x] 1.4 Remove two-factor authentication backend features, settings routes, controllers, and front-end components.
- [x] 1.5 Update and expand automated tests (PHP + React) to cover the new credential flow and absence of 2FA.
- [x] 1.6 Perform manual QA: registration, login, password reset, and settings screens with phone-based identity.

## 2. Validation
- [x] 2.1 `php artisan test`
- [x] 2.2 `npm run lint`
- [x] 2.3 `npm run types`
