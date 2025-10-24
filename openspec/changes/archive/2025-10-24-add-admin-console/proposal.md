## Why
- Stakeholders want an admin-only surface within the starter so privileged users can manage the product independently.
- Admins should rely on the same phone/password auth pattern as end users to avoid teaching a new credential flow.
- Seeded admin credentials are needed so environments ship with a working admin login out of the box.

## What Changes
- Introduce an admin-only dashboard route and Inertia page gated by a dedicated middleware/guard.
- Reuse phone/password credentials for admin sessions while preventing non-admin accounts from entering the admin area.
- Seed at least one admin account with a deterministic phone number and password for local/testing use.

## Impact
- Adds database flagging for admin access and updates auth pipeline to check that flag.
- Extends routing, middleware, and UI to support the new admin dashboard shell.
- Provides repeatable seeding data; documentation/readme may need an update to call out default admin credentials.
