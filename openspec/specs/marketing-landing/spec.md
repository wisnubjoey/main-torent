# marketing-landing Specification

## Purpose
TBD - created by archiving change add-landing-page-layout. Update Purpose after archive.
## Requirements
### Requirement: Hero Booking Section
Landing page MUST open with a hero containing a strong headline, short subheadline, search form, trust badges, and vacation-themed imagery.

#### Scenario: Hero content order
- **GIVEN** a visitor loads the landing page
- **THEN** the headline renders before the subheadline
- **AND** the booking form appears immediately after the subheadline
- **AND** the booking form includes inputs for pickup location, pickup date, pickup time, and vehicle type

#### Scenario: Trust and visual cues
- **GIVEN** the hero renders
- **THEN** trust badges include an aggregate rating and "20k+ trips" copy
- **AND** a hero image or illustration of a vacation car displays alongside the form

### Requirement: Family Recommendations
Landing page MUST showcase family-friendly vehicle recommendations directly below the hero section.

#### Scenario: Family vehicles section
- **GIVEN** the landing page is viewed
- **THEN** a section titled for family trips or vacations highlights recommended vehicles with descriptive copy and imagery

### Requirement: Teaser Vehicle Grid
Landing page MUST preview four vehicles as a teaser to the full catalog with responsive layout and filters.

#### Scenario: Vehicle card details
- **GIVEN** the vehicle teaser grid renders
- **THEN** exactly four vehicle cards display
- **AND** each card includes a vehicle photo, name or model, short specs (e.g., seats, transmission, luggage or fuel type), price per day, and a small CTA button labeled "View Details" or similar

#### Scenario: Layout responsiveness
- **GIVEN** the viewport is desktop width
- **THEN** vehicle cards render in a four-column grid
- **AND** tablet view collapses to two columns
- **AND** mobile view collapses to a single column

#### Scenario: Filtering cues
- **GIVEN** the teaser section renders
- **THEN** filters for seats, luggage capacity, and fuel efficiency are visible above or beside the grid

#### Scenario: View all CTA
- **GIVEN** the teaser grid renders
- **THEN** a primary CTA button labeled "View All Vehicles" appears immediately below the grid and links to the full catalog route

### Requirement: Premium and Sport Highlights
Landing page MUST emphasize premium vehicles and performance-focused sports cars with distinct calls to action.

#### Scenario: Premium carousel
- **GIVEN** the premium section renders
- **THEN** a carousel or horizontal slider showcases high-end vehicles with elegant visuals and a CTA to compare or book

#### Scenario: Sport car metrics
- **GIVEN** the sport cars section renders
- **THEN** cards highlight horsepower, 0–100 km/h time, and transmission details
- **AND** a CTA such as "Check Weekend Availability" is present

### Requirement: Features and Achievements
Landing page MUST provide trust features and optional achievement metrics.

#### Scenario: Feature icon grid
- **GIVEN** the features section renders
- **THEN** at least six features display using icon + text pairs, covering Full Insurance, Always Clean Vehicles, Airport/Hotel Delivery, 24/7 Assistance, Flexible Cancellation, and Secure Payment

#### Scenario: Achievement counters
- **GIVEN** achievements are available
- **THEN** the landing page surfaces stats such as total vehicles, cities served, or on-time percentage in a visually grouped format near the features section

### Requirement: Contact and Footer
Landing page MUST give multiple contact options, location, operating hours, and footer meta information.

#### Scenario: Contact block
- **GIVEN** the contact section renders
- **THEN** WhatsApp and an urgent call option are displayed with actionable links or buttons
- **AND** business hours and a map embed or preview appear together in the section

#### Scenario: Footer contents
- **GIVEN** the footer is rendered
- **THEN** it includes navigation links for About, Terms, Privacy, and Help Center
- **AND** social media links, payment/security badges, and company legal information are visible

