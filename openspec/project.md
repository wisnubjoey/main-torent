# OpenSpec – Project

## Overview
- **Working name:** torent-7 (Laravel React Starter Kit)
- **Purpose:** opinionated starter for building full-stack Laravel apps with an Inertia-powered React frontend, modern auth flows, and a polished UI shell.
- **Audience:** teams shipping Laravel + React products that need authentication, user settings, and themeable scaffolding out of the box.

## Core Capabilities
- **Authentication & onboarding:** Laravel Fortify handles login, registration, password resets, email verification, and two-factor challenges; front-end pages live in `resources/js/pages/auth`.
- **Dashboard shell:** `AppLayout` (`resources/js/layouts/app-layout.tsx`) composes sidebar, header, breadcrumb, and responsive content regions using shadcn-inspired UI components.
- **Account settings:** Routes under `/settings/*` surface profile editing, password updates, appearance preferences, and 2FA management (`routes/settings.php` + controllers in `app/Http/Controllers/Settings`).
- **Theme management:** `HandleAppearance` middleware shares the persisted appearance cookie with Blade (`resources/views/app.blade.php`), while the `useAppearance` hook (`resources/js/hooks/use-appearance.tsx`) syncs system preference, local storage, and SSR cookies.
- **Typed routing helpers:** `laravel/wayfinder` generates TypeScript-safe route builders in `resources/js/routes`, mirrored by route definitions in `routes/*.php`.

## Tech Stack
- **Backend:** Laravel 12, PHP ≥ 8.2, Inertia server adapter, Laravel Fortify, Laravel Wayfinder, Laravel Pail (live log viewer), and queue listeners (`composer.json` `dev` script runs `php artisan queue:listen`).
- **Frontend:** React 19 + TypeScript 5.7 via @inertiajs/react, Vite 7 bundler with SSR support (`npm run build:ssr`), Tailwind CSS 4 (via `@tailwindcss/vite`), shadcn/ui-style components, Radix UI primitives, Headless UI, lucide-react icons, clsx + tailwind-merge utilities.
- **Styling:** One Tailwind entrypoint (`resources/css/app.css`) declares design tokens with CSS variables, custom `dark` variant, and imports `tw-animate-css` animations.
- **Data layer:** Fortify ships with SQLite by default (`.env.example`), but Laravel’s database configuration supports swapping drivers; first-party migrations live under `database/migrations`.

## Application Structure & Conventions
- **Domain-driven folders:** Backend code follows PSR-4 (`App\\` autoload) with actions under `app/Actions`, feature-specific controllers in `app/Http/Controllers`, and form requests in `app/Http/Requests`. Frontend mirrors that separation with `actions/`, `hooks/`, `lib/`, `layouts/`, and `pages/`.
- **Layouts & pages:** Each page in `resources/js/pages` renders through an Inertia component. Layouts (e.g., `layouts/app`, `layouts/auth`, `layouts/settings`) encapsulate scaffolding and are imported per page instead of using nested routers.
- **State & data flow:** `HandleInertiaRequests` middleware shares `auth.user`, `sidebarOpen`, and motivational quotes with every Inertia response; TypeScript definitions for that shared payload reside in `resources/js/types/index.d.ts`.
- **Typed server interactions:** `resources/js/actions` exposes namespaced helpers (e.g., `Laravel.Fortify`) that wrap form submissions or redirects, keeping Inertia forms DRY.
- **Routing:** Route definitions live in `routes/web.php` and `routes/settings.php`; Wayfinder mirrors those endpoints into TS functions (e.g., `dashboard()`) so components never hardcode URLs.
- **Middleware:** `bootstrap/app.php` registers encryption exceptions for `appearance` and `sidebar_state` cookies and appends middleware that share SSR-ready appearance state and asset link headers.

## Tooling & Developer Experience
- **Composer scripts:** `composer run setup` bootstraps PHP deps, seeds `.env`, runs migrations, installs npm packages, and builds assets. `composer run dev` launches the entire dev stack (Laravel server, queue listener, pail log viewer, Vite) via `concurrently`. `composer run dev:ssr` swaps the Vite process for the SSR server.
- **NPM scripts:** `npm run dev` (Vite dev server), `npm run build` (production bundle), `npm run build:ssr` (client + SSR builds), `npm run lint` (ESLint 9 flat config with React & TS rules), `npm run types` (tsc `--noEmit`), and `npm run format[:check]` (Prettier with organize-imports & Tailwind plugins).
- **Editor settings:** `.editorconfig` enforces LF endings, UTF-8, 4-space indentation (2 for YAML), and preserves Markdown trailing whitespace. `.prettierrc` sets 4-space tabs, single quotes, 80-character width, and integrates Tailwind + organize-imports plugins.
- **Linting:** `eslint.config.js` composes `@eslint/js` recommended rules with `eslint-plugin-react`, `eslint-plugin-react-hooks`, and `typescript-eslint` configs; Prettier runs last to neutralize stylistic conflicts.
- **TypeScript config:** `tsconfig.json` targets ESNext modules, uses bundler resolution, and treats the project as ESM (`package.json` `"type": "module"`).

## UI Patterns
- **Component organization:** Base UI primitives derived from shadcn live in `resources/js/components/ui`; feature components (`app-sidebar`, `appearance-dropdown`, etc.) sit beside them in `resources/js/components`.
- **Class management:** `cn` utility (`resources/js/lib/utils.ts`) merges Tailwind classes with `clsx` and `tailwind-merge`; use it for conditional class names instead of string concatenation.
- **Head management:** Pages use Inertia’s `<Head>` component for titles/meta; default title is `import.meta.env.VITE_APP_NAME || 'Laravel'`.
- **Theme switching:** Appearance is stored in `localStorage` + cookie, toggled by UI in `resources/js/components/appearance-*`. Dark mode toggles `document.documentElement.classList` and updates `color-scheme`.

## Testing & Quality Gates
- **PHP tests:** Pest 4 with the Laravel plugin; Feature tests gain `RefreshDatabase` by default via `tests/Pest.php`. Run `php artisan test` (also invoked by `composer test` script) for the full suite.
- **JavaScript checks:** `npm run lint`, `npm run types`, and `npm run format:check` ensure TS types, ESLint rules, and formatting stay consistent.
- **Manual QA:** Queue workers and SSR can be exercised by running `composer run dev:ssr`, ensuring Inertia SSR responses and Fortify flows work end-to-end.

## Deployment Notes
- **Build pipeline:** Run `npm run build` before deployment; `php artisan inertia:start-ssr` (triggered via `composer dev:ssr`) is available when SSR hosting is required.
- **Environment:** Ensure required Fortify environment variables (mail, 2FA, queue connection) are configured. Default `.env.example` uses SQLite; switch to your production driver and run `php artisan migrate --force`.
- **Caching:** Apply standard Laravel optimizations (`php artisan config:cache`, `route:cache`, `event:cache`) once configuration stabilizes; Wayfinder regenerates TS routes during `npm run build` via Vite plugin.

## Operational Conventions
- **Queues:** Dev workflow keeps a `queue:listen` process running; configure production queues (e.g., Redis, SQS) and supervisors accordingly.
- **Logs:** Laravel Pail (`php artisan pail --timeout=0`) provides pretty logs in development; integrate with your centralized logging in production.
- **Sidebar state:** UI persists sidebar openness via `sidebar_state` cookie—clear it or adjust cookie handling when altering shell behavior.

## Next Steps & Customization Hooks
- Add domain modules by following the established folder boundaries (controllers + requests on the backend, `pages/*` + `components/*` on the frontend).
- Generate additional typed routes with Wayfinder when you add new Laravel routes so TS helpers stay in sync.
- Extend Fortify actions (`app/Actions/Fortify`) and Settings controllers for further account features (e.g., profile photos, notification preferences).

