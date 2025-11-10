# Torent Image Module – Minimal Plan (Deadline-Friendly)

## Goals
- Add primary image (nullable) to `vehicles`.
- Add secondary images (nullable, max 10) per vehicle.
- Use Laravel public storage with simple paths.
- Keep files original (no optimization, no orientation fixes).
- Simple admin UX: upload/replace/delete primary; upload/delete/reorder secondary; set secondary as primary.
- Optional alt text per image.

## Decisions (Confirmed)
- Storage: `public` disk; URLs via `/storage/...` (requires `php artisan storage:link`).
- File types: `jpeg`, `png`, `webp`.
- Max size: 50 MB per image.
- Primary/secondary can be null; fallback static image shown if primary missing.
- No CDN, caching, responsive variants, or security extras for now.

## Storage Layout
- Primary: `vehicles/{vehicle_id}/primary/{hashed}.{ext}`
- Secondary: `vehicles/{vehicle_id}/secondary/{uuid}.{ext}`
- Store only the path in DB. Generate URL with `Storage::disk('public')->url($path)`.

## Database Changes
- Vehicles table:
  - Add `primary_image_path` (string, nullable).
  - Add `primary_image_alt` (string, nullable) — optional but ready if needed.
  - Note: If DB is already migrated and not resetting, create a new migration to add these columns.

- New table: `vehicle_images` (secondary images):
  - `id` (PK), `vehicle_id` (FK → `vehicles.id`, cascade on delete).
  - `path` (string, not null).
  - `position` (unsigned tiny int 0–9).
  - `alt_text` (string, nullable).
  - `created_at`, `updated_at`.
  - Unique index: (`vehicle_id`, `position`) to keep order consistent.

## Models
- `Vehicle`:
  - Relationship: `hasMany(VehicleImage::class)` for secondaries.
  - Accessor: `image_url` returns public URL from `primary_image_path` or null.
  - Helper: `secondaryImagesOrdered()` returns secondaries ordered by `position`.

- `VehicleImage`:
  - `belongsTo(Vehicle::class)`.

## Validation
- Primary upload: `required|image|mimes:jpeg,png,webp|max:51200`.
- Secondary upload: `required|image|mimes:jpeg,png,webp|max:51200`.
- Reorder: `position` must be 0–9; enforce unique per vehicle.

## Controllers & Endpoints (Admin)
- Primary image:
  - Upload/replace: store to `public`, set `primary_image_path`, optional `primary_image_alt`.
  - Delete: remove file; set `primary_image_path` null (fallback static image in UI).

- Secondary images:
  - Upload (single or multiple): store to `public`; auto-assign next available `position` (0–9).
  - Delete: remove file; free the `position`.
  - Reorder: update `position` values (ensure uniqueness).
  - Set as Primary: copy selected secondary’s path into `primary_image_path`, then
    - Option B (chosen): remove the secondary record to avoid duplicates.

- Routes (example structure):
  - `POST /admin/vehicles/{vehicle}/primary` (upload/replace)
  - `DELETE /admin/vehicles/{vehicle}/primary` (delete)
  - `POST /admin/vehicles/{vehicle}/secondary` (upload)
  - `DELETE /admin/vehicles/{vehicle}/secondary/{image}` (delete)
  - `PUT /admin/vehicles/{vehicle}/secondary/reorder` (bulk reorder)
  - `POST /admin/vehicles/{vehicle}/secondary/{image}/promote` (set as primary)
  - `PUT /admin/vehicles/{vehicle}/secondary/{image}/alt` (update alt text)

## Admin UI (Simple First)
- Primary:
  - Show current primary or fallback static image.
  - File input + upload button.
  - Delete button.

- Secondary:
  - Multi-file upload (prevent >10).
  - List/grid:
    - Thumbnail, optional alt text field.
    - Buttons: Delete, Set as Primary.
    - Position field (0–9) with save; drag-drop can be added later.

- Counter: Display “x/10 images used”.

## Business Rules
- Primary deletion: UI shows static fallback.
- Secondary cap: reject the 11th image with a friendly message.
- Positions: integers 0–9, unique per vehicle.
- Replace primary: delete old primary file.
- Promote secondary→primary: set primary path, delete secondary record.

## Cleanup
- On vehicle delete: delete `vehicles/{vehicle_id}` directory (primary + all secondaries).
- On primary replace and secondary delete: delete corresponding files.

## Setup Steps
1. Run: `php artisan storage:link` (exposes `/storage` URLs).
2. Run migrations to add primary cols and create `vehicle_images`.
3. Verify `config/filesystems.php` has `public` disk configured (default Laravel settings).
4. Add static fallback image in your frontend assets and reference it when `image_url` is null.

## Testing (Minimal)
- Upload primary: path saved, file exists in `storage/app/public`, URL loads via `/storage/...`.
- Delete primary: path null, fallback visible.
- Upload up to 10 secondaries; 11th is blocked.
- Reorder positions and verify order is reflected.
- Promote secondary to primary and confirm secondary record removed.
- Vehicle delete removes directory.

## Timeline (Fast Path)
- Migrations + models: 1–2 hours.
- Controllers + routes: 1–2 hours.
- Simple admin views: 2–3 hours.
- Manual test pass: 1 hour.
- Buffer: 1 hour.

## Future Enhancements (Post-Deadline)
- Image optimization and WebP generation.
- Drag-drop reorder UX.
- Responsive delivery (`srcset`) and caching headers.
- Security: strict validation, rate limiting, signed URLs for private content if needed.
- Observability: upload metrics and error tracking.