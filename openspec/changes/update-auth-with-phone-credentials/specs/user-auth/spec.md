## ADDED Requirements

### Requirement: Phone-Based Registration
Registration MUST collect name, phone number, and password; email MUST NOT be required or stored.

#### Scenario: Registration form fields
- **GIVEN** a visitor opens the registration page
- **THEN** the form displays inputs for name, phone number, password, and password confirmation
- **AND** no email input or email-specific copy is rendered

#### Scenario: Phone uniqueness validation
- **WHEN** a registration attempt reuses a phone number that already belongs to another account
- **THEN** validation fails with an error referencing the phone number field
- **AND** no user record is created

### Requirement: Phone Credential Login
Authentication MUST use phone number + password as credentials and MUST bypass any two-factor challenge.

#### Scenario: Login form inputs
- **GIVEN** a visitor opens the login page
- **THEN** the credentials section contains phone number and password inputs
- **AND** the UI text references phone-based login rather than email
- **AND** no forgot-password link is rendered until a phone-based recovery flow exists

#### Scenario: Successful login without 2FA
- **GIVEN** an account exists with phone number `P` and matching password
- **WHEN** the user submits the login form with `P` and the correct password
- **THEN** the user is authenticated and redirected to the dashboard
- **AND** the session is NOT redirected to a two-factor challenge route

### Requirement: Phone Management in Profile Settings
Profile settings MUST allow updating the phone number alongside the name while omitting email-focused UI.

#### Scenario: Profile fields
- **GIVEN** an authenticated user visits profile settings
- **THEN** the form shows inputs for name and phone number only
- **AND** no email field, email verification prompts, or copy referencing email appear

#### Scenario: Phone update validation
- **WHEN** a user submits a phone number that belongs to another account
- **THEN** the update is rejected with a validation error bound to the phone field
- **AND** the user's stored phone number is not changed

### Requirement: Remove Two-Factor Management
The product MUST not expose two-factor authentication management UI, routes, or data requirements.

#### Scenario: Settings navigation hides 2FA
- **GIVEN** an authenticated user opens the settings navigation
- **THEN** no menu item or link for two-factor authentication is present

#### Scenario: Legacy 2FA route returns 404
- **WHEN** a client requests the previous `/settings/two-factor` route
- **THEN** the server responds with HTTP 404 Not Found (or equivalent) to indicate the feature is removed
