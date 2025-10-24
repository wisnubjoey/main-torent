## Why
- Stakeholders want to simplify sign-in by dropping email-based credentials and moving to name + phone + password only.
- Two-factor authentication adds extra steps in settings that no longer match the desired security model and should be removed.

## What Changes
- Update authentication flows to collect and validate name, phone number, and password while removing email usage across registration and login.
- Remove all two-factor authentication configuration, UI, and backend hooks from profile settings and login flows.
- Adjust persistence, validation rules, and tests so that users authenticate with the new credentials and no 2FA screens or routes are exposed.

## Impact
- Database schema changes are required to store phone numbers and potentially drop email/2FA columns.
- Frontend auth and settings pages must be rewritten to use phone-first fields and hide 2FA options.
- Existing users may need migration or backfill; rollout plan must account for any stored emails or 2FA secrets.
